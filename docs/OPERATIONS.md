# MOMÉRA — Operational Playbook

This document provides day-to-day administrative guidance for operating the MOMÉRA Royal Moments platform.

---

## 1. Enquiry Processing Workflow

When an enquiry is submitted by a customer:
1. **Immediate Outbox Record**: The enquiry is saved in the database with status `NEW`. An outbox record is simultaneously created.
2. **Dashboard Review**: The concierge staff logs in at `/admin/login`.
3. **Inspect Submission**: The staff clicks on the new enquiry to review:
   - Customer Name & WhatsApp Phone Number
   - Experience Type (`Secret Gift Delivery`, `Mini Movie Proposal`, `Cinematic Birthday Surprise`, `Cinematic Hero Entry`)
   - Event Date, Time, and Specific Area in Coimbatore
   - Special preferences and recipient relationship
4. **Initiate WhatsApp Conversation**:
   - The staff clicks **"Open WhatsApp"** on the enquiry screen.
   - This opens the official WhatsApp Web / Mobile app with a prefilled, personalized royal greeting referencing their enquiry code (`MOM-XXXXXX`).
5. **Update Status**:
   - Change status to `CONTACTED`.
   - Log an internal note describing the conversation (e.g., "Customer confirmed venue is their private residence in Saibaba Colony; proposed customized acoustic violin accompaniment").
6. **Quotation & Confirmation**:
   - After agreeing on final customized pricing and venue logistics, staff records the quoted amount and changes status to `QUOTED`.
   - Once customer confirms and provides initial arrangement approval offline, staff updates status to `CONFIRMED`.
7. **Execution & Completion**:
   - After the surprise event is successfully executed, staff marks the enquiry as `COMPLETED`.

---

## 2. Managing Services & Pricing

- Navigate to `/admin/services`.
- Adjust starting prices in INR (e.g. promotional pricing or seasonal adjustments).
- Toggle experience active status if availability is temporarily paused.
- Note: If using static prerendering on the public site, updating services triggers a rebuild or revalidation via the deployment webhook or admin publishing command.

---

## 3. Business Settings Management

- Navigate to `/admin/settings`.
- Update customer-facing contact phone, concierge WhatsApp number, notification alert recipient number, and service coverage notes.
- Changes reflect immediately across the public site and contact links.

---

## 4. Routine Maintenance

- **Backups**: Run automated daily backups using `scripts/backup.js` or Cloudflare D1 backup snapshots.
- **Audit Logs**: Periodically review `/admin/audit-logs` for unusual status changes or login attempts.
