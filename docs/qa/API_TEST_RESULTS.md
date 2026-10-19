# MIRSTOERA — API Automated Test Execution Results
**Runner**: Supertest / Vitest Suite (`apps/api/tests/api.test.ts` & `security.test.ts`)  
**Timestamp**: October 2026  
**Total Tests**: 54 API Tests  
**Result**: 54 PASSED (100%)  

---

## 1. Public API Endpoint Verification (23 Tests)
- `GET /api/health`: 200 OK, returns healthy status and brand "MIRSTOERA" (PASSED)
- `GET /api/services`: 200 OK, returns 4 experiences with correct slugs and prices in paise (PASSED)
- `GET /api/services/:slug`: 200 OK for valid slugs; 404 for invalid slugs (PASSED)
- `POST /api/enquiries`: 201 Created on valid submission with reference code `MIR-XXXXXX` (PASSED)
- `POST /api/enquiries (Deduplication)`: Repeated submission with same idempotency key returns identical record without duplicate DB insertion (PASSED)
- `POST /api/enquiries (Validation)`: Rejects past dates, invalid phone formats, missing consent, and unknown services with 400 Bad Request (PASSED)
- `GET /api/public-settings`: 200 OK, returns public contact details and social media links (PASSED)

---

## 2. Security & Guard Verification (31 Tests)
- Unauthenticated access to `/api/admin/*` returns 401 Unauthorized (PASSED)
- Invalid login returns generic error without leaking account existence (PASSED)
- Valid login issues HttpOnly cookie and hashes token into database (PASSED)
- Rate limiting kicks in after exceeding configured failed attempts (PASSED)
- SQL injection strings stored as safe literal text (PASSED)
- Excessive payload (>100KB) rejected with 413 Payload Too Large (PASSED)
- Password hash verification uses timing-safe scrypt algorithm (PASSED)
