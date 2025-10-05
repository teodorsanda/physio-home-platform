.PHONY: docker-up docker-down migrate seed dev build test generate lint install

package_manager ?= npm

install:
@if command -v pnpm >/dev/null 2>&1 && [ -f pnpm-lock.yaml ]; then pnpm install; else npm install; fi

docker-up:
docker compose up -d --build
docker compose ps

migrate:
npx prisma migrate deploy || npx prisma migrate dev --name init

seed:
npx prisma generate
npx tsx scripts/seed.ts

dev:
$(package_manager) run dev

build:
$(package_manager) run build

lint:
next lint

generate:
npx prisma generate
npx tsx scripts/generate-openapi.ts

test:
$(package_manager) run test

docker-down:
docker compose down -v
