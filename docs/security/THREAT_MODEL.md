# MIRSTOERA — Comprehensive Threat Model
**System**: MIRSTOERA Royal Experience Platform  
**Auditor**: RUDRA (Red Team Lead) & KAVIN (Blue Team Hardener)  
**Methodology**: STRIDE / OWASP Top 10 Enterprise Review  
**Status**: APPROVED / VERIFIED  

---

## 1. System Overview & Trust Boundaries
MIRSTOERA operates across three distinct security trust boundaries:
1. **Public Client Realm (Untrusted)**: Unauthenticated end-users submitting booking enquiries, browsing experiences, or following WhatsApp concierge links.
2. **Administrative Realm (Restricted)**: Concierge operators managing enquiries, updating quotes, recording client notes, and configuring platform settings.
3. **Core Data & Infrastructure Realm (Protected)**: SQLite WAL-mode transactional database, notification dispatcher outbox, and session storage.

```
+--------------------------------------------------------------+
|                     Public Internet / Client                 |
|   - Experience Browsing (/experiences)                       |
|   - Enquiry Reservation Form (/book)                         |
|   - Direct WhatsApp Concierge Link Dispatch                  |
+--------------------------------------------------------------+
                               |
                               | HTTPS / CORS / Helmet
                               v
+--------------------------------------------------------------+
|                    API Server (Express)                      |
|   - Public Routes (/api/enquiries, /api/services)            |
|   - Rate Limiters (15 req/15min on enquiries)                |
|   - Schema Validation (Zod Envelope Guards)                  |
|   - Admin Auth Middleware (scrypt / SHA-256 tokens)          |
+--------------------------------------------------------------+
                               |
                               | Prepared Statements / WAL
                               v
+--------------------------------------------------------------+
|                 Persistent SQLite Store                      |
|   - enquiries, enquiry_notes, services                       |
|   - business_settings, admin_users, admin_sessions           |
|   - notification_outbox, admin_audit_logs                    |
+--------------------------------------------------------------+
```

---

## 2. STRIDE Threat Assessment

| Threat Category | Potential Attack Vector | Mitigating Control & Architectural Defense | Verification Status |
|---|---|---|---|
| **Spoofing** | Attacker impersonating admin staff via forged session cookie or credential brute force | Strict `scrypt` hashing with 16-byte cryptographically secure salt; session tokens hashed via SHA-256 before DB lookup; `HttpOnly`, `SameSite=Lax`, `Secure` cookie flags; 10 failed login attempts/15 min IP rate limiting. | **PASSED (31/31 Security Tests)** |
| **Tampering** | Parameter manipulation, negative budget amounts, or modified service slugs | Strict Zod validation on incoming request bodies; service slugs validated against canonical enum; dates forced to future YYYY-MM-DD; all database queries parameterized with `?` placeholders. | **PASSED** |
| **Repudiation** | Admin claims they did not modify client quotation or delete an enquiry | Immutable `admin_audit_logs` records every action (`LOGIN`, `STATUS_UPDATE`, `NOTE_ADDED`, `SETTINGS_UPDATED`) with admin ID, UTC timestamp, IP, and details. | **PASSED** |
| **Information Disclosure** | Customer phone numbers or internal database errors leaked in public API | Phone numbers sanitized and restricted to admin endpoints; no client PII returned in public endpoints; centralized error middleware sanitizes stack traces and database paths in non-dev environments. | **PASSED (Playwright Test 20)** |
| **Denial of Service** | Flooding enquiry endpoint or uploading massive JSON payloads | Strict Express JSON body limit (`100kb`); `express-rate-limit` window restricting public enquiries to 15 per 15-minute window; SQLite WAL mode allowing concurrent readers without locking writers. | **PASSED** |
| **Elevation of Privilege** | Normal user calling `/api/admin/*` endpoints directly | `requireAdmin` middleware guards all admin subroutes; non-authenticated requests return `401 UNAUTHORIZED` with envelope response. | **PASSED (Playwright Tests 18, 19)** |

---

## 3. Data Flow Security & Privacy (DPDP Act 2023 Compliance)
- **Consent Capture**: Explicit consent checkbox (`privacy_consent`) mandatory before reservation submission.
- **Storage Minimization**: Only contact details strictly necessary to coordinate events are stored.
- **Access Control**: Client contact details are never exposed to public APIs or rendered in client HTML.
