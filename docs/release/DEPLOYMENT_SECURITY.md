# MIRSTOERA — Deployment & Infrastructure Security Review
**Auditor**: ADITYA (DevOps Lead) & TARA (Compliance Reviewer)  
**Status**: VERIFIED  

---

## 1. Hosting Architecture & Commercial Tier Compliance
- **Frontend SPA / SSG**:
  - Prerendered HTML generated via `scripts/prerender.js` for all 12 public routes, enabling instant SEO discovery without client JavaScript execution.
  - Recommended commercial deployment: **Cloudflare Pages** (unlimited commercial traffic on standard plans) or self-hosted Nginx/Docker.
  - *Compliance Notice*: Vercel Hobby terms explicitly forbid commercial business operations; deployment profiles emphasize Cloudflare or Docker containers.
- **Backend API Server**:
  - Express Node.js container or Cloudflare Workers edge adapter.
  - Reverse proxy enforces TLS 1.3, HSTS headers, and automated DDoS mitigation.

---

## 2. Environment Variables & Secret Hygiene
- All sensitive variables isolated to server-side environments:
  - `ADMIN_BOOTSTRAP_PASSWORD`: Strong password required for seeding.
  - `SESSION_SECRET`: Cryptographically strong random entropy used for signing cookies.
  - `DATABASE_PATH`: Kept outside public web document root (`./data/momera.sqlite`).
- Frontend Vite configuration strictly enforces `VITE_` prefix whitelist, ensuring non-prefixed server secrets are excluded from client bundles.
