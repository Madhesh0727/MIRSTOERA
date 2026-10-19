# MIRSTOERA — Master Bug & Defect Register

**Project:** MIRSTOERA — Royal Moments Experience Platform  
**Version:** 1.0.0  
**Last Updated:** October 19, 2026  
**Auditing Model:** Five Specialized Autonomous AI Sub-Agents & Central Orchestrator  

---

## Bug Summary Dashboard

| Bug ID | Title | Discovered By | Severity | Component | Status |
|:---|:---|:---|:---:|:---:|:---:|
| **MIR-001** | Optional "Estimated Budget" NaN validation blocking form submission | Agent 1 (Arjun) / Agent 2 (Vikram) | **HIGH** | Frontend / Shared Schema | **VERIFIED** |
| **MIR-002** | Reference code generator using legacy `MOM-` prefix instead of `MIR-` | Agent 2 (Vikram) / Agent 4 (Meera) | **MEDIUM** | Database / Backend | **VERIFIED** |
| **MIR-003** | Hardcoded notification template key `'momera_enquiry_alert'` | Agent 2 (Vikram) / Agent 3 (Rudra) | **LOW** | Backend / Outbox | **VERIFIED** |
| **MIR-004** | Outdated domain and branding in `sitemap.xml` and `robots.txt` | Agent 5 (Aditya) | **MEDIUM** | SEO / DevOps | **VERIFIED** |
| **MIR-005** | Session cookie name strictly `momera_session` instead of `mirstoera_session` | Agent 3 (Rudra) | **LOW** | Security / Auth | **VERIFIED** |
| **MIR-006** | Absence of real-time package snapshot card on booking form | Agent 1 (Arjun) | **LOW** | Frontend / UX | **VERIFIED** |

---

## Detailed Bug Records

### BUG ID: MIR-001
- **Discovered By**: Agent 1 (Arjun) & Agent 2 (Vikram)
- **Title**: Optional "Estimated Budget" NaN validation blocking form submission
- **Severity**: **HIGH**
- **Component**: Frontend / Shared Validation (`packages/shared/src/schemas/index.ts` & `apps/web/src/pages/BookingPage.tsx`)
- **Reproduction**:
  1. Open booking form at `/book`.
  2. Fill in all required fields (Name, Phone, Area, Relationship, Event Date, Event Time, Description, Privacy Consent).
  3. Leave "Estimated Budget (₹ INR, Optional)" empty.
  4. Click "Send My Royal Request".
- **Expected**: Form submits cleanly with `budget_inr: null`.
- **Actual**: Form rejects submission with error: `"Expected number, received nan"`.
- **Root Cause**: React Hook Form with `{ valueAsNumber: true }` parses an empty HTML number input as `NaN`. The Zod schema `z.number().int().positive().optional().nullable()` rejects `NaN` because in JavaScript `typeof NaN === 'number'`, but `NaN` fails integer checks.
- **Owner**: Full-Stack Architect (Agent 2) & Customer Experience Inspector (Agent 1)
- **Fix**:
  1. Updated `packages/shared/src/schemas/index.ts` to preprocess `budget_inr`, mapping `NaN`, `""`, `null`, and `undefined` to `null`.
  2. Updated `BookingPage.tsx` with safe `setValueAs: (v) => (v === '' || Number.isNaN(Number(v)) ? null : Number(v))`.
- **Test**: Automated regression test `POST /api/enquiries accepts submission when optional budget is omitted or null` in `apps/api/tests/api.test.ts`. Verified in Vitest with code 0.
- **Status**: **VERIFIED**

---

### BUG ID: MIR-002
- **Discovered By**: Agent 2 (Vikram) & Agent 4 (Meera)
- **Title**: Reference code generated with legacy `MOM-` prefix instead of `MIR-`
- **Severity**: **MEDIUM**
- **Component**: Database Repository (`packages/database/src/repositories/index.ts`)
- **Reproduction**:
  1. Submit a valid enquiry via `POST /api/enquiries`.
  2. Inspect returned `reference_code`.
- **Expected**: Reference code must start with official MIRSTOERA prefix `MIR-`, e.g. `MIR-000001`.
- **Actual**: Reference code was formatted as `MOM-000001`.
- **Root Cause**: `generateNextReferenceCode` in `EnquiryRepository` hardcoded ``MOM-${String(nextSeq).padStart(6, '0')}``.
- **Owner**: Full-Stack Architect (Agent 2)
- **Fix**: Updated `generateNextReferenceCode` to return ``MIR-${String(nextSeq).padStart(6, '0')}``. Updated assertion in `api.test.ts`.
- **Test**: Vitest API suite assertion `expect(res.body.data.reference_code).toMatch(/^MIR-\d{6}$/)`.
- **Status**: **VERIFIED**

---

### BUG ID: MIR-003
- **Discovered By**: Agent 2 (Vikram) & Agent 3 (Rudra)
- **Title**: Hardcoded notification template key `'momera_enquiry_alert'`
- **Severity**: **LOW**
- **Component**: Backend Public Controller (`apps/api/src/controllers/publicController.ts`)
- **Reproduction**:
  1. Submit enquiry via `/api/enquiries`.
  2. Inspect inserted record in `notification_outbox`.
- **Expected**: `template_key` uses configured `process.env.WHATSAPP_TEMPLATE_NAME` (`mirstoera_enquiry_alert`).
- **Actual**: Hardcoded to legacy `'momera_enquiry_alert'`.
- **Root Cause**: Controller line 160 hardcoded the string literal.
- **Owner**: Backend Engineer / Full-Stack Architect (Agent 2)
- **Fix**: Changed line 160 to `template_key: process.env.WHATSAPP_TEMPLATE_NAME || 'mirstoera_enquiry_alert'`.
- **Test**: Verified outbox insertion in `api.test.ts`.
- **Status**: **VERIFIED**

---

### BUG ID: MIR-004
- **Discovered By**: Agent 5 (Aditya)
- **Title**: Outdated domain and branding in `sitemap.xml` and `robots.txt`
- **Severity**: **MEDIUM**
- **Component**: SEO / Public Static Assets (`apps/web/public/sitemap.xml` & `apps/web/public/robots.txt`)
- **Reproduction**:
  1. Inspect `apps/web/public/sitemap.xml`.
  2. Inspect `apps/web/public/robots.txt`.
- **Expected**: All URLs point to `https://mirstoera.in/` and comment reads `# MIRSTOERA Robots Configuration`.
- **Actual**: Referenced `https://momera.in/` and `# MOMÉRA Robots Configuration`.
- **Root Cause**: Static assets were initialized during earlier stages before the rebrand to Mirstoera.
- **Owner**: Production Release Commander (Agent 5)
- **Fix**: Replaced all occurrences of `https://momera.in` with `https://mirstoera.in` and updated `robots.txt` comment.
- **Test**: Prerender script and static inspection verified.
- **Status**: **VERIFIED**

---

### BUG ID: MIR-005
- **Discovered By**: Agent 3 (Rudra)
- **Title**: Session cookie key strictly hardcoded to `momera_session`
- **Severity**: **LOW**
- **Component**: Authentication Middleware & Controller (`apps/api/src/middleware/auth.ts`, `apps/api/src/controllers/adminController.ts`)
- **Reproduction**:
  1. Log in via `POST /api/admin/login`.
  2. Inspect `Set-Cookie` header.
- **Expected**: Cookie named `mirstoera_session` (with backward-compatible support for `momera_session`).
- **Actual**: Exclusively named `momera_session`.
- **Root Cause**: Cookie identifier was not updated during brand name change.
- **Owner**: Security Hunter (Agent 3)
- **Fix**: Updated `login` to set `mirstoera_session` (and `momera_session`), `auth.ts` to check both, and `logout` to clear both.
- **Test**: Vitest `api.test.ts` verified `mirstoera_session` cookie issuance and validation.
- **Status**: **VERIFIED**

---

### BUG ID: MIR-006
- **Discovered By**: Agent 1 (Arjun)
- **Title**: Absence of real-time package snapshot card on booking form
- **Severity**: **LOW**
- **Component**: Frontend (`apps/web/src/pages/BookingPage.tsx`)
- **Reproduction**:
  1. Select an experience from the dropdown on `/book`.
  2. Observe form UI.
- **Expected**: A visual confirmation card displaying the chosen experience title, tagline, and starting price in INR.
- **Actual**: Customer had to rely solely on the dropdown option label.
- **Root Cause**: Form did not watch `service_slug` to render dynamic visual preview.
- **Owner**: Customer Experience Inspector (Agent 1)
- **Fix**: Added `watch('service_slug')` and rendered a dynamic Royal Navy snapshot card with the royal crest, service tagline, and starting price badge.
- **Test**: Verified across all 4 services on `/book`.
- **Status**: **VERIFIED**
