# Password reset

Customers request a link from the login screen. The backend responds with the same message for registered and unknown emails. Account lookup and email delivery run asynchronously after the request; delivery failures are logged with a generic message. Dispatch currently runs in the API process, so a process restart can interrupt delivery; a customer can request another link. No live email delivery was performed during implementation.

The link uses a cryptographically random 32-byte token, valid for 15 minutes. Only its SHA-256 hash is stored. Each customer has one outstanding link; requesting another replaces it. Mailgun click/open tracking is disabled for reset mail. The link stores the token in a URL fragment so it does not enter HTTP access logs. The reset page removes the fragment from browser history, keeps the token in memory, disables indexing, and sets a no-referrer policy. Reloading the page requires reopening the email link.

`POST /auth/request-password-reset` accepts `{ "email": "customer@example.com" }`.
`POST /auth/change-password` accepts `{ "token": "64-hex-character-token", "password": "new password" }` in its JSON body. The old email/password query request no longer works. The legacy `send-otp` endpoint rejects password-reset requests; registration OTP behavior remains separate.

New passwords require at least 12 characters and at most 72 UTF-8 bytes because the existing bcrypt implementation has a 72-byte limit. Passwords are hashed using bcrypt with cost 10. Token consumption, password storage and revocation of all user sessions occur in one database transaction. Invalid, expired and reused tokens receive the same error. Password reset does not automatically log the customer in.

## Deployment

1. Back up and verify the intended database. Apply `backend/prisma/password-reset.sql` before deploying the new API. This is an additive update with two new tables. This project has no Prisma migration history; do not introduce `prisma migrate deploy` without first baselining the existing schema. Generate Prisma Client with `npx prisma generate` in `backend`.
2. Set `PASSWORD_RESET_URL=https://YOUR_STOREFRONT_DOMAIN/reset-password`, `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` and `MAIL_FROM` privately. The reset URL must be a fixed trusted HTTPS URL, without query parameters or fragments. HTTP localhost is allowed only outside production.
3. Use `NODE_ENV=production`, HTTPS and the provided Nginx reset-route locations. These locations forward reset requests directly to the API and overwrite the forwarded IP and protocol headers. Set `TRUST_PROXY_LOOPBACK=true` only with this trusted local proxy and bind the API to `127.0.0.1`. Keep app ports and database ports closed to public access. Never trust arbitrary forwarded headers or set Express trust proxy to `true`.
4. Reset routes enforce HTTPS in production. Database rate counters are shared across workers and restarts: 20 requests/submissions per client IP and 3 email deliveries per normalized email per fixed 15-minute window. Excess account requests get the generic response; excess IP requests get HTTP 429. With the Next.js development proxy, requests may share a loopback IP bucket; production should use the direct Nginx locations.
5. Schedule daily cleanup of expired rows (these statements delete only expired security records):

```sql
DELETE FROM PasswordResetToken WHERE expiresAt < NOW(3);
DELETE FROM PasswordResetRateLimit WHERE expiresAt < NOW(3);
```

6. Verify real Mailgun delivery in staging, followed by a complete reset using a dedicated test account. Check HTTPS, client-IP isolation, expiry, replay rejection and revocation of existing sessions. Apply the current JWT, dependency, payment and other deployment checks independently; this change is scoped to customer password reset.

## Verification

Backend Jest tests cover token hashing and email construction, generic responses, provider failures, password hashing, invalid/expired/reused tokens, byte limits, rate limits, production HTTPS checks and HTTP rejection of the former query-parameter bypass.

From `backend/`, run the additional integration check against the isolated local `je_inspi` database:

```sh
node scripts/with-env.cjs -r ts-node/register -r tsconfig-paths/register scripts/check-password-reset.cjs --apply-schema
```

Omit `--apply-schema` after the tables exist. The script refuses non-local databases, creates temporary test users, checks concurrent token consumption and rate limiting, rollback, password hashing and session revocation, then removes its own records. It never sends email or changes existing customers.
