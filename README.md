# JE-Inspi

Independent copy of the Shreeji storefront, admin portal, and API, with JE-Inspi naming and a sage, ivory, and forest brand system. The source applications remain in their original sibling folders.

## Architecture

| App | Folder | Framework | Local URL |
| --- | --- | --- | --- |
| Storefront | `frontend/` | Next.js 14, React 18, TypeScript | http://localhost:4002 |
| Admin | `admin/` | Next.js 14, React 18, TypeScript | http://localhost:4001 |
| API | `backend/` | NestJS 10, Prisma, MySQL | http://localhost:1631 |

Browser requests in the frontend and admin use their own `/api/` path, which Next.js forwards to the API root configured by server-side `NEXT_API_ENDPOINT`. This includes admin token refresh and avoids browser cross-origin requests to the backend port. Restart Next.js after changing the upstream endpoint. Set `MEDIA_HOST` in each app’s `.env.local` to the hostname serving JE-Inspi media. `DIAMOND_MEDIA_HOSTS` allows the supplier image hosts in Next.js. The API uses the Prisma schema at `backend/prisma/schema.prisma`. The frontend also contains a Prisma schema at `frontend/src/libs/schema.prisma`, retained from the source app; runtime database access is performed by the API.

## Prerequisites

- Node.js 20.12 or newer
- npm (lockfiles are included)
- MySQL: this workspace has an isolated portable server at `.local/mysql/server`, listening on `127.0.0.1:3307`

## Install and configure

Run these commands from the `je-inspi/` folder:

```sh
cp -n frontend/.env.example frontend/.env.local
cp -n admin/.env.example admin/.env.local
cp -n backend/.env.example backend/.env
npm --prefix frontend ci
npm --prefix admin ci
npm --prefix backend ci
```

The private `backend/.env` now points to the separate local `je_inspi` database on port 3307, with generated credentials. The `.env.example` database URL remains a placeholder for new installations. At the owner’s request, the existing Glowstar, Dharmatech, ExchangeRate and Razorpay key settings were copied from the Shreeji backend into the private JE-Inspi `.env`. Original database, AWS and email credentials were not copied. Retain existing private environment files; copying `.env.example` over them resets configured services.

The API lockfile has been regenerated with Prisma CLI and Client both pinned to 6.13.0. `backend/.npmrc` enables legacy peer resolution for the inherited Nest dependency versions. Backend startup and manual diamond/pricing commands load `backend/.env` before creating service clients. Razorpay’s secret remains on the backend; checkout obtains only the public key ID from the purchase-order response. `RAZORPAY_SECRET` is the separate webhook signing secret and was absent from the original environment, so webhook verification remains unavailable until it is configured. AWS S3 and Mailgun require separate JE-Inspi configuration.

## Start the applications

First start the local database from `je-inspi/` (also required after a restart):

```sh
node scripts/local-mysql.cjs start
node scripts/local-mysql.cjs status
```

Then open three terminals in `je-inspi/`:

```sh
npm --prefix backend run start:dev
```

```sh
npm --prefix frontend run dev
```

```sh
npm --prefix admin run dev
```

The backend listens on port 1631 by default. CORS allows the two local app URLs; set `CORS_ORIGINS` to a comma-separated list of the deployed JE-Inspi origins for deployment.

## Database

The local `je_inspi` schema has been applied using Prisma. Its data, portable binaries, logs and private credentials live under git-ignored `.local/mysql/`. The helper uses `--no-defaults`, its own data directory, and a database user restricted to `je_inspi.*`. It does not access the source project's database. Stop it with `node scripts/local-mysql.cjs stop`; this retains all data.

For a new macOS 14 Apple Silicon workspace, download the portable server from the official MySQL archive, then initialize this project's isolated database:

```sh
mkdir -p .local/mysql
curl -fL https://cdn.mysql.com/archives/mysql-8.4/mysql-8.4.3-macos14-arm64.tar.gz -o .local/mysql/server.tar.gz
tar -xzf .local/mysql/server.tar.gz -C .local/mysql
mv .local/mysql/mysql-8.4.3-macos14-arm64 .local/mysql/server
node scripts/local-mysql.cjs setup
cd backend
npx prisma generate
npx prisma db push --skip-generate
```

Run initialization only for a new workspace. For other operating systems or deployment, provision a separate MySQL database and set `DATABASE_URL` explicitly. Review the target before applying schema changes; the existing `prisma-all` script includes `prisma db push`. No source customer/order records were copied.

### Diamond inventory

Refresh the configured supplier feeds from `je-inspi/`:

```sh
npm --prefix backend run cron-diamond-price
npm --prefix backend run cron-lab-diamond-price
```

The import commands load the private environment, validate records, and create or update API diamonds by origin and SKU in batches. Fancy colors and optional fields are handled. They report counts without exposing credentials. Records absent from later feeds are retained; freshness and supplier availability must be reviewed before accepting orders. Supplier status `HOLD` is disabled for the storefront.

The initial import saved 12,613 natural and 7,399 lab diamonds; 9 lab records lacked required attributes and were skipped. Of the 20,012 imported records, 19,844 are enabled for browsing. The catalog is available at http://localhost:4002/diamond. API health is available at http://localhost:1631/health and includes a database connection check.

## Build, lint, and tests

```sh
npm --prefix frontend run build
npm --prefix admin run build
npm --prefix backend run build
npm --prefix backend test
npm --prefix backend run test:e2e
npm --prefix frontend run test:slider
node scripts/check-website.cjs
```

The frontend/admin package scripts include `lint` (`next lint`); verify compatibility with the installed Next version before relying on it. The storefront slider checks render the actual component on the server and check its percentage bounds; they do not simulate browser interaction. The local website checks require all three development servers, the isolated database, and the private local admin credentials created during setup. They log in and revoke their own test session, and do not charge payments, send mail, upload files, or alter catalog records. Results are saved without credentials in ignored `.local/website-test-results.json`. See [the website test report](docs/TEST-REPORT.md) for scope and remaining configuration issues.

### Verification recorded

- Storefront, admin, and API production builds completed successfully.
- Prisma Client 6.13.0 generated successfully; the schema was subsequently applied to the isolated local `je_inspi` database.
- Initial local HTTP smoke checks returned `200` for the storefront (`:4002`), admin (`:4001`), and API Swagger page (`:1631/api/`). The initial check used a placeholder database URL and blank external-service credentials.
- On October 11, 2026, all three development servers started with the configured diamond/payment environment; the API compiled with zero errors. The copied settings were compared to the source without displaying their values. The backend environment has file permissions `600`.
- The isolated database is connected. Live supplier diamond imports succeeded. Diamond list, natural/lab filters, numeric ranges, detail, search parameters and database health returned HTTP 200. Requests from the storefront received the configured CORS origin, stale sessions can browse public diamonds, and unauthenticated diamond writes returned HTTP 401.
- Storefront diamond list and detail pages returned HTTP 200, and a supplier image loaded through the Next.js image optimizer. Backend, storefront and admin TypeScript checks passed after these fixes. Re-running the lab import updated 7,399 records without creating duplicates.
- Startup content now loads independently and retries a temporary failure once. The diamond banner uses the bundled video when no banner is configured; a failed optional content request no longer replaces it with a full-screen application error. Diamond catalog failures show a Retry button instead of an empty table. Startup endpoints and the lab catalog returned HTTP 200 through the storefront `/api/` proxy; the admin proxy and bundled video also returned HTTP 200.
- Admin login and protected read endpoints are covered by local HTTP checks. Customer order creation and payment capture remain unverified.
- The old starter integration test was replaced with two health endpoint HTTP tests using a mocked database. Supplier mapping/import tests and session revocation tests were added, and the backend Jest alias configuration now resolves `src/...` imports. These suites do not exercise every API module.
- The earlier storefront cart prerender warning was addressed by guarding browser storage access during server rendering.
- Responsive visual review was not completed in an in-app browser during this setup.

## Preserved functionality and configuration limits

The storefront includes jewelry and diamond catalog/detail flows, cart, order/payment flows, registration/login, profile, wishlist, contact, about, and policy pages. The admin includes authentication and management screens for jewelry, diamonds, pricing, users, orders, filters, media, contact locations/events/catalogues, and calculators. The API includes corresponding client/admin endpoints, authentication, uploads, pricing jobs, and Prisma-backed models.

Legal pages and source business documents retain source-company names and contact details pending review by the JE-Inspi business/legal owner; those values were not blindly rewritten. At the owner’s request, a similar ivory-on-sage JE INSPI logo was created from the supplied visual reference using the built-in image generation tool. It includes a diamond, a sweeping serif N and the subtitle “DIAMANT JUWELIER”. The background was subsequently removed at the owner’s request. Both apps use `public/assets/brand/je-inspi-logo-transparent.png`, a PNG with genuine alpha transparency. Dark hero imagery uses ivory lettering through CSS; light screens use sage lettering. The earlier logo versions are retained as separate files. See `frontend/public/assets/brand/logo-generation.md` for the generation prompt. The shared brand palette follows the logo: sage `#6B8965`, ivory `#F8F7F1`, forest `#263329`, and darker sage `#526F4D` for buttons and links. Tailwind brand utilities and Ant Design theme providers cover the storefront and admin, including static messages and confirmation dialogs.

A separate local database was created and loaded with live supplier diamond inventory. No original database or customer/order data was accessed. No live payment, email or upload was performed. AWS, Mailgun and the Razorpay webhook secret still require JE-Inspi configuration. The source legal pages, contact addresses, policy PDFs, and some About Us text still contain Shreeji Gems business details and require owner/legal review before the JE-Inspi site is published.

## Secure password reset

Customer password reset uses emailed, single-use links instead of the old OTP/query-parameter flow. Deployment requires the additive reset tables, email configuration and trusted HTTPS proxy settings. See [password reset setup and tests](docs/PASSWORD-RESET.md).
