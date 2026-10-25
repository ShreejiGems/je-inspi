# JE-Inspi API

See the [project README](../README.md) for setup, environment configuration, database isolation, and commands. Run `npm ci`, then `npm run start:dev`. Node.js 20.12 or newer loads the private `.env` before Nest starts.

See [database setup](../docs/DATABASE.md) for connection details, daily startup commands and opening the tables in Prisma Studio. From this folder, use `npm run db:start`, `npm run db:status`, and `npm run db:studio`.

For hosted infrastructure, see [DigitalOcean setup](../docs/DIGITALOCEAN.md). Server process and proxy drafts are in `../deploy/digitalocean/`. Set `HOST=127.0.0.1` on the Droplet to keep the API bound to the local interface behind the web apps.

Glowstar, Dharmatech, ExchangeRate and Razorpay credentials were copied into the private `.env` at the owner’s request. The API now connects to an isolated local `je_inspi` MySQL database on `127.0.0.1:3307`. Start it from the project root using `node scripts/local-mysql.cjs start` before starting Nest. `GET /health` checks the connection. Set the separate `RAZORPAY_SECRET` for webhook verification; this value was absent from the source environment.

Both supplier inventories are imported. Run `npm run cron-diamond-price` and `npm run cron-lab-diamond-price` to refresh them. Public diamond list, filters and detail routes are backed by the local database; mutations require admin authentication. The imports retain records absent from subsequent feeds, so review inventory freshness before fulfilling orders. Local database credentials and data remain in ignored private files, and no original database was accessed.

The regenerated npm lockfile pins Prisma CLI and Client to 6.13.0. `.npmrc` preserves the legacy peer resolution needed by the inherited Nest dependency versions.
