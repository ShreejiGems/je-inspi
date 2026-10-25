import * as os from 'os';
const pLimit = require('p-limit');

// Auto-scale concurrency limit: e.g., 10 Prisma queries per CPU core
const cpuCores = os.cpus().length;
const prismaConcurrencyLimit = pLimit(cpuCores * 10);

console.log(
  `[safePrismaCall] Limiting Prisma concurrency to ${
    cpuCores * 10
  } (based on ${cpuCores} CPU cores)`,
);

export async function safePrismaCall<T = any>(
  fn: () => Promise<T>,
): Promise<T> {
  return prismaConcurrencyLimit(fn);
}
