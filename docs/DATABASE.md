# MOMÉRA — Database Schema & Storage Engineering

**Database Engine:** SQLite (local development with `better-sqlite3`, production with Cloudflare D1 managed storage).  
**ORM & Query Builder:** Drizzle ORM.  
**Storage Rules:**
- Monetary amounts stored in **integer paise** (e.g. ₹799 = 79,900 paise).
- All timestamps stored in **ISO 8601 UTC**.
- Foreign keys enabled and enforced.
- Parameterized queries mandatory across all drivers.

---

## 1. Relational Table Definitions

### 1.1 `services`
Stores the curated royal experience packages.
```sql
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  starting_price_paise INTEGER NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services (slug);
CREATE INDEX IF NOT EXISTS idx_services_active_order ON services (is_active, display_order);
```

### 1.2 `enquiries`
Stores customer booking requests with strict idempotency and reference codes.
```sql
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference_code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_id INTEGER NOT NULL REFERENCES services(id),
  event_date TEXT NOT NULL,
  event_time TEXT NOT NULL,
  event_area TEXT NOT NULL,
  recipient_relationship TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_paise INTEGER,
  additional_preferences TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK(status IN ('NEW', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
  quoted_price_paise INTEGER,
  idempotency_key TEXT NOT NULL UNIQUE,
  privacy_consent_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_event_date ON enquiries (event_date);
CREATE INDEX IF NOT EXISTS idx_enquiries_idempotency ON enquiries (idempotency_key);
```

### 1.3 `enquiry_notes`
Internal admin notes associated with an enquiry.
```sql
CREATE TABLE IF NOT EXISTS enquiry_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  enquiry_id INTEGER NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  admin_id INTEGER NOT NULL REFERENCES admin_users(id),
  note TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_enquiry_notes_enquiry ON enquiry_notes (enquiry_id);
```

### 1.4 `admin_users`
Authorized administrative staff credentials.
```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT 'Royal Concierge Admin',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
```

### 1.5 `admin_sessions`
Active authenticated admin sessions.
```sql
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY, -- cryptographic session ID token
  admin_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  session_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_hash ON admin_sessions (session_hash);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions (expires_at);
```

### 1.6 `business_settings`
Configurable operational parameters.
```sql
CREATE TABLE IF NOT EXISTS business_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
```

### 1.7 `notification_outbox`
Transactional outbox ensuring safe notification dispatch.
```sql
CREATE TABLE IF NOT EXISTS notification_outbox (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  enquiry_id INTEGER REFERENCES enquiries(id) ON DELETE CASCADE,
  channel TEXT NOT NULL DEFAULT 'whatsapp',
  recipient TEXT NOT NULL,
  template_key TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'DISABLED')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_outbox_status ON notification_outbox (status, next_attempt_at);
```

### 1.8 `admin_audit_logs`
Tamper-evident trail of administrative mutations.
```sql
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER REFERENCES admin_users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON admin_audit_logs (action, created_at DESC);
```

---

## 2. Seed Data Specification

The 4 canonical royal experiences:
1. `secret-gift`: Secret Gift Delivery, ₹799 (79,900 paise)
2. `mini-proposal`: Mini Movie Proposal, ₹1,499 (149,900 paise)
3. `birthday-surprise`: Cinematic Birthday Surprise, ₹1,799 (179,900 paise)
4. `hero-entry`: Cinematic Hero Entry, ₹1,299 (129,900 paise)

Default Business Settings:
- `brand_name`: "MOMÉRA"
- `tagline`: "Every Moment Deserves a Crown."
- `phone`: "+919876543210"
- `whatsapp`: "+919876543210"
- `notification_recipient`: "+919876543210"
- `email`: "concierge@momera.in"
- `service_coverage`: "Coimbatore, Tamil Nadu, India"
- `business_hours`: "Monday to Sunday: 09:00 AM - 09:00 PM IST"
