# MIRSTOERA — Dependency Vulnerability Audit
**Auditor**: ADITYA (DevOps) & KAVIN (Blue Team)  
**Tool**: `npm audit`  
**Execution Timestamp**: October 2026  
**Status**: AUDITED & MITIGATED  

---

## 1. Vulnerability Findings Summary

| Package | Severity | Advisory / CVE | Impact Context | Status & Mitigation |
|---|---|---|---|---|
| `drizzle-orm < 0.45.2` | High | GHSA-gpj5-g38j-94v9 | SQL injection via improperly escaped SQL identifiers in dynamic queries | **Mitigated**: MIRSTOERA repositories do not use raw dynamic SQL identifier generation; all queries use hardcoded column lists and bound parameters (`?`). Upgraded in planned roadmap. |
| `tinypool <= 2.1.1` | Critical | GHSA-5gmw-xhrv-c9v3 | Prototype pollution gadget in test worker options | **Mitigated**: Dev dependency only (via Vitest); never bundled or deployed to production runtime. |
| `react-router 6.0.0 - 7.17.0` | Moderate | GHSA-wrjc-x8rr-h8h6 | Open redirect via backslash in `<Link>` | **Mitigated**: Internal client-side navigation paths are strictly controlled and internal routes are relative. |
| `braces` | High | GHSA-vfj7-8cjw-p6xm | DoS through deeply nested patterns | **Mitigated**: Build-time / development dependency (Chokidar / Tailwind). |
| `postcss-selector-parser` | Moderate | GHSA-rj75-hqrm-r3gf | Quadratic complexity in flat selector parsing | **Mitigated**: Build-time only; static CSS generated at build time. |
| `esbuild <= 0.24.2` | Moderate | GHSA-67mh-4wv8-2f99 | Dev server request handling | **Mitigated**: Local development server only; production runs pre-bundled static assets. |

---

## 2. Production Runtime Attack Surface
None of the build-time or dev-test dependencies (Vitest, Tinypool, Esbuild, PostCSS) are shipped in the production Docker/serverless container runtime. The Node.js production runtime relies strictly on Express, Helmet, CORS, Cookie-Parser, Zod, and Better-SQLite3.
