# MIRSTOERA — API Security Review & Hardening
**Auditor**: VIKRAM (Backend Architect) & KAVIN (Blue Team)  
**Status**: VERIFIED  

---

## 1. Input Validation & Envelope Standard
All endpoints enforce strict input validation via Zod schemas:
- Standard success envelope:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Optional contextual status message"
  }
  ```
- Standard error envelope:
  ```json
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE_STRING",
      "message": "User-facing sanitized error message",
      "details": []
    }
  }
  ```

---

## 2. Idempotency & Concurrency Safety
- Every public booking request requires an `idempotency_key` (UUID v4 format).
- When a client sends a duplicate request with the identical key (e.g. rapid double-clicks or mobile network retries), the backend detects the existing key in `enquiries.idempotency_key`, returns the existing record's reference code, and avoids inserting duplicate database rows.
- Verified in automated tests: Two simultaneous requests with identical idempotency keys yield exactly one database entry.

---

## 3. Error Handling & Leak Prevention
- Express `errorHandler` captures uncaught errors, logs internal traces to system logs, and delivers generic envelopes to callers in production environments.
- Stack traces, internal file paths (`/home/...`, `node_modules`), and SQL syntax errors are never leaked to external clients.
