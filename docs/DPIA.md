# Data Protection Impact Assessment

## Overview
Kinetix HomeCare processes personal and health-related data for the purpose of coordinating home-based physiotherapy visits. The platform stores limited patient information (identification, onboarding answers, booking history) and medical documentation required for verifying prescription and progress. All storage occurs in encrypted PostgreSQL (for structured data) and MinIO with server-side encryption (for documents).

## Data flows
1. **Registration** – user creates an account using email/phone; password hashed with bcrypt; optional OTP delivered by SMS provider (Twilio stub in dev).
2. **Document upload** – patient uploads documents via pre-signed URL. Files are scanned by ClamAV, OCRed via BullMQ worker, then persisted in MinIO with encrypted object keys.
3. **Booking** – patient selects appointment details and pays via Stripe. Booking data stored in PostgreSQL with audit logs for changes.
4. **Realtime tracking** – therapist shares coordinates through Socket.IO. Location data retained temporarily (max 24h) for dispute resolution.
5. **Reporting** – aggregated metrics generated without PHI.

## Risks and mitigations
| Risk | Mitigation |
| --- | --- |
| Unauthorized PHI access | Role-based access control and field-level masking ensure only authorized users see sensitive fields. Audit logs capture all reads/writes. |
| Data in transit interception | HTTPS required for all external traffic. Signed URLs expire in minutes. |
| Data retention creep | Automated retention policies purge inactive accounts after 24 months and anonymize analytics. |
| Worker compromise | Workers run in isolated container with least privilege and rotate credentials. |
| Third-party dependency outage | Graceful degradation with friendly stubs when secrets are missing; retry queues for OCR/virus scanning. |

## Lawful basis
Care delivery and legitimate interest under GDPR Art. 6(1)(b) and 6(1)(f); health data processed under Art. 9(2)(h).

## DPIA actions
- Conduct annual penetration testing.
- Maintain vendor DPIA for Stripe, Twilio, Google Maps.
- Provide user-facing privacy portal for exports and deletion requests (implemented under `/api/privacy/*`).
