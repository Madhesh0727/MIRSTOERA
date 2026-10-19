# MIRSTOERA — Automated End-to-End Test Plan
**Commander**: MEERA (Zero-Excuse QA Engineer)  
**Frameworks**: Playwright Test & Vitest  
**Execution Environment**: Headless Chromium / Node.js 22  
**Status**: ACTIVE & 100% PASSING  

---

## 1. Test Architecture & Objectives
The E2E test plan verifies the complete end-to-end customer and administrative journeys:
1. **Public Site Traversal**: 10 public pages, brand slogan consistency, navigation links, and experience cards.
2. **Catalog Integrity & Pricing**: 4 canonical services with exact approved prices:
   - Secret Gift Delivery: ₹799
   - Mini Movie Proposal: ₹1,499
   - Cinematic Birthday Surprise: ₹1,799
   - Cinematic Hero Entry: ₹1,299
3. **Reservation Form Workflow**: Experience pre-selection via URL query parameters, dynamic preview synchronization, live field validation, future date restriction, and submission.
4. **Data Persistence & Reference Generation**: Verification that enquiries are written to SQLite, assigned format `MIR-XXXXXX`, and dispatch WhatsApp chat links.
5. **Administrative Lifecycle**: Authentication, dashboard metrics inspection, enquiry detail viewing, valid status progression (`NEW` -> `CONTACTED` -> `QUOTED` -> `CONFIRMED`), internal note additions, dynamic settings modifications, and session revocation.
6. **Responsive Layouts**: Breakpoints 320px, 375px, 768px, 1024px, 1440px with strict `document.documentElement.scrollWidth <= window.innerWidth` assertions.
7. **Security Guards**: Direct unauthenticated admin access rejection (HTTP 401), XSS payload neutralization, and stack trace protection.
