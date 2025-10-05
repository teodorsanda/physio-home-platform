# Kinetix HomeCare

A production-ready monorepo for a home-visit physiotherapy platform built with Next.js 14, Prisma, and a modern TypeScript stack. The repository contains the public marketing site, patient application, therapist console, admin operations dashboard, and backend REST APIs with realtime updates.

## Tech stack
- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui primitives
- **Data**: Prisma ORM, PostgreSQL, Redis (queues & sockets), MinIO for secure object storage
- **Auth**: NextAuth with email/password + OTP stub
- **Payments**: Stripe (test mode)
- **Realtime**: Socket.IO for therapist location streaming
- **Queues/OCR**: BullMQ + Tesseract stub via worker service
- **Security**: RBAC-ready structure, audit logs, PHI masking hooks, DPIA/RoPA docs
- **i18n**: English + Romanian message catalogs in `/i18n`

## Apps
- `/` – marketing site with AI concierge widget
- `/patient` – patient portal (onboarding, bookings, document management, help center)
- `/therapist` – therapist console (schedule, routing, SOAP notes placeholder)
- `/admin` – operations dashboard (dispatch board, KYC review, analytics)
- `/api/*` – REST endpoints with Zod validation; `/lib/sdk` provides typed client

## Getting started

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm
- Docker

### Environment
Copy `.env.example` to `.env.local` and adjust secrets as needed.

```bash
cp .env.example .env.local
```

| Key | Description | Default |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection for Prisma | `postgresql://postgres:postgres@localhost:5432/physio` |
| `DIRECT_URL` | Direct connection for migrations | `postgresql://postgres:postgres@localhost:5432/physio` |
| `REDIS_URL` | Redis connection for queues/realtime | `redis://localhost:6379` |
| `MINIO_ENDPOINT` | MinIO endpoint (S3 compatible) | `http://localhost:9000` |
| `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` | Object storage credentials | `minioadmin` |
| `MINIO_BUCKET` | Bucket storing encrypted documents | `physio-docs` |
| `NEXTAUTH_URL` | NextAuth base URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` / `JWT_SECRET` | Auth secrets (change in prod) | `change-me` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | SMTP settings for transactional mail | `localhost` / `1025` / _empty_ |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_MESSAGING_SERVICE_SID` | Phone OTP integration stubs | `ACXXXX` / `XXXX` / `MGXXXX` |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe test credentials | `sk_test_xxx` / `pk_test_xxx` / `whsec_xxx` |
| `GOOGLE_MAPS_API_KEY` / `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps (server & client) | `AIza...` |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for the typed REST SDK | `http://localhost:3000` |
| `NEXT_PUBLIC_REALTIME_URL` | Socket.IO endpoint exposed to clients | `http://localhost:3000` |

### Makefile workflow
The project ships with idempotent make targets:

```bash
make docker-up       # start postgres, redis, minio, clamav, web, worker
make migrate         # run Prisma migrations (deploy -> dev fallback)
make seed            # populate demo data (3 cities, 10 therapists, 15 patients, 10 upcoming + 5 past bookings)
make dev             # run Next.js dev server
```

Shutdown and cleanup:
```bash
make docker-down
```

The acceptance path is:
```bash
make docker-up && sleep 10 && make migrate && make seed && make dev
```

### Scripts
- `pnpm generate` – regenerates Prisma client and OpenAPI spec
- `pnpm test:unit` – unit coverage for utilities and guards
- `pnpm test:api` – API route smoke/e2e coverage (auth, bookings, payments webhook)
- `pnpm test:ui` – UI smoke assertions
- `pnpm build` – Next.js production build

### Demo accounts
| Role | Email | Password |
| --- | --- | --- |
| Patient | patient0@example.com | password |
| Therapist | therapist0@example.com | password |
| Admin | admin@example.com | password |

Seed data includes 3 Romanian metros, 10 therapists (5 male / 5 female), 15 patients, 10 upcoming bookings, and 5 historical visits with invoices and payments.

## Architecture highlights
- **Prisma schema** under `/prisma/schema.prisma` defines RBAC-friendly models with soft delete fields.
- **API validation** centralised with Zod via `/lib/sdk/schemas.ts` and reused by route handlers and the generated OpenAPI specification.
- **Realtime** via `/lib/realtime` hooks and Socket.IO server stubs; therapist route updates broadcast to patient UI.
- **Workers** – `worker/index.ts` registers OCR/virus scanning queue with BullMQ (stubbed for local development).
- **Security & privacy** – DPIA, RoPA, and breach checklist under `/docs`; privacy portal endpoints under `/api/privacy/*`.

## Testing

```bash
pnpm test          # Vitest (unit + schema + UI smoke)
```

Playwright can be enabled later for richer E2E coverage; see `tests/ui` for initial smoke assertions.

## Troubleshooting
- **Missing API keys** – UI renders friendly fallbacks and logs warnings; ensure `.env.local` is populated.
- **Database not ready** – Prisma waits via docker healthchecks; run `docker compose logs postgres` for readiness.
- **MinIO SSL** – default compose uses HTTP for local dev; configure TLS certificates in production.

## License
MIT
