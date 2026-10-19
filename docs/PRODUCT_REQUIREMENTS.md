# MOMÉRA — Product Requirements Document (PRD)

**Brand:** MOMÉRA  
**Tagline:** Every Moment Deserves a Crown.  
**Version:** 1.0.0  
**Initial Market:** Coimbatore, Tamil Nadu, India.  
**Currency:** INR (₹), stored as integer paise.  
**Business Model:** Curated luxury surprise moments; enquiry submission online, manual concierge confirmation & payment offline in V1.

---

## 1. Product Catalog & Offerings

### Product 1: Secret Gift Delivery
- **Slug**: `secret-gift`
- **Starting Price**: ₹799 (79,900 paise)
- **Tagline**: An unexpected knock, an unforgettable smile.
- **Description**: Personalized surprise gift experiences for lovers, friends, family members, and special milestones.
- **Included Package**:
  - Small personalized gift box
  - Chocolates
  - Handwritten custom message card on luxury textured paper
  - Selected fresh flower or curated gift item
  - Attractive royal gift wrapping
  - Scheduled surprise doorstep delivery
  - Optional short memory video clip
- **Exclusions**: Custom premium gifts and extended-distance travel outside central Coimbatore are quoted separately.

### Product 2: Mini Movie Proposal
- **Slug**: `mini-proposal`
- **Starting Price**: ₹1,499 (149,900 paise)
- **Tagline**: Say "Yes" to a scene straight out of cinema.
- **Description**: Emotional, cinematic proposal setups inspired by iconic movie romance.
- **Included Package**:
  - Three long-stem premium roses
  - Personalized wax-sealed love letter
  - Minimalist candlelit/fairy-lit romantic ambiance
  - Couple's favorite romantic background soundtrack
  - On-site discreet proposal coordination
  - Short edited cinematic vertical reel for social sharing
- **Conditions**: Prior venue permission required; utmost respect for recipient comfort and privacy.

### Product 3: Cinematic Birthday Surprise
- **Slug**: `birthday-surprise`
- **Starting Price**: ₹1,799 (179,900 paise)
- **Tagline**: The grandest spotlight for their special day.
- **Description**: Movie-inspired birthday reveals featuring emotional storytelling and heartfelt surprises.
- **Included Package**:
  - Elegant balloon cluster decoration (matte royal navy & champagne gold)
  - Custom royal birthday banner
  - Warm fairy light backdrop
  - Personalized birthday scroll/letter
  - Curated keepsake gift
  - Surprise countdown and reveal coordination
  - Short edited cinematic celebration video
- **Exclusions**: Cake, venue rental, and complex pyrotechnics/sound systems.

### Product 4: Cinematic Hero Entry
- **Slug**: `hero-entry`
- **Starting Price**: ₹1,299 (129,900 paise)
- **Tagline**: Arrive like a movie star.
- **Description**: Heroic cinematic entrances for grooms, birthday celebrants, or corporate honorees.
- **Included Package**:
  - Cinematic entry concept design & choreography
  - Entrance music cueing and coordination
  - Reusable styling props (sunglasses, smoke flares if permitted, confetti poppers)
  - Coordination with customer-provided friends and entourage
  - High-framerate smartphone cinematic filming (slow-motion walk, hero turns)
  - Short edited cinematic hero entry reel
- **Safety**: Strictly zero dangerous pyrotechnics, no stunts, no road blockage, no unpermitted public property usage.

---

## 2. Business Rules & Financial Policy

1. **Starting Prices Only**: All prices displayed on public pages are marked "Starting from ₹...".
2. **No Advance Gateway in V1**: To ensure custom feasibility in Coimbatore (venue permits, delivery radius, custom requests), V1 does not capture advance credit card or UPI transactions on the web.
3. **Admin Concierge Consultation**: Admin reviews incoming submissions, contacts customer via WhatsApp/call, provides an exact tailored quotation, and closes bookings.
4. **Idempotency**: Duplicate form submissions by a double-clicking customer must not spawn duplicate enquiry records.
5. **Human-Readable Identifiers**: Enquiries receive an easily legible code (e.g. `MOM-000001`).

---

## 3. Customer Data & Privacy Scope

1. **Collected Fields**:
   - Customer Name (Required)
   - WhatsApp Phone Number (Required, validated for 10-digit Indian mobile numbers)
   - Selected Service (Required)
   - Event Date (Required, cannot be in the past)
   - Preferred Event Time (Required)
   - Event City/Area in Coimbatore (Required, e.g., RS Puram, Gandhipuram, Peelamedu, Saibaba Colony, Saravanampatti)
   - Recipient Relationship (Required: Partner/Spouse, Friend, Parent, Child, Colleague, Other)
   - Surprise Description & Vision (Required)
   - Estimated Budget (Optional, in ₹)
   - Additional Preferences (Optional)
   - Privacy Consent (Required checkbox)
2. **Data Confidentiality**:
   - Customer phone numbers and event details are private personal data.
   - Public APIs must never expose lists of enquiries or allow enumeration of customer names or contacts.
