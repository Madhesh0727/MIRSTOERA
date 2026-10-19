# MOMÉRA — SEO & Discoverability Strategy Report

**Document Version**: 1.0.0  
**Target Market**: Coimbatore, Tamil Nadu, India  
**Auditor**: Sub-Agent 8 (DevOps, SEO & Performance Engineer)  
**Status**: **IMPLEMENTED & PRERENDERED**

---

## 1. Local Search Strategy & Geographic Targeting

MOMÉRA's primary V1 market is **Coimbatore, Tamil Nadu**. All metadata, copywriting, and structured schemas are specifically tuned to rank for high-intent local search queries:

### Primary Keyword Targets
1. **Surprise Planners in Coimbatore** (Target: `/`, `/experiences`)
2. **Birthday Surprise in Coimbatore** (Target: `/experiences/birthday-surprise`)
3. **Romantic Proposal Planning Coimbatore** (Target: `/experiences/mini-proposal`)
4. **Surprise Gift Delivery Coimbatore** (Target: `/experiences/secret-gift`)
5. **Cinematic Hero Entry Coimbatore** (Target: `/experiences/hero-entry`)
6. **Coimbatore Midnight Surprise Planners** (Target: `/contact`, `/our-story`)

### Localized Service Areas Covered
- RS Puram
- Race Course
- Peelamedu
- Gandhipuram
- Saibaba Colony
- Saravanampatti
- Ramanathapuram
- Singanallur
- Vadavalli
- Kovaipudur
- Podanur
- Kuniyamuthur
- Thudiyalur
- Ganapathy
- Ondipudur

---

## 2. Prerendering & Static Generation Architecture

Because MOMÉRA is built with React and Vite as a lightweight single-page application, traditional client-only SPAs suffer from delayed indexing by web crawlers.

To ensure 100% discoverability, a custom prerendering pipeline (`scripts/prerender.js`) executes during `npm run build`. It generates discrete static `index.html` files for all 11 public routes:

```
dist/
├── index.html                           (Homepage)
├── experiences/
│   ├── index.html                       (Catalog)
│   ├── secret-gift/index.html           (Secret Gift Delivery)
│   ├── mini-proposal/index.html         (Mini Movie Proposal)
│   ├── birthday-surprise/index.html     (Cinematic Birthday Surprise)
│   └── hero-entry/index.html            (Cinematic Hero Entry)
├── our-story/index.html                 (About / Brand Philosophy)
├── gallery/index.html                   (Concept Visual Gallery)
├── contact/index.html                   (Coimbatore Concierge)
├── privacy/index.html                   (Privacy Policy)
├── terms/index.html                     (Terms of Service)
├── sitemap.xml                          (Google/Bing Sitemap)
└── robots.txt                           (Crawler Guidance)
```

### Prerendered HTML Inclusions per Route
- **Unique `<title>` tag** featuring service name, location, and brand.
- **Unique `<meta name="description">`** tailored to search snippets.
- **Self-referential Canonical Tag** (`<link rel="canonical" href="https://momera.in/..." />`).
- **OpenGraph Protocol Tags** (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`).
- **Twitter Card Metadata** (`summary_large_image`).
- **Schema.org JSON-LD Script Blocks**.
- **Crawler HTML Fallback** embedded inside `<div id="root">` so text search spiders receive semantic headers and descriptions without running JavaScript.

---

## 3. Structured Data (Schema.org JSON-LD)

### 3.1 LocalBusiness Schema (Injected on Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "MOMÉRA — Royal Moments Experience Platform",
  "image": "https://momera.in/logo.png",
  "telephone": "+919876543210",
  "email": "concierge@momera.in",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Coimbatore",
    "addressRegion": "Tamil Nadu",
    "addressCountry": "IN"
  },
  "priceRange": "₹₹",
  "url": "https://momera.in"
}
```

### 3.2 Service & Offer Schemas (Injected on Experience Detail Pages)
Each individual experience page embeds explicit pricing and availability in INR:
- **Secret Gift Delivery**: `price: "799"`, `priceCurrency: "INR"`, `areaServed: "Coimbatore"`
- **Mini Movie Proposal**: `price: "1499"`, `priceCurrency: "INR"`, `areaServed: "Coimbatore"`
- **Cinematic Birthday Surprise**: `price: "1799"`, `priceCurrency: "INR"`, `areaServed: "Coimbatore"`
- **Cinematic Hero Entry**: `price: "1299"`, `priceCurrency: "INR"`, `areaServed: "Coimbatore"`

---

## 4. Robots.txt and Sitemap.xml Verification

### 4.1 Robots.txt (`apps/web/public/robots.txt`)
```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://momera.in/sitemap.xml
```
- **Public access**: Enabled for all major search engines.
- **Admin security**: `/admin` and `/api/` are blocked from public crawler indexes to prevent indexing administrative entry points.

### 4.2 Sitemap.xml (`apps/web/public/sitemap.xml`)
Includes all 12 public canonical URLs with priority weights:
- `/`: Priority `1.0`, weekly change frequency.
- `/experiences`, `/book`: Priority `0.9`.
- Service pages (`/experiences/*`): Priority `0.8`.
- Content pages (`/our-story`, `/gallery`, `/contact`): Priority `0.7`.
- Legal policies (`/privacy`, `/terms`): Priority `0.3`.

---

## 5. Mobile & Social Sharing Card Preview

When shared on WhatsApp, Facebook, iMessage, or Twitter/X:
- **Title**: *MOMÉRA — Royal Moments Experience Platform*
- **Description**: *Every Moment Deserves a Crown. Turn ordinary celebrations into extraordinary memories with handcrafted luxury surprise experiences in Coimbatore.*
- **Image**: `https://momera.in/logo.png` (High-resolution transparent brand emblem with crown, winged M, and typography).
- **Theme Color**: `#16283D` (Royal Navy header in mobile browsers).
