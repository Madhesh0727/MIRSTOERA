# MOMÉRA — User Flows & Interaction Journeys

This document outlines the end-to-end customer and administrative journeys through the MOMÉRA platform.

---

## 1. Flow 1: Customer Discovery to Enquiry Submission

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Web as React Frontend (apps/web)
    participant API as Express API (apps/api)
    participant DB as SQLite / D1 (packages/database)
    participant Outbox as Notification Outbox

    Customer->>Web: Visits Homepage (/)
    Web-->>Customer: Displays Hero, Story, 4 Royal Experiences
    Customer->>Web: Clicks "Explore Experiences" (/experiences)
    Web-->>Customer: Shows 4 Cards with starting prices
    Customer->>Web: Selects "Mini Movie Proposal" (/experiences/mini-proposal)
    Web-->>Customer: Renders details, inclusions, FAQs
    Customer->>Web: Clicks "Plan This Experience"
    Web->>Web: Navigates to /book?service=mini-proposal
    Web-->>Customer: Pre-selects Mini Movie Proposal in form
    Customer->>Web: Fills form (Name, Phone, Date, Area, Vision) & agrees to consent
    Customer->>Web: Clicks "Send My Royal Request"
    Web->>API: POST /api/enquiries (with client UUID idempotency_key)
    API->>API: Validate input schemas (Zod) & normalize phone
    API->>DB: Atomic Transaction: INSERT enquiry + INSERT outbox record
    DB-->>API: Returns Reference Code (e.g. MOM-000001)
    API-->>Web: 201 Created { reference_code: "MOM-000001", status: "NEW" }
    Web-->>Customer: Displays Royal Confirmation Screen with Reference Code
```

---

## 2. Flow 2: Admin Concierge Management & WhatsApp Contact

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant Web as Admin Dashboard (/admin)
    participant API as Backend API
    participant DB as SQLite
    actor Customer

    Admin->>Web: Visits /admin/login
    Admin->>Web: Submits credentials
    Web->>API: POST /api/admin/login
    API->>DB: Verify password hash & create session
    API-->>Web: Set-Cookie: momera_session (HttpOnly, Secure, SameSite)
    Web->>Web: Redirects to /admin/dashboard
    Web->>API: GET /api/admin/dashboard
    API->>DB: Aggregates counts by status (NEW, CONTACTED, etc.)
    API-->>Web: Metrics data
    Admin->>Web: Clicks "Enquiries" (/admin/enquiries)
    Web->>API: GET /api/admin/enquiries?status=NEW
    API-->>Web: List of new enquiries
    Admin->>Web: Opens enquiry details (/admin/enquiries/:id)
    Admin->>Web: Clicks "Open WhatsApp"
    Web->>Customer: Opens wa.me link with prefilled tailored royal greeting
    Admin->>Web: Changes Status to "CONTACTED" + adds note
    Web->>API: PATCH /api/admin/enquiries/:id/status { status: "CONTACTED" }
    API->>DB: Update status, insert note, insert audit log
    API-->>Web: 200 OK
```

---

## 3. Flow 3: Edge Case & Idempotency Handling

```mermaid
flowchart TD
    A[Customer Clicks 'Send My Royal Request'] --> B{Form Valid?}
    B -- No --> C[Show Inline Field Errors]
    B -- Yes --> D[Disable Submit Button & Generate UUID Token]
    D --> E[POST /api/enquiries with idempotency_key]
    E --> F{Key Already in DB?}
    F -- Yes --> G[Return Existing Enquiry Record - HTTP 200]
    F -- No --> H[Insert New Enquiry & Outbox - HTTP 201]
    G --> I[Show Confirmation Screen with Existing Reference Code]
    H --> J[Show Confirmation Screen with New Reference Code]
```
