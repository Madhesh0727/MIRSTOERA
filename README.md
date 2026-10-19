# MOMÉRA — Royal Moments Experience Platform

> **"Every Moment Deserves a Crown."**

MOMÉRA is an ultra-lightweight, high-performance web platform designed to provide a luxury, "Royal Paper Experience" for booking premium surprise experiences in Coimbatore, Tamil Nadu, India.

---

## 👑 The Four Experiences
1. **Secret Gift Delivery** (Starting at ₹799) — Personalized gift box, chocolates, handwritten royal letter, and scheduled surprise doorstep delivery.
2. **Mini Movie Proposal** (Starting at ₹1,499) — Intimate romantic setup with three roses, wax-sealed love letter, soundtrack cueing, and an edited cinematic reel.
3. **Cinematic Birthday Surprise** (Starting at ₹1,799) — Balloon cluster styling, royal banner, fairy lights, surprise countdown reveal, and cinematic birthday reel.
4. **Cinematic Hero Entry** (Starting at ₹1,299) — Movie star entrance choreography, slow-mo smartphone filming, sunglasses/props, and edited hero reel.

---

## 🏛️ Monorepo Architecture

```
momera/
├── apps/
│   ├── web/               # React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
│   └── api/               # Node.js, Express, Zod, Session Security, Outbox Pattern
├── packages/
│   ├── shared/            # Zod validation schemas, domain types, brand constants
│   └── database/          # Drizzle ORM, SQLite adapters (better-sqlite3 & Cloudflare D1)
├── docs/                  # Architecture, PRD, User Flows, Design System, Security, etc.
├── scripts/               # Backup, seed, and prerender utilities
└── tests/                 # Unit, API, Database, and E2E test suites
```

---

## 🚀 Quickstart (Local Development)

### Prerequisites
- Node.js v20+ (Tested on v22.22.1)
- npm v9+

### Installation & Run
```bash
# 1. Install all monorepo dependencies
npm install

# 2. Setup environment variables
cp .env.example .env

# 3. Run database migrations & seed initial services
npm run db:migrate
npm run db:seed

# 4. Start concurrent development servers (API on 3001, Web on 5173)
npm run dev
```

---

## 🧪 Testing

```bash
# Run all unit, database, and API tests
npm test

# Run End-to-End tests
npm run test:e2e
```

---

## 🛡️ Governance & Quality Gates

Development is coordinated by the **Central Orchestrator** and governed across 8 specialized AI agents according to [`AGENTS.md`](./AGENTS.md) and [`PROJECT_STATE.md`](./PROJECT_STATE.md). Strict anti-hallucination standards are codified in [`docs/AI_QA_RULES.md`](./docs/AI_QA_RULES.md).
