# MOMÉRA — Royal Paper Design System

The MOMÉRA visual design system is built around the concept of a **"Royal Paper Experience"**. The aesthetic evokes opening a bespoke, textured, heavy-stock royal invitation letter sealed with gold foil and burgundy wax, delivered by a modern luxury celebration brand.

---

## 1. Brand Color Palette

| Token Name | Hex Code | Semantic Role | Usage Guidance |
|------------|----------|---------------|----------------|
| `royal-navy` | `#16283D` | Primary Brand / Dark Canvas | Primary text headings, high-contrast buttons, footer background, royal seals. |
| `champagne-gold` | `#C8A45D` | Accent / Metallic Luxury | Borders, ornamental dividers, crown motifs, badges, focus rings, hover glows. |
| `vintage-ivory` | `#F7F1E5` | Surface / Paper Background | Primary background canvas, card backgrounds, modal backdrops. |
| `burgundy` | `#692D40` | Accent / Emotional Warmth | Special celebration tags, urgency badges, proposal accents, wax-seal icons. |
| `ink-black` | `#292623` | High-Legibility Body Text | Paragraph copy, form labels, terms and conditions. |
| `gold-light` | `#E8D49E` | Subtle Glow & Borders | Subtle borders, disabled states, light highlights. |
| `gold-dark` | `#9B7833` | Deep Gold | Button active states, high-contrast borders. |
| `ivory-card` | `#FCF9F2` | Elevated Paper Surface | Service cards, form panels, elevated card containers. |
| `ivory-border` | `#E3D8C4` | Subtle Dividers | Subtle border lines on ivory canvas. |

---

## 2. Typography Hierarchy

### 2.1 Font Families
- **Display & Headings**: Luxury Serif (`Cinzel`, `Playfair Display`, `Cormorant Garamond`, `Georgia`, `serif`).
- **Body & UI**: Modern Clean Sans-Serif (`Inter`, `system-ui`, `-apple-system`, `sans-serif`).
- **Accent Script**: Optional subtle italic serif for quotes and testimonials.

### 2.2 Scale & Line Heights
- **Display 1 (Hero)**: `clamp(2.5rem, 5vw, 4.25rem)` / line-height `1.1`
- **Heading 1**: `clamp(2rem, 3.5vw, 2.75rem)` / line-height `1.2`
- **Heading 2**: `clamp(1.5rem, 2.5vw, 2rem)` / line-height `1.25`
- **Heading 3**: `clamp(1.25rem, 2vw, 1.5rem)` / line-height `1.3`
- **Body Large**: `1.125rem (18px)` / line-height `1.6`
- **Body Regular**: `1rem (16px)` / line-height `1.6`
- **Small / Caption**: `0.875rem (14px)` / line-height `1.5`
- **Micro / Badge**: `0.75rem (12px)` / line-height `1.4`

---

## 3. Design Elements & Motifs

1. **Royal Crown Emblem**:
   - The MOMÉRA crown icon appears subtly in the navigation bar, ornamental section dividers, and confirmation screens.
2. **Gold Ornamental Separators**:
   - Subtle horizontal lines tapering toward the ends with a centered diamond or miniature crown symbol.
3. **Paper Texture & Borders**:
   - Cards feature double borders (an outer 1px gold border and an inset 1px faint border) evoking fine stationery.
   - Soft, warm drop shadows (`rgba(22, 40, 61, 0.06)`).
4. **Interactive States**:
   - Hover on service cards gently lifts the card (`translate-y-[-4px]`) and warms the gold border shadow.
   - Buttons have tactile click states with smooth transition timing (`transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1)`).
5. **Reduced Motion**:
   - Respects `@media (prefers-reduced-motion: reduce)` by removing motion transitions and keeping instant opacity changes.

---

## 4. Mobile-First Responsive Breakpoints

| Breakpoint | Target Screen Sizes | Layout Behavior |
|------------|---------------------|-----------------|
| `xs` | 320px – 375px | Single column, compact padding, tap targets >= 44px |
| `sm` | 376px – 640px | Single column, generous padding, full-width inputs |
| `md` | 641px – 768px | Two-column grids for cards, tablet navigation |
| `lg` | 769px – 1024px | Full desktop nav, multi-column layouts |
| `xl` | 1025px – 1440px | Max content width 1280px, luxury editorial whitespace |
