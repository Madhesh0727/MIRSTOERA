# MIRSTOERA — Attack Surface Analysis
**Evaluator**: RUDRA (Red Team Security Lead)  
**Date**: October 2026  
**Status**: AUDITED & MINIMIZED  

---

## 1. Network & Transport Attack Surface
- **Exposed Public Ports**:
  - `5173` (Frontend Web SPA / Dev) / `443` (Production Cloudflare / Reverse Proxy)
  - `3001` (Backend API Server)
- **Transport Security**:
  - Helmet configured with `Cross-Origin-Resource-Policy: cross-origin` and secure headers.
  - CORS strictly configured to whitelist only approved origin URLs (`config.appUrl`, `http://localhost:5173`, `http://127.0.0.1:5173`).
  - Strict cookie flags: `httpOnly: true`, `secure: production`, `sameSite: 'lax'`, `path: '/'`.

---

## 2. API Endpoint Attack Surface

### Public Endpoints (Accessible to Any Internet User)
1. `GET /api/health`: Health status only. Returns no sensitive environment variables, internal paths, or secrets.
2. `GET /api/services`: Active service catalog. Filters by `is_active = 1`. Does not reveal internal pricing formulas or unapproved drafts.
3. `GET /api/services/:slug`: Canonical service detail lookup. Validates slug.
4. `POST /api/enquiries`: Client booking submission.
   - **Guards**: IP rate limiter (15 req/15min), `100kb` body limit, strict Zod schema validation (`enquirySubmissionSchema`), idempotency deduplication key.
5. `GET /api/public-settings`: Dynamic contact information, working hours, and social media links. Does not expose admin email, password hashes, or internal notification credentials.

### Protected Administrative Endpoints (Guarded by `requireAdmin`)
1. `POST /api/admin/login`: Admin authentication. Rate-limited to 10 attempts per 15 minutes.
2. `POST /api/admin/logout`: Invalidates session token in DB and clears cookie.
3. `GET /api/admin/session`: Returns current admin user profile.
4. `GET /api/admin/dashboard`: Metrics aggregation (total, new, contacted, quoted, confirmed, completed).
5. `GET /api/admin/enquiries`: Paginated, filtered enquiry ledger.
6. `GET /api/admin/enquiries/:id`: Complete enquiry record with notes and WhatsApp chat link generator.
7. `PATCH /api/admin/enquiries/:id/status`: Validated state machine transitions.
8. `POST /api/admin/enquiries/:id/notes`: Concierge note recording.
9. `GET /api/admin/services`: Full service catalog including inactive items.
10. `POST /api/admin/services`: Service creation.
11. `PATCH /api/admin/services/:id`: Service modification.
12. `GET /api/admin/settings`: Complete business and concierge configuration.
13. `PATCH /api/admin/settings`: Settings updates.
14. `GET /api/admin/notifications`: Outbox delivery log.
15. `POST /api/admin/notifications/:id/retry`: Manual retry of failed notifications.
16. `GET /api/admin/audit-logs`: Chronological immutable audit trail.

---

## 3. Attack Surface Hardening Verification
- **Unauthenticated Probing**: Direct GET/POST to `/api/admin/*` consistently returns HTTP 401 with `{ success: false, error: { code: 'UNAUTHORIZED' } }`.
- **Large Payload Floods**: Sending payloads > 100KB triggers HTTP 413 Payload Too Large.
- **SQL / Command Injection**: No dynamic SQL concatenation; 100% prepared statement parameterization.
