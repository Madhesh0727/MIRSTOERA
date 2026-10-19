# MIRSTOERA — AI QA Rules & Anti-Hallucination Invariants

These strict rules govern all AI coding agents, subagents, and the Central Orchestrator throughout the development, audit, and lifecycle of MIRSTOERA ("Every Moment Deserves a Crown."). Violations will reject the release gate.

## 1. No Fake Success Responses
- Never stub a backend endpoint with a hardcoded `{ "success": true }` when database operations failed or were omitted.
- Forms must only report success when the backend returns HTTP 201/200 with a genuine, validated database record reference code.
- If the database write fails, the API must return a structured error and the frontend must display an honest, empathetic retry message.

## 2. No Unverified Completion Claims
- Never state that a component, test suite, or integration is "Complete" or "Passing" without executing the command and inspecting the output.
- All test runs must report real exit codes, test counts, and assertion outputs.
- Any skipped, failed, or partially working test must be logged openly in `PROJECT_STATE.md`.

## 3. Zero Ignored TypeScript Errors
- TypeScript compilation must pass cleanly across all packages (`npm run typecheck` or `tsc --noEmit`).
- No `@ts-ignore` or `@ts-expect-error` allowed unless interfacing with a broken third-party typing, in which case a descriptive comment is mandatory.
- Avoid lazy `any` types; all API payloads, DB records, and component props must use strict types from `packages/shared`.

## 4. No Skipped Security Requirements
- Admin endpoints must strictly enforce session authentication and CSRF guards.
- Password hashing must use industry standard cryptographic algorithms (Argon2id or high-cost scrypt/bcrypt). No plaintext passwords in memory or DB.
- Cookies must have `HttpOnly`, `SameSite`, and conditional `Secure` flags.
- Phone numbers and personal enquiry details must never be queryable through unauthenticated public endpoints.

## 5. No Production Mock Data
- While mock seeds are permitted for development and testing fixtures (`npm run db:seed`), the production application must query the live persistent SQLite / D1 database.
- Admin dashboard metrics must be computed via SQL aggregations (`COUNT(*)`, `SUM()`) on live records, never hardcoded numbers.

## 6. No Exposed Secrets
- API keys, session secrets, and database connection credentials must never be committed to git, embedded in client-side bundles, or leaked into error logs.
- Environment variables must be validated at startup using Zod schemas.

## 7. No Destructive Database Shortcuts
- Never delete or drop tables in production or staging as a workaround for schema conflicts.
- Always use managed migrations.
- Preserve integer paise representations for monetary calculations (`79900` paise for ₹799.00) to prevent floating-point rounding errors.

## 8. No Silent Feature Removal
- Do not remove difficult requirements (e.g. idempotency tokens, WhatsApp click-to-chat links, mobile responsive breakpoints, SEO prerendering) simply to make a build pass.
- If a constraint prevents full implementation, document the limitation in `PROJECT_STATE.md` and consult architectural alternatives.

## 9. Optional Numeric Form Input Preservation (MIR-001 Invariant)
- Optional numeric inputs (e.g., custom budget) in React Hook Form must never serialize empty strings as `NaN` or fail Zod integer validation.
- Schema definitions must use `z.preprocess` to normalize empty string/null values, and input hooks must provide `setValueAs` fallback handlers.

## 10. Reference Code Brand Integrity (MIR-002 Invariant)
- All generated customer references must conform to the brand prefix `MIR-` (e.g., `MIR-000001`). Legacy prefixes are strictly forbidden in new enquiry generation.

## 11. Dual Session Cookie Compatibility (MIR-005 Invariant)
- Authentication middleware must verify both primary `mirstoera_session` and legacy `momera_session` cookies during transition phases, and clear both upon logout or expiration.

## 12. Dynamic Notification Configuration (MIR-003 Invariant)
- WhatsApp and notification templates must never be hardcoded into route controllers. They must resolve from environment variables (`WHATSAPP_TEMPLATE_NAME`) with brand defaults (`mirstoera_enquiry_alert`).

## 13. Dynamic State Synchronization (MIR-006 Invariant)
- Forms that carry selected service context (e.g., Booking form) must dynamically reflect package updates, pricing, and exclusions in real-time without requiring full page reloads.

## 14. Playwright E2E Browser Testing Invariant
- Real browser headless execution via Playwright must run against active dev or staging environments across 5 responsive breakpoints (320px–1440px) and critical customer/admin flows before declaring production readiness. Never substitute unit mocks for browser verification.

## 15. WhatsApp Country Code & Non-Digit Normalization Invariant
- Phone numbers configured for WhatsApp redirection must be sanitized to digits only and automatically prefixed with the Indian country code `91` if a 10-digit number is provided (e.g. `9876543210` -> `https://wa.me/919876543210?text=...`). Raw spaces, dashes, or unencoded characters in WhatsApp URLs are strictly prohibited.


