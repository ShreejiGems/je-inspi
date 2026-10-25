import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { createHash } from 'node:crypto';
import { compare } from 'src/shared/module/bcrypt/bcrypt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordResetGuard, PasswordResetService, RESET_MESSAGE } from './password-reset.service';
const request = require('supertest');
const send = jest.fn();
jest.mock('mailgun.js', () => ({ __esModule: true, default: jest.fn().mockImplementation(() => ({
  client: () => ({ messages: { create: send } }),
})) }));
const token = 'a'.repeat(64);
const tokenHash = createHash('sha256').update(token).digest('hex');
describe('Password reset', () => {
  let service: PasswordResetService;
  let db: any;
  let env: NodeJS.ProcessEnv;
  beforeEach(() => {
    env = { ...process.env };
    Object.assign(process.env, { NODE_ENV: 'test', PASSWORD_RESET_URL: 'https://shop.example/reset-password',
      MAILGUN_API_KEY: 'test-key', MAILGUN_DOMAIN: 'mail.example', MAIL_FROM: 'hello@mail.example' });
    send.mockReset().mockResolvedValue({});
    db = {
      user: { findFirst: jest.fn().mockResolvedValue({ id: 'customer', email: 'customer@example.com' }) },
      passwordResetToken: {
        findUnique: jest.fn().mockResolvedValue({ userId: 'customer', tokenHash, expiresAt: new Date(Date.now() + 60000) }),
        upsert: jest.fn(), deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      password: { upsert: jest.fn() }, userSession: { updateMany: jest.fn() },
      passwordResetRateLimit: { findUniqueOrThrow: jest.fn().mockResolvedValue({ count: 1 }) }, $executeRaw: jest.fn(),
    };
    db.$transaction = jest.fn((fn) => fn(db));
    service = new PasswordResetService({ prisma: db } as any);
  });
  afterEach(() => { process.env = env; });
  it('emails a random secret in the fragment and stores only its hash', async () => {
    await service.deliver('customer@example.com');
    const email = send.mock.calls[0][1];
    const secret = /#token=([a-f0-9]{64})/.exec(email.text)[1];
    const saved = db.passwordResetToken.upsert.mock.calls[0][0].create;
    expect(saved.tokenHash).toBe(createHash('sha256').update(secret).digest('hex'));
    expect(JSON.stringify(saved)).not.toContain(secret);
    expect(saved.expiresAt.getTime()).toBeGreaterThan(Date.now() + 14 * 60000);
    expect(email['o:tracking-clicks']).toBe('no');
  });
  it('does not email unknown accounts', async () => {
    db.user.findFirst.mockResolvedValue(null);
    await service.deliver('unknown@example.com');
    expect(send).not.toHaveBeenCalled();
  });
  it('returns a generic response when account throttling suppresses delivery', async () => {
    jest.spyOn(service, 'allow').mockResolvedValue(false);
    expect(await service.request('unknown@example.com')).toEqual({ message: RESET_MESSAGE });
    expect(await service.request('customer@example.com')).toEqual({ message: RESET_MESSAGE });
    expect(db.user.findFirst).not.toHaveBeenCalled();
  });
  it('removes an undelivered token without propagating provider secrets', async () => {
    send.mockRejectedValue(new Error('sensitive provider payload'));
    await expect(service.deliver('customer@example.com')).rejects.toThrow('Password reset delivery failed');
    expect(db.passwordResetToken.deleteMany).toHaveBeenCalled();
  });
  it('hashes passwords, atomically consumes tokens and revokes sessions', async () => {
    await service.reset(token, 'correct horse battery staple');
    expect(await compare('correct horse battery staple', db.password.upsert.mock.calls[0][0].update.password)).toBe(true);
    expect(db.passwordResetToken.deleteMany).toHaveBeenCalledWith({ where: {
      userId: 'customer', tokenHash, expiresAt: { gt: expect.any(Date) },
    } });
    expect(db.userSession.updateMany).toHaveBeenCalledWith({ where: { userId: 'customer' }, data: { isDeleted: true } });
  });
  it.each(['missing', 'expired', 'used'])('rejects %s tokens without updating passwords', async (kind) => {
    if (kind === 'missing') db.passwordResetToken.findUnique.mockResolvedValue(null);
    if (kind === 'expired') db.passwordResetToken.findUnique.mockResolvedValue({ expiresAt: new Date(0) });
    if (kind === 'used') db.passwordResetToken.deleteMany.mockResolvedValue({ count: 0 });
    await expect(service.reset(token, 'correct horse battery staple')).rejects.toBeInstanceOf(BadRequestException);
    expect(db.password.upsert).not.toHaveBeenCalled();
  });
  it.each(['short', '😀'.repeat(20)])('rejects unsafe password lengths', async (password) => {
    await expect(service.reset(token, password)).rejects.toBeInstanceOf(BadRequestException);
    expect(db.password.upsert).not.toHaveBeenCalled();
  });
  it('enforces the shared rate threshold', async () => {
    db.passwordResetRateLimit.findUniqueOrThrow.mockResolvedValue({ count: 21 });
    expect(await service.allow('ip:127.0.0.1', 20)).toBe(false);
  });
  it('requires HTTPS in production despite an untrusted forwarded header', async () => {
    process.env.NODE_ENV = 'production';
    const context = { switchToHttp: () => ({ getRequest: () => ({ secure: false, headers: { 'x-forwarded-proto': 'https' } }) }) };
    await expect(new PasswordResetGuard(service).canActivate(context as any)).rejects.toThrow('HTTPS is required');
  });
  it('returns 429 when the client IP has exceeded its limit', async () => {
    jest.spyOn(service, 'allow').mockResolvedValue(false);
    const context = { switchToHttp: () => ({ getRequest: () => ({ ip: '127.0.0.1' }) }) };
    await expect(new PasswordResetGuard(service).canActivate(context as any)).rejects.toMatchObject({ status: 429 });
  });
  it('rejects an insecure production reset-link configuration', async () => {
    process.env.NODE_ENV = 'production';
    process.env.PASSWORD_RESET_URL = 'http://shop.example/reset-password';
    await expect(service.deliver('customer@example.com')).rejects.toThrow('Invalid password reset URL');
    expect(send).not.toHaveBeenCalled();
  });
  it('disables the previous password-reset OTP path', async () => {
    const legacy = Object.create(AuthService.prototype) as AuthService;
    await expect(legacy.sendOtp({ email: 'customer@example.com', otpType: 'FORGET_PASSWORD' } as any))
      .rejects.toThrow('Use request-password-reset');
  });
  describe('HTTP validation', () => {
    let app: any;
    beforeEach(async () => {
      const module = await Test.createTestingModule({ controllers: [AuthController], providers: [
        { provide: AuthService, useValue: {} }, { provide: PasswordResetService, useValue: service },
      ] }).overrideGuard(PasswordResetGuard).useValue({ canActivate: () => true }).compile();
      app = module.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
      await app.init();
    });
    afterEach(async () => { await app.close(); });
    it('rejects the old email/password query bypass', async () => {
      await request(app.getHttpServer()).post('/auth/change-password?email=customer@example.com&password=attacker').expect(400);
      expect(db.password.upsert).not.toHaveBeenCalled();
    });
    it('requires the reset token in the POST body', async () => {
      await request(app.getHttpServer()).post('/auth/change-password').send({ email: 'customer@example.com', password: 'correct horse battery staple' }).expect(400);
      await request(app.getHttpServer()).post('/auth/change-password').send({ token, password: 'correct horse battery staple' }).expect(201);
    });
    it('normalizes emails and uses a uniform response for unknown and existing accounts', async () => {
      const allow = jest.spyOn(service, 'allow').mockResolvedValue(false);
      const a = await request(app.getHttpServer()).post('/auth/request-password-reset').send({ email: ' Customer@Example.com ' }).expect(201);
      const b = await request(app.getHttpServer()).post('/auth/request-password-reset').send({ email: 'unknown@example.com' }).expect(201);
      expect(a.body).toEqual(b.body);
      expect(allow).toHaveBeenCalledWith('email:customer@example.com', 3);
    });
    it('validates reset emails', async () => {
      await request(app.getHttpServer()).post('/auth/request-password-reset').send({ email: 'invalid' }).expect(400);
    });
  });
});
