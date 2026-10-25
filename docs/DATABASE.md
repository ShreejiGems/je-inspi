# JE-Inspi database

## Current local setup

This workspace already has its own MySQL database, with the Prisma schema, supplier diamond inventory and one local admin account. The API loads its connection from `backend/.env`. The storefront and admin access it through the API.

| Connection setting | Value |
| --- | --- |
| Host | `127.0.0.1` |
| Port | `3307` |
| Database | `je_inspi` |
| Application database user | `je_inspi_user` |
| Password | `databasePassword` in the private `.local/mysql/credentials.json` file |

The admin website login is a separate account from the MySQL database user. Its details are saved in private `.local/admin-login.json`.

## Start after restarting your Mac

From the `je-inspi` folder:

```sh
npm --prefix backend run db:start
npm --prefix backend run db:status
npm --prefix backend run start:dev
```

Start the web apps in separate terminals:

```sh
npm --prefix frontend run dev
```

```sh
npm --prefix admin run dev
```

The API connection status is at http://localhost:1631/health. A connected database returns `database: "connected"`.

## Open the tables

From the `je-inspi` folder:

```sh
npm --prefix backend run db:studio
```

Open http://127.0.0.1:5555. Prisma Studio loads the database URL from `backend/.env` automatically. Keep this terminal running while viewing the tables. Press Control+C to close Studio.

For an installed SQL client, use the host, port, database and application user above, with the private `databasePassword` value. The database connection password is different from your admin website password.

## Stop MySQL

```sh
npm --prefix backend run db:stop
```

The data remains under `.local/mysql/data`. Normal startup uses `db:start`; initialization is already complete. Keep `.local/` and private environment files ignored by Git, as configured in this project.

## Schema and supplier inventory

The schema is defined in `backend/prisma/schema.prisma` and has already been applied locally. No schema reset or new import is required to use the current database.

To refresh diamond inventory:

```sh
npm --prefix backend run cron-diamond-price
npm --prefix backend run cron-lab-diamond-price
```

## Hosted database

The selected provider is DigitalOcean. Follow [DigitalOcean account, server and database setup](DIGITALOCEAN.md) to provision the new hosted resources.

Moving to a hosted database requires a separate MySQL database and its connection details. Configure only `backend/.env` with the supplied `DATABASE_URL`; the frontend and admin do not need database credentials. Review the selected provider, target schema, and whether the existing local inventory should be transferred before applying the schema or importing data there. Hosted setup is separate from the completed local setup.

While preparing a hosted connection, save its `DATABASE_URL` in private `backend/.env.hosted.local`. This file is ignored by Git. Use the provider's TLS connection settings. Keep `backend/.env` pointed at the working local database until the hosted connection and data are ready.

To check only the hosted connection and existing table count:

```sh
npm --prefix backend run db:hosted:check
```

This command loads only the selected hosted environment file, does not display passwords, and does not create tables or change data. Once the provider and target are known, the next steps are applying the project schema to a new database, choosing whether to transfer existing records, and switching the backend connection.
