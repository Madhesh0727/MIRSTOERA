# MOMÉRA — Deployment Architecture & Operations Guide

This document defines the deployment profiles, hosting compliance, environment configurations, and rollback procedures for MOMÉRA.

---

## 1. Supported Deployment Profiles

### Profile A: Local Development (Default)
- **Frontend**: React + Vite on `http://localhost:5173`
- **Backend**: Node.js + Express on `http://localhost:3001`
- **Database**: Local SQLite via `better-sqlite3` located at `./data/momera.sqlite` (WAL mode enabled, 5000ms busy timeout).
- **Setup Commands**:
  ```bash
  npm install
  npm run db:migrate
  npm run db:seed
  npm run dev
  ```

### Profile B: Commercial Free-Tier Target (Cloudflare Ecosystem)
- **Frontend**: Statically built and prerendered React pages deployed on **Cloudflare Pages**.
- **Backend API**: Cloudflare Worker using the unified Fetch API routing adapter with identical business services and Zod validations.
- **Database**: **Cloudflare D1** (Persistent, managed SQLite distributed at edge).
- **Hosting Terms Compliance**:
  - Cloudflare Pages and Workers free tiers permit commercial use within legitimate request/bandwidth allocations.
  - Cloudflare D1 provides persistent SQLite storage without requiring local writable file hacks in ephemeral lambdas.
- **Wrangler Configuration**:
  ```toml
  name = "momera-api"
  main = "apps/api/src/worker.ts"
  compatibility_date = "2024-09-23"
  compatibility_flags = ["nodejs_compat"]

  [[d1_databases]]
  binding = "DB"
  database_name = "momera-production-d1"
  database_id = "<d1-database-id>"
  ```

### Profile C: Vercel Compatibility & Legal/Technical Boundaries
- **Frontend**: Can be hosted on Vercel as a static or edge deployment.
- **Critical Policy Mandate**:
  1. **Commercial Policy**: MOMÉRA is a commercial business in Coimbatore. Deploying a commercial service on the Vercel Hobby free tier violates Vercel Terms of Service. A legitimate commercial plan is required.
  2. **Persistence Boundary**: Serverless functions on Vercel execute on ephemeral lambdas. **Never place a local writable SQLite file (`.sqlite`) in a serverless function filesystem**, as it will be wiped or desynchronized across lambdas. A persistent SQLite-compatible external service (such as Turso or Cloudflare D1) or dedicated server is mandatory.

---

## 2. Environment Configuration Matrix

| Variable | Required | Description | Example (Local) | Example (Production) |
|----------|----------|-------------|-----------------|----------------------|
| `NODE_ENV` | Yes | Environment flag | `development` | `production` |
| `PORT` | Yes (API) | Server port | `3001` | `3001` |
| `APP_URL` | Yes | Public Web URL | `http://localhost:5173` | `https://momera.in` |
| `API_URL` | Yes | Public API URL | `http://localhost:3001` | `https://api.momera.in` |
| `DATABASE_MODE` | Yes | DB Engine | `local` | `d1` or `local` |
| `DATABASE_PATH` | Local only | Filepath for SQLite | `./data/momera.sqlite` | `./data/momera.sqlite` |
| `SESSION_SECRET` | Yes | Cookie signing key | (32+ chars random) | (High entropy secret) |
| `ADMIN_BOOTSTRAP_EMAIL` | Yes | Initial admin email | `admin@momera.in` | `concierge@momera.in` |
| `ADMIN_BOOTSTRAP_PASSWORD` | Yes | Initial admin password | `RoyalMomeraAdmin2026!` | (Cryptographic passphrase) |
| `WHATSAPP_CONTACT_NUMBER` | Yes | Concierge WhatsApp | `+919876543210` | `+919876543210` |
| `WHATSAPP_NOTIFICATION_PROVIDER` | Yes | Provider strategy | `manual` | `manual` or `cloud_api` |

---

## 3. Database Migration, Seeding & Backup

### 3.1 Migration Execution
```bash
npm run db:migrate
```
Applies all SQL migrations sequentially in atomic transactions.

### 3.2 Seeding Default Services & Admin User
```bash
npm run db:seed
```
Seeds the 4 royal experiences (Secret Gift, Mini Proposal, Birthday Surprise, Hero Entry) and initializes default business settings and the bootstrap admin account.

### 3.3 Backup Procedures
- **Local SQLite**: Run online VACUUM INTO backup:
  ```bash
  npm run db:backup
  ```
- **Cloudflare D1**: Run wrangler export:
  ```bash
  npx wrangler d1 export momera-production-d1 --output=backup-$(date +%Y%m%d).sql
  ```

---

## 4. Rollback & Disaster Recovery Procedures

1. **Frontend Rollback**:
   - Cloudflare Pages / Vercel provide instant one-click rollback to any previously deployed git commit SHA or build deployment artifact.
2. **Backend Rollback**:
   - Re-deploy previous release bundle or rollback Worker version via `wrangler rollback`.
3. **Database Recovery**:
   - Restore SQLite snapshot from the latest automated backup:
     ```bash
     npm run db:restore -- ./backups/momera-backup-latest.sqlite
     ```
