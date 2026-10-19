# MIRSTOERA — SQLite Database Security & Integrity Review
**Auditor**: NILA (Database Guardian)  
**Status**: VERIFIED  

---

## 1. Engine Configuration & Concurrency Controls
- **Engine**: SQLite 3 via `better-sqlite3` (Node.js) / Cloudflare D1 (Edge).
- **WAL Mode**: `PRAGMA journal_mode = WAL;` enabled on database connection.
  - Ensures readers do not block writers and writers do not block readers.
  - Significantly reduces write-lock contention under concurrent customer reservation attempts.
- **Foreign Keys**: `PRAGMA foreign_keys = ON;` enforces relational integrity across `enquiry_notes`, `admin_sessions`, and `notification_outbox`.
- **Synchronous Mode**: `PRAGMA synchronous = NORMAL;` provides durability against application crashes.

---

## 2. SQL Injection Defense Verification
- **Zero Raw Query Interpolation**: 100% of queries across `ServiceRepository`, `EnquiryRepository`, `SettingsRepository`, and `AdminRepository` use prepared statements with positional parameters (`?`).
- **Dynamic Updates**: In dynamic update queries (such as `ServiceRepository.update` or `SettingsRepository.update`), the column names are strictly whitelist-matched against constant field strings. User-supplied keys are never directly interpolated into SQL strings.
- **Red Team Attack Test**: Form inputs containing classical SQL injection vectors (`' OR 1=1 --`, `'; DROP TABLE enquiries; --`) are treated purely as literal string text and safely stored without query syntax corruption.

---

## 3. Transactional Boundaries & Outbox Atomicity
- When a client creates an enquiry, the operation occurs within an atomic transaction:
  1. Generate unique human-readable reference code (`MIR-XXXXXX`).
  2. Insert enquiry into `enquiries` table.
  3. Insert notification message into `notification_outbox`.
- If an exception occurs before commit, the transaction rolls back cleanly, preventing orphaned enquiries without notifications or orphaned notifications without records.
