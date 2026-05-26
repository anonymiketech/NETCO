# NETCO VPN Platform

A premium VPN config selling platform for Kenya — sells device-locked VPN configurations for HTTP Custom and HTTP Injector apps on Safaricom, Airtel, and Telkom networks, with M-Pesa payments.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port from $PORT)
- `pnpm --filter @workspace/netco run dev` — run the web frontend (port from $PORT)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session signing key
- Optional env: `VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — Supabase for config file storage
- Optional env: `RESEND_API_KEY` — Resend for transactional emails

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter routing, TailwindCSS v4, shadcn/ui components, Recharts
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/netco/` — React+Vite frontend (preview path `/`)
- `artifacts/api-server/` — Express API server (preview path `/api`)
- `lib/api-client-react/` — Generated React Query hooks (Orval output)
- `lib/api-zod/` — Generated Zod schemas (Orval output)
- `lib/api-spec/` — OpenAPI spec source of truth (`openapi.yaml`)
- `lib/db/` — Drizzle ORM schema + DB client
- `scripts/` — Utility scripts

## Architecture decisions

- **Contract-first API**: OpenAPI spec defined in `lib/api-spec/openapi.yaml`, hooks/schemas generated via Orval. Never edit generated files manually.
- **Device-locked configs**: All VPN configs are tied to a Device ID (HTTP Custom) or HWID (HTTP Injector) provided at checkout. Prevents sharing.
- **M-Pesa STK Push simulation**: Payment initiation sends a simulated STK push; auto-completes after 15 seconds for demo. Real PayFlow API integration is the next step.
- **No auth required**: Customers can purchase configs without an account. Plans are looked up by phone number or Device ID on the Dashboard/Check Expiry pages.
- **Express 5 return pattern**: All route handlers use explicit `return` before `res.json()` or call `res.json()` then `return` separately to satisfy TypeScript's "not all code paths return a value" rule.
- **Supabase optional**: File storage (config uploads/downloads) and auth emails are lazy-loaded — the server starts without Supabase/Resend credentials set.

## Product

- **Home**: Hero with stats (active users, servers, uptime)
- **Pricing**: Network tabs (Safaricom/Airtel/Telkom) → Category tabs → Duration (Daily/Weekly/Monthly) → Plan cards with M-Pesa checkout
- **Checkout**: 4-step flow — Plan Summary → App + Device ID → M-Pesa phone → Payment status (STK Push polling)
- **Dashboard**: Look up active/expired plans by phone or Device ID
- **Check Expiry**: Quick expiry checker with renewal CTA
- **How to Connect**: Step-by-step guide for HTTP Custom (.hc) and HTTP Injector (.ehi)
