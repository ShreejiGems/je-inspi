const { PrismaClient } = require('@prisma/client');

async function main() {
  let target;
  try {
    target = new URL(process.env.DATABASE_URL);
    if (target.protocol !== 'mysql:' || !target.hostname || target.pathname.length < 2) throw new Error();
  } catch {
    throw new Error('Set a valid MySQL DATABASE_URL in the selected environment file.');
  }
  console.log('Database target:', {
    host: target.hostname,
    port: target.port || '3306',
    database: target.pathname.slice(1),
  });
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const tables = await prisma.$queryRaw`
      SELECT COUNT(*) AS count FROM information_schema.tables
      WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'
    `;
    console.log('Database connected. Existing table count:', Number(tables[0].count));
    console.log('No schema or data was changed.');
  } catch {
    throw new Error('Database connection failed. Check credentials, TLS settings and network access with your provider.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
