# MOMÉRA — System Architecture & Technical Blueprint

## 1. System Overview & Monorepo Topology

MOMÉRA is architected as an ultra-lightweight, high-performance monorepo with strict package boundaries:

```
momera/
├── apps/
│   ├── web/               # React + TypeScript + Vite + Tailwind CSS (Public & Admin UI)
│   └── api/               # Node.js + Express (Local) & Fetch-compatible handler (Edge/Cloudflare)
├── packages/
│   ├── shared/            # Zod validation schemas, TypeScript interfaces, domain constants
│   └── database/          # Drizzle ORM schemas, SQLite migrations, repository layer, DB adapters
├── docs/                  # Architecture, specifications, security, deployment, and testing reports
├── scripts/               # Seed, bootstrap, prerender, and backup utilities
└── tests/                 # End-to-end and cross-package integration tests
```

### Dependency Flow
```
apps/web ----> packages/shared
apps/api ----> packages/shared
apps/api ----> packages/database
packages/database ----> packages/shared
```

---

## 2. Deployment Profiles

### Profile A: Local Development (Default)
- **Frontend**: Vite Dev Server on `http://localhost:5173`
- **Backend API**: Node.js + Express on `http://localhost:3001`
- **Database**: Local SQLite file (`./data/momera.sqlite`) operated via `better-sqlite3` with WAL mode enabled and 5000ms busy timeout.
- **Outbox Processing**: In-process synchronous/event-driven outbox logger.

### Profile B: Commercial Free-Tier Production Target (Cloudflare Ecosystem)
- **Frontend**: Static prerendered HTML + assets deployed on **Cloudflare Pages**.
- **Backend API**: Cloudflare Workers with Fetch API route dispatching using the same core business repositories and shared validators.
- **Database**: **Cloudflare D1** (managed persistent SQLite at edge).
- **Compliance & Terms**: Cloudflare Pages and Workers free tiers explicitly permit commercial usage under fair-use thresholds.
- **Zero Local SQLite inside Serverless**: Never uses local SQLite files inside stateless lambda runtimes.

### Profile C: Vercel Compatibility (Frontend Only)
- **Frontend**: Deployed as static export or edge static output on Vercel.
- **Important Rule**: MOMÉRA is a commercial business. Vercel Hobby tier is restricted to non-commercial personal projects. Live commercial deployment on Vercel requires an appropriate commercial plan. Furthermore, serverless local SQLite files are ephemeral; backend must use persistent storage (e.g. external D1 or persistent Node server).

---

## 3. Database & Storage Architecture

### Drizzle ORM Schema & Portability
The database uses Drizzle ORM configured for SQLite dialect. Business repositories accept an abstract `DatabaseExecutor` interface:
```typescript
export interface DatabaseExecutor {
  query<T = any>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<{ rowsAffected: number; lastInsertRowId?: number | bigint }>;
  transaction<T>(callback: (tx: DatabaseExecutor) => Promise<T>): Promise<T>;
}
```
Two concrete adapters implement this:
1. `BetterSqlite3Adapter`: Synchronous native driver wrapped in transactional promises for local Node.js.
2. `D1Adapter`: Asynchronous driver wrapping Cloudflare's D1 binding API.

### Core Relational Schema
- **`services`**: Experience offerings (`secret-gift`, `mini-proposal`, `birthday-surprise`, `hero-entry`), pricing in integer paise, active status, display order.
- **`enquiries`**: Customer booking requests, human-readable reference code (`MOM-000001`), customer name, normalized phone, event date/time/area, relationship, description, budget, status (`NEW`, `CONTACTED`, `QUOTED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`), idempotency key.
- **`enquiry_notes`**: Internal admin notes appended to an enquiry.
- **`admin_users`**: Superadmin accounts, emails, cryptographic password hashes, active flags.
- **`admin_sessions`**: Session tokens hashed with SHA-256, expiration dates, admin ID references.
- **`business_settings`**: Key-value store for configurable parameters (contact phone, WhatsApp number, business hours, notification receiver).
- **`notification_outbox`**: Transactional outbox records (`channel`, `recipient`, `payload_json`, `status`, `attempt_count`, `next_attempt_at`).
- **`admin_audit_logs`**: Tamper-evident log of all admin state mutations.

### Financial Representation
All currency calculations and storage use integer **paise** (`₹799` = `79900` paise). Floating-point arithmetic for currency is strictly prohibited.

### Idempotency & Reference Code Generation
- Customer form submissions send a unique client-generated UUID `idempotency_key`. The `enquiries` table enforces a unique index on this key. Resubmissions return the existing record without creating duplicates.
- Reference codes follow the format `MOM-######` (e.g., `MOM-000001`), generated safely using atomic sequence increments.

---

## 4. WhatsApp & Notification Architecture

### Outbox Pattern & Two-Phase Safety
External network calls (such as WhatsApp API calls) must **never** occur inside an active database transaction.
1. When an enquiry is created, a row is inserted into `notification_outbox` with status `PENDING` within the **same** database transaction as the enquiry.
2. Post-commit, the `NotificationService` retrieves the outbox item and dispatches it through the configured `NotificationProvider`.
3. If notification delivery fails or no provider is active, the status updates to `FAILED` or `DISABLED` with the error logged. The enquiry itself remains safely committed.

### Provider Interface
```typescript
export interface NotificationProvider {
  name: string;
  isConfigured(): boolean;
  send(payload: NotificationPayload): Promise<NotificationResult>;
}
```
- **`ManualNotificationProvider` (Default V1)**: Generates verified WhatsApp Click-to-Chat links (`https://wa.me/<phone>?text=<encoded_text>`) for admin one-click messaging. Marks outbox as `DISABLED` or `SENT` (Manual).
- **`WhatsAppCloudAPIProvider` (Optional V2)**: Connects to Meta's official Graph API using environment credentials.

---

## 5. Security & Authentication Architecture

1. **Admin Authentication**:
   - Zero public admin registration. Bootstrapped securely via environment variables or CLI script.
   - Password hashing: Cryptographic scrypt/argon2 with unique per-user salt.
   - Session tokens: 32-byte cryptographically secure random values stored hashed (SHA-256) in the database.
   - Cookies: `HttpOnly`, `SameSite=Lax` (or `Strict`), and `Secure` in production.
2. **Access Control**:
   - Every `/api/admin/*` endpoint passes through `requireAdminSession` middleware.
3. **Data Protection & Privacy**:
   - Customer phone numbers and enquiry details are never exposed to unauthenticated public endpoints.
   - Public enquiry lookup requires strict non-guessable verification or admin authorization.
4. **Defense in Depth**:
   - Helmet security headers (CSP, HSTS, X-Content-Type-Options, Frameguard).
   - Rate limiting on public submissions and admin login.
   - Input sanitization and Zod schema parsing on every request body.
   - Parameterized queries across all database drivers.

---

## 6. Frontend & SEO Architecture

1. **Aesthetic Identity**: "Royal Paper Experience" inspired by vintage bespoke luxury invitations. Vintage Ivory background (`#F7F1E5`), Royal Navy typography (`#16283D`), Champagne Gold accents (`#C8A45D`), Burgundy accents (`#692D40`), and Ink Black body text (`#292623`).
2. **Public Routes**:
   - `/` (Home)
   - `/experiences` (All 4 offerings)
   - `/experiences/:slug` (Deep dive for secret-gift, mini-proposal, birthday-surprise, hero-entry)
   - `/book` (Booking request form with auto-selection and client validation)
   - `/our-story` (Brand mission and Coimbatore context)
   - `/gallery` (Curated concept cards)
   - `/contact` (Live business details and WhatsApp link)
   - `/privacy` & `/terms` (Privacy and commercial booking terms)
3. **Admin Routes**:
   - `/admin/login`, `/admin/dashboard`, `/admin/enquiries`, `/admin/enquiries/:id`, `/admin/services`, `/admin/settings`, `/admin/notifications`, `/admin/audit-logs`.
4. **SEO & Prerendering**:
   - Public pages are statically prerendered to deliver indexable semantic HTML with JSON-LD schema, open graph tags, canonical links, and meta descriptions.
   - Admin routes are excluded via `robots.txt` and protected from indexing with `noindex, nofollow`.
