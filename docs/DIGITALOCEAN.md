# DigitalOcean setup for JE-Inspi

Prepared October 11, 2026. No DigitalOcean account, Droplet, database cluster or paid resource has been created from this workspace. Account access and connection details are still needed.

## 1. Create your account

Open [DigitalOcean signup](https://cloud.digitalocean.com/registrations/new), register with your own email or sign-in provider, and complete the verification and payment steps displayed there. These steps must be completed by the account owner. Create a project named `JE-Inspi` in the dashboard.

When the account is ready, provide the preferred deployment region and your storefront/admin domain names, if you already have them. Use one region and VPC for the server and managed database.

## 2. Proposed initial resources

| Resource | Proposed configuration | Published monthly price |
| --- | --- | --- |
| App server | Basic Regular Droplet, 2 vCPUs, 4 GiB RAM, Ubuntu 24.04 LTS | $24 |
| Database | Managed MySQL Standard, Basic Regular, 1 GiB RAM, one node | From $15.15 |

See current [Droplet pricing](https://www.digitalocean.com/pricing/droplets) and [database pricing](https://www.digitalocean.com/pricing/managed-databases). Database storage, backups, taxes and any other selected extras can affect the checkout total. The database pricing page lists storage at $0.215/GiB/month; use the dashboard's final estimate for the selected plan. A single database node is suitable for initial development/review and does not provide the availability of a primary plus standby configuration. See [MySQL plans](https://docs.digitalocean.com/products/databases/mysql/details/pricing/).

These are initial sizing suggestions for running the three apps together; actual memory use and traffic should guide later resizing. Build the applications sequentially on this size of server.

## 3. Create the server

Following [Create a Droplet](https://docs.digitalocean.com/products/droplets/how-to/create/):

1. Select Ubuntu 24.04 LTS and the proposed Basic Regular 4 GiB plan, or your chosen plan.
2. Select the agreed region and VPC.
3. Add your SSH public key for login.
4. Name the Droplet `je-inspi-app` and assign it to the JE-Inspi project.
5. Review the price shown before creating it.
6. Note the Droplet IP. Server access will require the matching local SSH key.

Use a Cloud Firewall to permit SSH from your administrator IP and HTTP/HTTPS on ports 80/443. The website and admin are accessed through Nginx; application ports 4001/4002/1631 do not need public firewall rules.

## 4. Create the managed MySQL database

Following [Create a MySQL cluster](https://docs.digitalocean.com/products/databases/mysql/how-to/create/):

1. Choose Managed Databases → MySQL. Select the Standard edition and the intended plan.
2. Use the same region and VPC as the Droplet.
3. Name the cluster `je-inspi-mysql` and assign it to the project.
4. Review the dashboard's final price and create it.
5. In Users & Databases, create a database named `je_inspi` and a dedicated application user `je_inspi_user`.
6. Add the Droplet to Trusted Sources. Add your Mac's public IP only if a local setup/transfer connection is needed. See [database network access](https://docs.digitalocean.com/products/databases/mysql/how-to/secure/).
7. Obtain the connection details and download the CA certificate from the cluster page. Use the private endpoint from the Droplet where available. Use the public endpoint for a connection from your Mac. See [connection details](https://docs.digitalocean.com/products/databases/mysql/how-to/connect/).

Save the URL privately in `backend/.env.hosted.local`. Save the CA certificate outside tracked source files, for example `.local/digitalocean/mysql-ca.crt`, and use its absolute path in your local URL.

Prisma 6 MySQL uses `sslcert` and `sslaccept=strict` for verified TLS. Do not assume a provider's generic URL options are Prisma options. Example, with placeholders only:

```dotenv
DATABASE_URL="mysql://je_inspi_user:URL_ENCODED_PASSWORD@YOUR_CLUSTER.db.ondigitalocean.com:25060/je_inspi?sslcert=/ABSOLUTE/PATH/mysql-ca.crt&sslaccept=strict&connection_limit=5&pool_timeout=20"
```

See [Prisma 6 MySQL TLS configuration](https://www.prisma.io/docs/orm/v6/overview/databases/mysql). On the server, the provided backend environment template expects the certificate at `/etc/je-inspi/mysql-ca.crt`.

## 5. Connect and prepare the data

From `je-inspi/` on your Mac:

```sh
npm --prefix backend run db:hosted:check
```

This reads the connection and counts existing tables; it does not change the database. The next operation depends on whether the selected hosted database is empty. Review that result before applying a schema or transferring data.

Choose whether to transfer the existing local JE-Inspi database, including its admin account, or create a fresh hosted schema and re-import supplier inventory. No source Shreeji database is needed for either choice. The data transfer must target the new JE-Inspi database and preserve the working local data.

## 6. Server configuration prepared

The deployment drafts are in `deploy/digitalocean/`:

- `ecosystem.config.cjs`: PM2 processes for the API, storefront and admin, with project-relative paths.
- `nginx.conf.example`: storefront/admin reverse proxies; replace the example domains and add HTTPS.
- `backend.env.example`: server-side managed MySQL connection with verified TLS and external-service placeholders.

On the server, install Node.js 22 LTS, npm, PM2 and Nginx. Place the JE-Inspi project in its own directory, such as `/opt/je-inspi`. Install dependencies with `npm ci` in each app and generate the backend Prisma client. Configure `backend/.env` and each web app's `.env.production.local` privately.

Both web apps should use `NEXT_API_ENDPOINT=http://127.0.0.1:1631` on the Droplet. Retain their supplier image allowlists. Their browser API calls stay on the website origin and Next.js forwards them to Nest.

Build each app sequentially after configuration:

```sh
npm --prefix backend run build
npm --prefix frontend run build
npm --prefix admin run build
```

After the hosted data is ready, start the processes with:

```sh
pm2 start deploy/digitalocean/ecosystem.config.cjs
pm2 save
```

Configure PM2 startup for the server's service user. Verify the API database health and local storefront/admin responses before configuring public access.

## Before public launch

The inherited API contains a hardcoded JWT secret and an unauthenticated `auth/change-password` route. Those authentication issues must be corrected before exposing the hosted application. Provision the intended admin account with a production password and complete HTTPS setup. External storage, email and payment webhook settings also need real JE-Inspi configuration before those workflows are used.

The copied backend's old GitHub workflow targeted a Shreeji server path. It is now a manual build workflow; it does not deploy or change remote schemas. A JE-Inspi deployment workflow can be configured after the actual server and repository access are available.
