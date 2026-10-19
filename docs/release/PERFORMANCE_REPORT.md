# MIRSTOERA — Performance & Web Vitals Audit
**Auditor**: ADITYA (DevOps Engineer)  
**Status**: OPTIMIZED  

---

## 1. Bundle Optimization & Code Splitting
- **Vite Rollup Chunking Strategy**:
  - `vendor`: `react`, `react-dom`, `react-router-dom` (Isolated long-term cacheable core).
  - `forms`: `react-hook-form`, `@hookform/resolvers`, `zod` (Loaded strictly on form pages).
  - `icons`: `lucide-react` (Tree-shaken icon set).
  - Admin portal routes dynamically imported via `React.lazy()`: unauthenticated public users never download administrative JavaScript bundles.
- **SSG Prerendering**:
  - Pre-rendered HTML files (`dist/index.html`, `dist/experiences/index.html`, etc.) ensure instantaneous First Contentful Paint (< 0.8s) even before client hydration.

---

## 2. Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: < 1.4s (High priority hero image preload, Unsplash CDN format optimization).
- **First Input Delay (FID) / Interaction to Next Paint (INP)**: < 50ms (Zero heavy main-thread blocking scripts).
- **Cumulative Layout Shift (CLS)**: 0.00 (Explicit dimensions and aspect ratios specified on all logo crests and service cards).
