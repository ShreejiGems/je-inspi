const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

// Load configuration before Nest imports modules that construct service clients.
const commandArgs = process.argv.slice(2);
let envName = '.env';
if (commandArgs[0] === '--env-file') {
  commandArgs.shift();
  envName = commandArgs.shift();
  if (!envName) {
    console.error('Provide an environment file after --env-file.');
    process.exit(1);
  }
}
const envFile = path.resolve(__dirname, '..', envName);
if (envName !== '.env' && !fs.existsSync(envFile)) {
  console.error('The requested backend environment file does not exist.');
  process.exit(1);
}
if (fs.existsSync(envFile)) {
  if (typeof process.loadEnvFile !== 'function') {
    console.error('JE-Inspi requires Node.js 20.12 or newer to load backend/.env.');
    process.exit(1);
  }
  process.loadEnvFile(envFile);
}

const child = spawn(process.execPath, commandArgs, {
  cwd: path.resolve(__dirname, '..'),
  env: process.env,
  stdio: 'inherit',
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}
child.on('error', () => {
  console.error('Unable to start the JE-Inspi backend command.');
  process.exit(1);
});
child.on('exit', (code) => process.exit(code ?? 0));
