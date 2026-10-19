# MOMÉRA — UI/UX Detailed Specification

This document details layout structures, component composition, accessibility specifications, and interaction states across all public and administrative views.

---

## 1. Global Layout & Components

### 1.1 Navigation Bar (`RoyalNavbar`)
- **Brand Logo**: MOMÉRA wordmark with a subtle crown icon above the accent 'E'.
- **Links**: Experiences (`/experiences`), Our Story (`/our-story`), Gallery (`/gallery`), Contact (`/contact`).
- **Primary CTA**: "Plan My Surprise" button navigating to `/book`.
- **Mobile Menu**: Full-screen slide-in or luxury modal drawer with accessible `aria-expanded` and trap-focus behavior.
- **Elevation**: Backdrop blur with slight translucent ivory tint on scroll (`bg-[#F7F1E5]/90 backdrop-blur-md`).

### 1.2 Footer (`RoyalFooter`)
- **Top Section**: Grand royal seal, tagline *"Every Moment Deserves a Crown"*, and Coimbatore city indicator.
- **Columns**:
  - Experiences: Secret Gift Delivery, Mini Movie Proposal, Cinematic Birthday Surprise, Cinematic Hero Entry.
  - Discover: Our Story, Gallery, FAQ.
  - Reach Concierge: Phone, WhatsApp, Business Hours, Coverage Area.
  - Legal: Privacy Policy, Terms & Conditions, Admin Login.
- **Bottom Bar**: Copyright & luxury craft statement.

---

## 2. Public Route Specifications

### 2.1 Homepage (`/`)
- **Section 1: Hero**
  - Regal editorial layout.
  - Badge: *"Handcrafted Luxury Celebrations • Coimbatore"*.
  - Headline: *"Your Story Deserves a Royal Moment."*
  - Subhead: *"We turn ordinary celebrations into extraordinary memories through beautifully crafted surprise experiences."*
  - Dual CTAs: Primary ("Explore Experiences" -> `/experiences`) and Secondary Outline ("Plan My Surprise" -> `/book`).
  - No continuous background videos or heavy canvas rendering.
- **Section 2: Brand Introduction & Royal Standard**
  - Why bespoke curation matters; emotional storytelling philosophy.
- **Section 3: Four Featured Experiences**
  - Grid of 4 luxury service cards showcasing image, title, starting price (`₹799`, `₹1,499`, `₹1,799`, `₹1,299`), key inclusions, "View Details" link, and "Book Now" link.
- **Section 4: The MOMÉRA Journey (How It Works)**
  - Step 1: Share Your Vision (Submit your private enquiry).
  - Step 2: Bespoke Curation (Concierge collaborates on WhatsApp to tailor quotation & timeline).
  - Step 3: Royal Execution (Flawless surprise reveal orchestrated by our crew).
- **Section 5: Why Coimbatore Trusts MOMÉRA**
  - Cinematic smartphone filming, punctuality, zero safety compromises, respectful discreet coordination.
- **Section 6: Gallery Preview & Emotional Stories**
  - Highlight moments and concept cards.
- **Section 7: Final Royal Invitation CTA**
  - Regal invitation card with wax-seal motif inviting the visitor to book.

### 2.2 Experiences Catalog (`/experiences`)
- Displays all 4 services with filter tabs ("All", "Romance", "Birthdays", "Gifting").
- Cards provide clear starting price pills, highlights, and direct booking links.

### 2.3 Individual Service Detail Pages (`/experiences/:slug`)
- Dynamic routes matching:
  - `/experiences/secret-gift`
  - `/experiences/mini-proposal`
  - `/experiences/birthday-surprise`
  - `/experiences/hero-entry`
- Full package breakdown:
  - Hero visual & starting price badge.
  - Comprehensive narrative of the experience.
  - "The Royal Package" checklist (everything included).
  - "Optional Upgrades" section (custom cakes, luxury bouquets, extended drone coverage).
  - "Important Guidelines & Safety" (e.g. venue permissions, comfort-first policy, zero fireworks).
  - Frequently Asked Questions accordion.
  - Sticky/Prominent "Book This Experience" CTA passing `?service=<slug>` to `/book`.

### 2.4 Book Your Moment (`/book`)
- **Step Header**: Step indicator or luxury invitation envelope aesthetic.
- **Accessible Form**:
  - Auto-selects service if passed via URL parameter (`?service=mini-proposal`).
  - Input styling: Gold-accented borders, ivory background, accessible contrast ratios (`#292623` on `#FCF9F2` is > 10:1).
  - Real-time client-side error validation using React Hook Form + Zod.
  - Idempotency token generation on mount.
  - Accessible `aria-invalid` and `aria-describedby` error bindings.
- **Success State**:
  - Renders a gold-bordered royal certificate confirmation.
  - Displays unique Reference Code (`MOM-XXXXXX`).
  - Transparent guidance: Informs customer that enquiry is received, payment is NOT yet requested, and concierge will initiate WhatsApp contact shortly.
  - Button to initiate immediate WhatsApp message with prefilled reference code if desired.

### 2.5 Informational Pages
- `/our-story`: Philosophical depth on celebration, Coimbatore culture, and emotional cinema moments.
- `/gallery`: High-resolution responsive concept cards with lightbox preview.
- `/contact`: Direct phone, WhatsApp concierge link, business hours, and interactive FAQ.
- `/privacy` & `/terms`: Plain-English, comprehensive consumer transparency policies.

---

## 3. Admin Portal Layout

- **Sidebar / Header**: Clean, accessible administrative navigation.
- **Metric Cards**: Real-time calculated counters (New, Contacted, Quoted, Confirmed, Completed, Cancelled).
- **Enquiry Filter Toolbar**: Search query, status dropdown, service dropdown, date range.
- **Enquiry Detail Drawer / Page**: Full audit trail, inline status updater, note creation, and one-click WhatsApp action.
