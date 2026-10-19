# MOMÉRA — Security Architecture & Threat Model

**Author**: Sub-Agent 6 (Security & Privacy Engineer)  
**Status**: Initial Review & Threat Model  
**Release Target**: Production Ready (Zero Critical / High Vulnerabilities)

---

## 1. Threat Modeling (STRIDE)

| Threat Type | Potential Risk in MOMÉRA | Applied Mitigation |
|-------------|--------------------------|--------------------|
| **Spoofing** | Attacker guessing or forging admin session cookies. | Cryptographically strong 256-bit random session tokens, stored hashed (SHA-256) in DB, transmitted via `HttpOnly`, `SameSite=Lax`, and `Secure` cookies. |
| **Tampering** | Modifying enquiry pricing, status, or notes via unauthenticated API calls. | Strict middleware authentication (`requireAdminSession`) on every admin endpoint; parameter validation with Zod; foreign key cascades. |
| **Repudiation** | Admin claims they did not modify a status or delete a record. | Immutable `admin_audit_logs` tracking admin ID, IP, action, entity type, and metadata JSON for every state mutation. |
| **Information Disclosure** | Scraping customer names, phone numbers, or event details through public APIs. | Public endpoints NEVER return customer data. Enquiries can only be queried through authenticated admin routes. Phone numbers are stored normalized and never exposed publicly. |
| **Denial of Service** | Flooding enquiry submissions or brute-forcing admin login. | Rate limiting middleware applied to `/api/enquiries` (max 10 requests per 15 min per IP) and `/api/admin/login` (max 5 requests per 15 min per IP); max payload limits (100kb). |
| **Elevation of Privilege** | Normal user accessing admin dashboard or registering as admin. | Zero public admin registration routes. Admin bootstrap occurs exclusively through verified server-side environment variables or CLI utility. |

---

## 2. Customer Phone Number & Privacy Protection

1. **Indian Phone Number Handling**:
   - Phone numbers must be valid 10-digit Indian numbers (`^[6-9]\d{9}$`).
   - Normalization removes spaces, hyphens, parentheses, and leading `+91` or `0`.
   - The stored format is standard E.164 without prefix: `9876543210` or `+919876543210`.
2. **Access Control**:
   - Enquiries are strictly inaccessible without an active, validated admin session.
3. **Log Sanitization**:
   - Customer phone numbers and personal notes are excluded from general server stdout logs.

---

## 3. Defense-in-Depth Implementation

- **Password Hashing**: PBKDF2 with 100,000 iterations and 32-byte salt (or Argon2id) ensuring brute-force resistance.
- **SQL Injection**: Parameterized SQL queries enforced by Drizzle ORM and native database bindings. Zero string concatenation in queries.
- **Cross-Site Scripting (XSS)**: React automatic escaping, strict CSP headers configured via `helmet`.
- **Cross-Site Request Forgery (CSRF)**: SameSite cookie protection, custom header requirements (`X-Requested-With` or JSON content types).
- **Environment Secrets**: Zero API keys or secrets in client-side bundles. Server validates all required secrets at boot.
