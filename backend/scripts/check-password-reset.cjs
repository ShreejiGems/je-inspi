const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { randomBytes, createHash } = require('node:crypto');
const { PrismaClient } = require('@prisma/client');
const { PasswordResetService } = require('../src/modules/client/auth/password-reset.service');
const { compare } = require('../src/shared/module/bcrypt/bcrypt');
const url = new URL(process.env.DATABASE_URL);
if (!['127.0.0.1', 'localhost'].includes(url.hostname) || url.pathname !== '/je_inspi') {
  throw new Error('This test is restricted to the isolated local je_inspi database');
}
const prisma = new PrismaClient();
const reset = new PasswordResetService({ prisma });
const prefix = randomBytes(12).toString('hex');
const hash = (v) => createHash('sha256').update(v).digest('hex');
let user;
const rateIds = [];
async function seedToken() {
  const token = randomBytes(32).toString('hex');
  const data = { tokenHash: hash(token), expiresAt: new Date(Date.now() + 60000) };
  await prisma.passwordResetToken.upsert({ where: { userId: user.id }, create: { userId: user.id, ...data }, update: data });
  return token;
}
async function run() {
  if (process.argv.includes('--apply-schema')) {
    const sql = fs.readFileSync(path.join(__dirname, '../prisma/password-reset.sql'), 'utf8');
    for (const statement of sql.split(';').map(s => s.trim()).filter(Boolean)) await prisma.$executeRawUnsafe(statement);
    console.log('Applied additive password-reset tables to the isolated local database.');
  }
  user = await prisma.user.create({ data: { email: `reset-test-${prefix}@example.invalid`, userType: 'USER' } });
  await prisma.userSession.create({ data: { userId: user.id, authToken: `test-${prefix}`, refreshToken: `refresh-${prefix}` } });
  const token = await seedToken();
  const results = await Promise.allSettled([
    reset.reset(token, 'first secure test password'), reset.reset(token, 'second secure test password'),
  ]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(results.filter(r => r.status === 'rejected').length, 1);
  const stored = await prisma.password.findUniqueOrThrow({ where: { userId: user.id } });
  assert(await compare(results[0].status === 'fulfilled' ? 'first secure test password' : 'second secure test password', stored.password));
  assert.equal(await prisma.userSession.count({ where: { userId: user.id, isDeleted: false } }), 0);
  await assert.rejects(() => reset.reset(token, 'reused secret password'));
  console.log('PASS concurrent token consumption, password hashing, token reuse and session revocation');
  const expired = await seedToken();
  await prisma.passwordResetToken.update({ where: { userId: user.id }, data: { expiresAt: new Date(0) } });
  await assert.rejects(() => reset.reset(expired, 'expired secret password'));
  const rollbackToken = await seedToken();
  const faulty = new PasswordResetService({ prisma: new Proxy(prisma, { get(target, prop) {
    if (prop === '$transaction') return (fn) => target.$transaction(tx => fn(new Proxy(tx, { get(t, p) {
      if (p === 'userSession') return { updateMany: async () => { throw new Error('simulated DB failure'); } };
      return t[p];
    } })));
    return target[prop];
  } }) });
  await assert.rejects(() => faulty.reset(rollbackToken, 'rollback secure password'));
  assert(await prisma.passwordResetToken.findUnique({ where: { tokenHash: hash(rollbackToken) } }));
  assert.equal((await prisma.password.findUniqueOrThrow({ where: { userId: user.id } })).password, stored.password);
  console.log('PASS expiry and transactional rollback');
  const key = `integration-test:${prefix}`;
  for (const w of [Math.floor(Date.now()/900000), Math.floor(Date.now()/900000)+1]) rateIds.push(hash(`${key}:${w}`));
  const allowed = await Promise.all(Array.from({ length: 6 }, () => reset.allow(key, 3)));
  assert.equal(allowed.filter(Boolean).length, 3);
  console.log('PASS concurrent shared database rate limiting');
}
run().catch((error) => { console.error('Password reset integration check failed:', error.code || error.name); process.exitCode = 1; })
.finally(async () => {
  if (user) {
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.userSession.deleteMany({ where: { userId: user.id } });
    await prisma.password.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
  if (rateIds.length) await prisma.passwordResetRateLimit.deleteMany({ where: { id: { in: rateIds } } });
  await prisma.$disconnect();
});
