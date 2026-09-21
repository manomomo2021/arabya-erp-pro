# Implementation status — Arabya ERP Pro 2.0

## Completed in this revision
- Migrated the application shell from Vite/Express to Next.js App Router.
- Removed the previous in-memory ERP data path.
- Added real server-side SQL Server connection pooling.
- Added strict DDL safety guard and write-table allowlist.
- Added signed, HttpOnly session cookie.
- Removed hardcoded `/auth/me` administrator identity.
- Fixed the broken `@/src/...` path alias so the Next.js source tree resolves correctly.
- Reworked authentication around a read-only ERP HUB adapter (`APP_AUTH_MODE=erp-hub`); the exact legacy table/password algorithm remains explicitly configuration-driven and is not guessed.
- Financial year and branch are session values and are passed into SQL queries where applicable.
- Removed the in-memory audit array; audit writes use the existing `AuditLog` table if it exists and otherwise fail closed to server logs rather than pretending persistence.
- Added separate Next.js routes for the documented ERP screens.
- Added real data screens for Customers, Sales Invoices, Cold Storage, DB status, Audit and Users/session.
- Preserved the supplied database mapping terminology and table names.

## Intentionally not fabricated
The supplied database documentation does not prove the exact write workflow for every one of the 1,220+ tables. Therefore this revision does **not** invent invoice-detail, stock-movement, journal-posting, production-completion or storage-billing SQL. Those screens show the documented source tables/columns until the legacy application's exact transaction sequence is reverse-engineered from its real procedures/code/trace.

## Production prerequisites
- Use a least-privilege SQL login instead of `sa`.
- The legacy ERP HUB trace must still be used to fill the exact `ERP_AUTH_*` mapping before production login is enabled. `aya` is an ERP application user, not a SQL Server login.
- Verify exact column nullability, keys and posting rules against the live schema before enabling additional writes.
