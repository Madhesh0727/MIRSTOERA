# MOMÉRA — Backend API Contract & Specification

**Base URL**: `/api`  
**Envelope Structure**:
- **Success**:
  ```json
  {
    "success": true,
    "data": {},
    "message": "Operation completed"
  }
  ```
- **Error**:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Please check the submitted details",
      "details": []
    }
  }
  ```

---

## 1. Public Endpoints

### 1.1 `GET /api/health`
- **Description**: Verifies API server health, uptime, and database connection.
- **Response `data`**:
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2026-10-19T06:00:00.000Z",
    "database": "connected"
  }
  ```

### 1.2 `GET /api/services`
- **Description**: Returns all active experiences ordered by `display_order`.
- **Response `data`**: Array of services:
  ```json
  [
    {
      "id": 1,
      "slug": "secret-gift",
      "title": "Secret Gift Delivery",
      "tagline": "An unexpected knock, an unforgettable smile.",
      "description": "Personalized surprise gift experiences...",
      "starting_price_paise": 79900,
      "starting_price_inr": 799,
      "is_active": true,
      "display_order": 1
    }
  ]
  ```

### 1.3 `GET /api/services/:slug`
- **Description**: Returns single active service by slug.
- **Status Codes**: 200 OK, 404 Not Found.

### 1.4 `POST /api/enquiries`
- **Description**: Submits customer booking enquiry with idempotency protection.
- **Request Headers**: `X-Idempotency-Key` (or in JSON body `idempotency_key`).
- **Request Body**:
  ```json
  {
    "idempotency_key": "c4b3f81e-1234-4567-89ab-cdef01234567",
    "customer_name": "Aravind Kumar",
    "customer_phone": "9876543210",
    "service_slug": "mini-proposal",
    "event_date": "2026-11-15",
    "event_time": "18:30",
    "event_area": "Race Course, Coimbatore",
    "recipient_relationship": "Partner/Spouse",
    "description": "Sunset proposal near the walkway with violin music.",
    "budget_inr": 2500,
    "additional_preferences": "Prefers red roses over white.",
    "privacy_consent": true
  }
  ```
- **Response `data`**:
  ```json
  {
    "id": 1,
    "reference_code": "MOM-000001",
    "status": "NEW",
    "created_at": "2026-10-19T06:00:00.000Z"
  }
  ```

### 1.5 `GET /api/public-settings`
- **Description**: Returns safe, publicly viewable business configuration.
- **Response `data`**:
  ```json
  {
    "brand_name": "MOMÉRA",
    "tagline": "Every Moment Deserves a Crown.",
    "phone": "+919876543210",
    "whatsapp": "+919876543210",
    "email": "concierge@momera.in",
    "service_coverage": "Coimbatore, Tamil Nadu, India",
    "business_hours": "09:00 AM - 09:00 PM IST"
  }
  ```

---

## 2. Admin Authentication Endpoints

### 2.1 `POST /api/admin/login`
- **Request Body**: `{ "email": "admin@momera.in", "password": "password" }`
- **Security**: Rate limited. Sets HttpOnly, Secure cookie `momera_session`.
- **Response `data`**: `{ "user": { "id": 1, "email": "admin@momera.in" } }`

### 2.2 `POST /api/admin/logout`
- **Description**: Invalidates session in database and clears session cookie.

### 2.3 `GET /api/admin/session`
- **Description**: Validates active session and returns authenticated admin details.

---

## 3. Admin Management Endpoints (Requires Session Cookie)

### 3.1 `GET /api/admin/dashboard`
- **Response `data`**:
  ```json
  {
    "metrics": {
      "total": 42,
      "new": 10,
      "contacted": 14,
      "quoted": 8,
      "confirmed": 6,
      "completed": 3,
      "cancelled": 1
    },
    "recent_enquiries": [...]
  }
  ```

### 3.2 `GET /api/admin/enquiries`
- **Query Parameters**: `status`, `service_slug`, `search`, `page`, `limit`, `sort_by`, `sort_order`.
- **Response `data`**: Paginated items and metadata.

### 3.3 `GET /api/admin/enquiries/:id`
- **Response `data`**: Full enquiry record, internal notes array, status timeline, and pre-generated WhatsApp click-to-chat URL.

### 3.4 `PATCH /api/admin/enquiries/:id/status`
- **Request Body**:
  ```json
  {
    "status": "CONTACTED",
    "quoted_price_paise": 250000,
    "note": "Called customer; agreed on sunset timing."
  }
  ```

### 3.5 `POST /api/admin/enquiries/:id/notes`
- **Request Body**: `{ "note": "Customer requested red velvet cake supplier recommendation." }`

### 3.6 `GET /api/admin/services`, `POST /api/admin/services` & `PATCH /api/admin/services/:id`
- **Description**: Query, create, and update service experiences, event pricing in INR/paise, description, and catalog availability.
- **`POST /api/admin/services` Request Body**:
  ```json
  {
    "title": "Royal Starlight Proposal",
    "slug": "royal-starlight-proposal",
    "tagline": "Underneath the Coimbatore stars.",
    "description": "A bespoke candlelit terrace proposal with live violin accompaniment.",
    "starting_price_inr": 2499,
    "display_order": 5,
    "is_active": true
  }
  ```
- **`PATCH /api/admin/services/:id` Request Body**:
  ```json
  {
    "title": "Updated Title",
    "tagline": "Updated Tagline",
    "starting_price_inr": 1999,
    "description": "Updated experience lore...",
    "is_active": true,
    "display_order": 2
  }
  ```

### 3.7 `GET /api/admin/settings` & `PATCH /api/admin/settings`
- **Description**: View and update business operational parameters.

### 3.8 `GET /api/admin/notifications` & `POST /api/admin/notifications/:id/retry`
- **Description**: Inspect notification outbox records and trigger retries for failed dispatches.

### 3.9 `GET /api/admin/audit-logs`
- **Description**: Query audit events (`action`, `entity_type`, `admin_id`, `created_at`).
