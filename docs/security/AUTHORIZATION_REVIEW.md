# MIRSTOERA — Authorization & Access Control Review
**Auditor**: RUDRA & VIKRAM  
**Status**: APPROVED  

---

## 1. Role-Based Access Control Architecture
MIRSTOERA enforces strict separation of privileges:
- **Public Visitors (Anonymous)**: Read-only access to `/api/services`, `/api/services/:slug`, `/api/public-settings`, and write access to `/api/enquiries` (subject to rate limiting).
- **Staff / Concierge (`ADMIN` / `SUPER_ADMIN`)**: Authenticated access to customer ledger, note creation, status transitions, pricing quotes, and service configurations.

---

## 2. Guard Middleware (`createAuthMiddleware`)
- **Inspection Logic**:
  1. Inspects `req.cookies.momera_admin_session` or `Authorization: Bearer <token>`.
  2. If missing, immediately halts execution with HTTP 401 Unauthorized.
  3. Hashes token via SHA-256 and queries SQLite for valid, non-expired session.
  4. Joins `admin_users` to ensure account is marked `is_active = 1`.
  5. Attaches `req.adminUser = user` and `req.sessionId = session.id`.
- **State Machine Enforcement**:
  - Only valid transitions are authorized (e.g. `NEW -> CONTACTED`, `CONTACTED -> QUOTED`).
  - Terminal states (`COMPLETED`, `CANCELLED`) cannot be transitioned back to draft.
  - Invalid transitions trigger HTTP 400 Bad Request with descriptive message.
