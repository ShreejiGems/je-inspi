const path = require('node:path');
const projectRoot = path.resolve(__dirname, '../..');

module.exports = {
  apps: [
    {
      name: 'je-inspi-api',
      cwd: path.join(projectRoot, 'backend'),
      script: 'scripts/with-env.cjs',
      args: 'dist/main.js',
      instances: 1,
      env: { NODE_ENV: 'production', ENV: 'PRODUCTION', PORT: '1631' },
    },
    {
      name: 'je-inspi-storefront',
      cwd: path.join(projectRoot, 'frontend'),
      script: 'node_modules/next/dist/bin/next',
      args: 'start -H 127.0.0.1 -p 4002',
      instances: 1,
      env: { NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' },
    },
    {
      name: 'je-inspi-admin',
      cwd: path.join(projectRoot, 'admin'),
      script: 'node_modules/next/dist/bin/next',
      args: 'start -H 127.0.0.1 -p 4001',
      instances: 1,
      env: { NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' },
    },
  ],
};
