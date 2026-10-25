const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const runtime = path.join(root, '.local/mysql');
const server = path.join(runtime, 'server');
const data = path.join(runtime, 'data');
const socket = path.join(runtime, 'mysql.sock');
const pidFile = path.join(runtime, 'mysql.pid');
const clientFile = path.join(runtime, 'client.cnf');
const credentialsFile = path.join(runtime, 'credentials.json');
const port = 3307;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function runClient(sql, bootstrap = false) {
  const args = bootstrap
    ? ['--no-defaults', '--user=root', '--protocol=socket', `--socket=${socket}`]
    : [`--defaults-file=${clientFile}`];
  const result = spawnSync(path.join(server, 'bin/mysql'), [...args, '--batch', '--skip-column-names'], {
    input: sql, encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error('Local MySQL command failed; inspect .local/mysql/mysql.log.');
  return result.stdout.trim();
}

async function start(bootstrap = false) {
  if (fs.existsSync(pidFile)) {
    try {
      process.kill(Number(fs.readFileSync(pidFile, 'utf8')), 0);
      console.log('JE-Inspi MySQL is already running.');
      return;
    } catch { /* stale process marker */ }
  }
  const args = [
    '--no-defaults', `--basedir=${server}`, `--datadir=${data}`,
    '--bind-address=127.0.0.1', `--port=${port}`, '--mysqlx=0',
    `--socket=${socket}`, `--pid-file=${pidFile}`,
    `--log-error=${path.join(runtime, 'mysql.log')}`,
  ];
  if (bootstrap) args.push('--skip-networking');
  const child = spawn(path.join(server, 'bin/mysqld'), args, { detached: true, stdio: 'ignore' });
  child.unref();
  for (let i = 0; i < 150; i++) {
    await wait(200);
    try {
      if (runClient('SELECT 1;', bootstrap) === '1') {
        console.log(bootstrap ? 'Local MySQL ready for isolated setup.' : `JE-Inspi MySQL ready on 127.0.0.1:${port}.`);
        return;
      }
    } catch { /* wait for server initialization */ }
  }
  throw new Error('Local MySQL did not start; inspect .local/mysql/mysql.log.');
}

async function stop() {
  if (!fs.existsSync(pidFile)) return;
  const pid = Number(fs.readFileSync(pidFile, 'utf8'));
  try { process.kill(pid, 'SIGTERM'); } catch { return; }
  for (let i = 0; i < 150; i++) {
    await wait(200);
    try { process.kill(pid, 0); } catch { return; }
  }
  throw new Error('MySQL is still shutting down; its data was not removed.');
}

async function setup() {
  if (!fs.existsSync(path.join(server, 'bin/mysqld'))) {
    throw new Error('Portable MySQL is missing from .local/mysql/server. See README setup instructions.');
  }
  const envFile = path.join(root, 'backend/.env');
  const env = fs.readFileSync(envFile, 'utf8');
  const existing = env.match(/^DATABASE_URL=(.*)$/m)?.[1].replace(/^['"]|['"]$/g, '');
  if (!existing || (!existing.includes('CHANGE_ME') && !existing.includes('@127.0.0.1:3307/je_inspi'))) {
    throw new Error('Refusing to replace a separately configured database target.');
  }
  fs.mkdirSync(runtime, { recursive: true, mode: 0o700 });
  if (!fs.existsSync(credentialsFile)) {
    if (fs.existsSync(data) && fs.readdirSync(data).length) {
      throw new Error('Existing MySQL data found without its credentials; refusing to reinitialize it.');
    }
    const credentials = {
      rootPassword: crypto.randomBytes(24).toString('hex'),
      databasePassword: crypto.randomBytes(24).toString('hex'),
    };
    const initialized = spawnSync(path.join(server, 'bin/mysqld'), [
      '--no-defaults', '--initialize-insecure', `--basedir=${server}`, `--datadir=${data}`,
      `--log-error=${path.join(runtime, 'mysql.log')}`,
    ]);
    if (initialized.status !== 0) throw new Error('Local MySQL initialization failed; inspect its log.');
    await start(true);
    runClient(`CREATE DATABASE je_inspi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      CREATE USER 'je_inspi_user'@'127.0.0.1' IDENTIFIED BY '${credentials.databasePassword}';
      GRANT ALL PRIVILEGES ON je_inspi.* TO 'je_inspi_user'@'127.0.0.1';
      ALTER USER 'root'@'localhost' IDENTIFIED BY '${credentials.rootPassword}';`, true);
    fs.writeFileSync(credentialsFile, JSON.stringify(credentials), { mode: 0o600 });
    fs.writeFileSync(clientFile, `[client]\nuser=root\npassword=${credentials.rootPassword}\nprotocol=socket\nsocket=${socket}\n`, { mode: 0o600 });
    await stop();
  }
  const credentials = JSON.parse(fs.readFileSync(credentialsFile, 'utf8'));
  const databaseUrl = `mysql://je_inspi_user:${credentials.databasePassword}@127.0.0.1:${port}/je_inspi`;
  fs.writeFileSync(envFile, env.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL=${databaseUrl}`));
  fs.chmodSync(envFile, 0o600);
  await start();
  console.log('Private backend database configuration updated. No other database was accessed.');
}

async function main() {
  const action = process.argv[2] || 'start';
  if (action === 'setup') await setup();
  else if (action === 'start') await start();
  else if (action === 'stop') { await stop(); console.log('JE-Inspi MySQL stopped.'); }
  else if (action === 'status') console.log(runClient('SELECT 1;') === '1' ? 'JE-Inspi MySQL is healthy.' : 'MySQL unavailable.');
  else throw new Error('Use setup, start, stop or status.');
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
