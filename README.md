# Arabya ERP Pro 2.0

Next.js App Router + TypeScript + SQL Server (`mssql`) ERP shell for the existing `SERVER1 / ArabyaDB` production database.

## Non-negotiable database contract
- The application never runs migrations against `ArabyaDB`.
- No CREATE / ALTER / DROP / TRUNCATE / GRANT / REVOKE / DENY statements are permitted by the server query guard.
- Writes are allowlisted to existing operational tables only.
- Database credentials remain server-side.
- Every write path validates authorization, uses parameterized SQL and a transaction, asks the user for confirmation in the UI, and records an audit event when an existing `AuditLog` table is available.
- The app does not invent password hashes or accept a username alone as authentication.

## Authentication
`APP_AUTH_MODE=sql-login` verifies the submitted username/password by opening a SQL Server connection with those credentials. This is deliberately fail-closed: if the legacy desktop application uses a different password mechanism, document that mechanism before integrating it. Do not invent a password column/table inside `ArabyaDB`.

## Run
1. Copy `.env.example` to `.env.local`.
2. Set `MSSQL_*` and a long random `SESSION_SECRET`.
3. `npm install`
4. `npm run dev`

For production, use a dedicated least-privilege SQL login rather than `sa`.


## ERP HUB authentication
The current build uses `APP_AUTH_MODE=erp-hub` and a read-only legacy-auth adapter. The `ERP_AUTH_*` values in `.env.example` are examples only and MUST be verified against the legacy ERP HUB trace before production use. Do not assume `Employee.EmpFilePassword` is the live password source merely because those columns exist. The adapter performs SELECT-only authentication and never creates or alters objects in `ArabyaDB`.
