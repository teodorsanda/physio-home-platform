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

### Makefile workflow
The project ships with idempotent make targets:

```bash
make docker-up       # start postgres, redis, minio, clamav, web, worker
make migrate         # run Prisma migrations (deploy -> dev fallback)
make seed            # populate demo data (3 cities, 10 therapists, 15 patients, 15 bookings)
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
- `pnpm test` – run Vitest suite (unit, API schemas, UI smoke)
- `pnpm build` – Next.js production build

### Demo accounts
| Role | Email | Password |
| --- | --- | --- |
| Patient | patient0@example.com | password |
| Therapist | therapist0@example.com | password |
| Admin | admin@example.com | password |

> Admin role is seeded manually when migrations are applied (see `scripts/seed.ts`).

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
