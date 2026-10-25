import {
  BadRequestException, CanActivate, ExecutionContext, ForbiddenException,
  HttpException, Injectable, Logger,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from 'src/shared/module/prisma/prisma.service';
import { encrypt } from 'src/shared/module/bcrypt/bcrypt';
import Mailgun from 'mailgun.js';

export const RESET_MESSAGE = 'If an eligible account exists, a password reset link will be emailed shortly.';
const INVALID_TOKEN = 'This reset link is invalid or expired. Request a new link.';
const WINDOW_MS = 15 * 60 * 1000;
const hash = (value: string) => createHash('sha256').update(value).digest('hex');

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);
  constructor(private readonly database: PrismaService) {}

  async allow(key: string, limit: number): Promise<boolean> {
    const now = Date.now();
    const window = Math.floor(now / WINDOW_MS);
    const id = hash(`${key}:${window}`);
    // Database-side increment, shared by every application worker.
    return this.database.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`INSERT INTO PasswordResetRateLimit (id, count, expiresAt)
        VALUES (${id}, 1, ${new Date((window + 1) * WINDOW_MS)})
        ON DUPLICATE KEY UPDATE count = count + 1`;
      const entry = await tx.passwordResetRateLimit.findUniqueOrThrow({ where: { id } });
      return entry.count <= limit;
    });
  }

  async request(email: string) {
    // Apply this even for unknown accounts; account throttling has the same response.
    if (await this.allow(`email:${email}`, 3)) {
      // Lookup and email happen after returning, avoiding account-dependent response timing.
      // No token, email address or provider error payload is written to logs.
      setImmediate(() => {
        void this.deliver(email).catch(() => this.logger.error('Password reset delivery failed'));
      });
    }
    return { message: RESET_MESSAGE };
  }

  private resetUrl(token: string) {
    const url = new URL(process.env.PASSWORD_RESET_URL || '');
    const local = ['localhost', '127.0.0.1'].includes(url.hostname);
    if (url.username || url.password || url.search || url.hash ||
      (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && local && url.protocol === 'http:'))) {
      throw new Error('Invalid password reset URL configuration');
    }
    // A fragment keeps the secret out of HTTP request URLs and access logs.
    url.hash = `token=${token}`;
    return url.toString();
  }

  async deliver(email: string) {
    const token = randomBytes(32).toString('hex');
    const link = this.resetUrl(token);
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN || !process.env.MAIL_FROM) {
      throw new Error('Password reset email is not configured');
    }
    const user = await this.database.prisma.user.findFirst({
      where: { email, userType: 'USER', isDeleted: false, status: 'ENABLED' },
    });
    if (!user) return;
    const tokenHash = hash(token);
    await this.database.prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      create: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + WINDOW_MS) },
      update: { tokenHash, expiresAt: new Date(Date.now() + WINDOW_MS) },
    });
    try {
      const client = new Mailgun(FormData).client({ username: 'api', key: process.env.MAILGUN_API_KEY });
      await client.messages.create(process.env.MAILGUN_DOMAIN, {
        from: process.env.MAIL_FROM, to: [user.email], subject: 'Reset your JE-Inspi password',
        text: `Reset your password using this one-time link (expires in 15 minutes):\n\n${link}\n\nIf you did not request this, you can ignore this email.`,
        'o:tracking': 'no', 'o:tracking-clicks': 'no', 'o:tracking-opens': 'no',
      });
    } catch {
      await this.database.prisma.passwordResetToken.deleteMany({ where: { userId: user.id, tokenHash } });
      throw new Error('Password reset delivery failed');
    }
  }

  async reset(token: string, password: string) {
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
      throw new BadRequestException(INVALID_TOKEN);
    }
    // bcrypt only considers the first 72 bytes, including multi-byte characters.
    if (typeof password !== 'string' || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
      throw new BadRequestException('Use at least 12 characters and at most 72 UTF-8 bytes for your password.');
    }
    const tokenHash = hash(token);
    const entry = await this.database.prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!entry || entry.expiresAt.getTime() <= Date.now()) throw new BadRequestException(INVALID_TOKEN);
    const encrypted = await encrypt(password);
    await this.database.prisma.$transaction(async (tx) => {
      // Deleting the token is the atomic claim: concurrent submissions cannot both succeed.
      const claimed = await tx.passwordResetToken.deleteMany({
        where: { userId: entry.userId, tokenHash, expiresAt: { gt: new Date() } },
      });
      if (claimed.count !== 1) throw new BadRequestException(INVALID_TOKEN);
      const user = await tx.user.findFirst({
        where: { id: entry.userId, userType: 'USER', isDeleted: false, status: 'ENABLED' },
      });
      if (!user) throw new BadRequestException(INVALID_TOKEN);
      await tx.password.upsert({
        where: { userId: user.id },
        create: { userId: user.id, password: encrypted },
        update: { password: encrypted, isDeleted: false, status: 'ENABLED' },
      });
      await tx.userSession.updateMany({ where: { userId: user.id }, data: { isDeleted: true } });
    });
    return { message: 'Password updated. Please sign in with your new password.' };
  }
}

@Injectable()
export class PasswordResetGuard implements CanActivate {
  constructor(private readonly reset: PasswordResetService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    if (process.env.NODE_ENV === 'production' && !req.secure) {
      throw new ForbiddenException('HTTPS is required');
    }
    // Never parse client-supplied forwarded headers here. Express only trusts configured proxies.
    if (!await this.reset.allow(`ip:${req.ip || req.socket.remoteAddress}`, 20)) {
      throw new HttpException('Too many attempts. Try again in 15 minutes.', 429);
    }
    return true;
  }
}
