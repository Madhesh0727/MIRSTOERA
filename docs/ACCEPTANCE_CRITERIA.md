# MOMÉRA — Acceptance Criteria & Quality Gates

This document defines the strict acceptance criteria for all features in MOMÉRA v1.0.0.

---

## 1. Public Customer Experience

### 1.1 Homepage (`/`)
- [ ] Renders royal navigation bar with official MOMÉRA brand typography.
- [ ] Renders royal cinematic hero with heading: *"Your Story Deserves a Royal Moment."* and tagline: *"Every Moment Deserves a Crown."*
- [ ] Does not require video to render. Zero layout shifts (CLS < 0.1).
- [ ] Displays all 4 featured experiences with accurate starting prices:
  - Secret Gift Delivery: ₹799
  - Mini Movie Proposal: ₹1,499
  - Cinematic Birthday Surprise: ₹1,799
  - Cinematic Hero Entry: ₹1,299
- [ ] Provides functional CTA links: "Explore Experiences" (`/experiences`) and "Plan My Surprise" (`/book`).
- [ ] Renders sections: How MOMÉRA works, Why Choose MOMÉRA, Storytelling, Gallery Preview, Final CTA, and Footer.

### 1.2 Experiences Catalog & Detail Pages (`/experiences`, `/experiences/:slug`)
- [ ] Catalog renders all 4 services dynamically from shared data.
- [ ] Individual routes exist for `/experiences/secret-gift`, `/experiences/mini-proposal`, `/experiences/birthday-surprise`, `/experiences/hero-entry`.
- [ ] Each detail page contains: Hero visual, starting price, comprehensive description, included highlights, conditions, FAQs, and a "Book This Experience" CTA.
- [ ] Clicking "Book This Experience" navigates to `/book?service=<slug>`, automatically pre-selecting the service in the booking form.

### 1.3 Booking Form (`/book`)
- [ ] Required fields: Customer name, WhatsApp number, selected service, event date, preferred time, event area in Coimbatore, recipient relationship, surprise description, privacy consent checkbox.
- [ ] Optional fields: Estimated budget, additional preferences.
- [ ] Client validation:
  - Phone: Valid 10-digit Indian mobile format (accepts with/without `+91` or `0`, normalizes cleanly).
  - Date: Must be present or future date (in Asia/Kolkata timezone); rejects past dates.
  - Consent: Must be checked.
- [ ] Submissions include an auto-generated client-side `idempotency_key` (UUID v4).
- [ ] Double-clicking submit button does not generate multiple API requests or duplicate database records.
- [ ] On success, transitions to a confirmation view displaying:
  - *"Your Royal Request Has Been Received!"*
  - Generated reference code (e.g. `MOM-000001`).
  - Clear notice that booking is not yet confirmed and payment has not been collected; MOMÉRA concierge will reach out via WhatsApp/call.

### 1.4 Informational Pages (`/our-story`, `/gallery`, `/contact`, `/privacy`, `/terms`)
- [ ] Our Story presents brand mission and Coimbatore emotional storytelling without fabricated testimonials or fake awards.
- [ ] Gallery renders curated concept cards with responsive image layouts.
- [ ] Contact displays configurable business details, live WhatsApp click-to-chat CTA, coverage area, and business hours.
- [ ] Privacy & Terms cover data retention, contact purposes, event safety, and booking conditions.

---

## 2. Admin Portal & Management

### 2.1 Authentication & Security (`/admin/login`)
- [ ] No public registration exists.
- [ ] Admin login accepts email and password, validating against cryptographically hashed records (`admin_users`).
- [ ] Generates an HTTP-only, secure, SameSite session cookie linked to `admin_sessions`.
- [ ] Rate limits consecutive failed login attempts (max 5 per 15 minutes per IP).
- [ ] Unauthenticated requests to `/api/admin/*` immediately return HTTP 401 Unauthorized.

### 2.2 Dashboard & Enquiry Management (`/admin/dashboard`, `/admin/enquiries`)
- [ ] Dashboard displays live counts: Total Enquiries, New, Contacted, Quoted, Confirmed, Completed, Cancelled. Counts are computed via SQL aggregation.
- [ ] Enquiry table displays: Reference Code, Customer Name, Experience, Event Date, Area, Status, Submitted Date, and Actions.
- [ ] Supports filtering by status, search by customer name/phone/reference code, and sorting.
- [ ] Enquiry detail page (`/admin/enquiries/:id`):
  - Displays full submission details.
  - Generates verified WhatsApp click-to-chat link with pre-encoded greeting message.
  - Allows valid status transitions: `NEW` -> `CONTACTED` -> `QUOTED` -> `CONFIRMED` -> `COMPLETED`, or `CANCELLED`.
  - Appends internal notes into `enquiry_notes`.
  - Records every mutation in `admin_audit_logs`.

### 2.3 Services & Settings (`/admin/services`, `/admin/settings`)
- [ ] Admin can update service starting prices, active flags, and descriptions.
- [ ] Admin can update business settings: phone numbers, notification recipient, business hours, and service coverage.
- [ ] Does not expose raw third-party secrets or environment variables in UI.

---

## 3. Database & WhatsApp Outbox

### 3.1 SQLite Persistence
- [ ] Uses Drizzle ORM migrations.
- [ ] Monies stored strictly in integer paise (`79900` paise = ₹799).
- [ ] Concurrency-safe reference code generation (`MOM-000001`).
- [ ] Enquiry creation and outbox creation executed within a single atomic database transaction.
- [ ] Works cleanly with local `better-sqlite3` and Cloudflare `D1`.

### 3.2 Notification Outbox
- [ ] Outbox stores channel (`whatsapp`), recipient, payload JSON, and status (`PENDING`, `SENT`, `FAILED`, `DISABLED`).
- [ ] Default `ManualNotificationProvider` logs the outbox record and enables one-click click-to-chat in admin without crashing or hanging if external APIs are unconfigured.
- [ ] Failed notification attempts do not rollback or corrupt saved customer enquiries.

---

## 4. Performance & SEO

- [ ] Mobile Lighthouse targets: Performance 90+, Accessibility 90+, Best Practices 90+, SEO 95+.
- [ ] LCP <= 2.5s, CLS <= 0.1, INP <= 200ms.
- [ ] Public routes have statically prerendered or server-delivered semantic HTML.
- [ ] `sitemap.xml` and `robots.txt` exist and are accessible.
- [ ] Admin routes are disallowed in `robots.txt` and protected with `<meta name="robots" content="noindex, nofollow">`.
