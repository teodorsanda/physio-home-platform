# Record of Processing Activities

| Process | Data subjects | Data categories | Purpose | Storage | Retention |
| --- | --- | --- | --- | --- | --- |
| Account management | Patients, therapists, admins | Identification data (name, email, phone) | Provide authentication, communication | PostgreSQL (encrypted at rest) | Active account + 24 months |
| Patient onboarding | Patients | Health information (diagnosis, referral, mobility constraints) | Ensure clinical suitability of home visit | PostgreSQL JSON (encrypted) | 24 months after last booking |
| Document storage | Patients, therapists | Identity documents, medical referrals, invoices | Compliance, reimbursement | MinIO (SSE-S3), checksum logged | 36 months |
| Booking coordination | Patients, therapists | Schedules, addresses, route telemetry | Dispatch and fulfil home visits | PostgreSQL + Redis (transient) | Operational data 24 months, telemetry 24h |
| Payments | Patients | Payment intent IDs, invoices | Stripe payment processing, accounting | Stripe + PostgreSQL | 10 years (accounting) |
| Support interactions | Patients | Chat transcripts, handover notes | Provide non-medical support | PostgreSQL | 24 months |
| Analytics | Aggregated users | Aggregated KPIs (no PHI) | Service improvement | PostgreSQL (anonymised) | Indefinite |
