# Ateneo Bathroom Reviews

A campus bathroom rating app for Ateneo de Manila University students — browse, review, and discover the best (and worst) restrooms on campus.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/ateneo-br run dev` — run the frontend (port 24079)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS + wouter + React Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/db/src/schema/bathrooms.ts` — DB schema (bathrooms + reviews tables)
- `artifacts/api-server/src/routes/` — API route handlers (bathrooms, reviews, stats)
- `artifacts/ateneo-br/src/pages/` — Frontend pages (Home, Browse, BathroomDetail, SubmitBathroom)
- `lib/api-client-react/src/generated/` — Generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — Generated Zod schemas for server validation (do not edit)

## Architecture decisions

- OpenAPI-first: all API contracts defined in `lib/api-spec/openapi.yaml`; never hand-write types the codegen produces
- Bathroom aggregate stats (avgRating, avgCleanliness, etc.) are computed via SQL aggregates at query time, not stored columns
- Combined filters use Drizzle `and(...)` to avoid chained `.where()` overwriting previous conditions
- `/bathrooms/top` route is declared before `/:id` to prevent Express from swallowing it as an id param

## Product

- **Home** (`/`): Hero + live stats (total bathrooms, total reviews, campus avg rating), top-rated bathrooms, recent reviews
- **Browse** (`/bathrooms`): Filter by building and gender; search across all bathrooms
- **Detail** (`/bathrooms/:id`): Full stats breakdown + all reviews + inline submit-review form
- **Submit** (`/submit`): Add a new bathroom not yet listed

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any OpenAPI spec change, always run `pnpm --filter @workspace/api-spec run codegen` before editing routes or frontend
- After changing `lib/*` packages, run `pnpm run typecheck:libs` to rebuild declarations before leaf typechecks
- `/bathrooms/top` must stay above `/:id` in the Express router

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
