# SFC Capital

A market-intelligence platform for the Egyptian Exchange: live-feel quotes,
analyst recommendations, news, portfolio tools, subscriptions, support
tickets, and an admin panel — built with Next.js 16, TypeScript, Tailwind
CSS v4, Drizzle ORM (Postgres), and Auth.js.

## What's included

- **Public site**: home, markets, stock detail (with chart, watchlist, price
  alerts), news, recommendations, analysis, calculators (P&L, position
  sizing, compound growth, dividend yield), packages/pricing, about, contact.
- **Auth**: email/password sign-up and login (Auth.js credentials provider),
  with role-based access control (`CUSTOMER`, `SUPPORT`, `ANALYST`, `ADMIN`).
- **Customer dashboard**: overview, watchlist, portfolio (with live P&L),
  price alerts, subscription management, support ticket threads.
- **Admin panel**: news CRUD, recommendations CRUD (with status/close and
  update notes), user management (role + active status), site settings,
  support ticket triage.
- **Bilingual** EN/AR UI with RTL layout support (`lib/i18n`).
- **Swappable service adapters** for market data, payments, and CRM
  (`services/`) — each ships with a working mock implementation and a single
  place to plug in a real provider later.
- **Docker-ready**: `Dockerfile` using Next.js `standalone` output, tested
  end-to-end (build, migrate, seed, login, RBAC) against a real Postgres
  instance in this environment before being handed off.

## Getting started (local)

Requires a Postgres database — either a local one or a free one from
[Neon](https://neon.tech) or [Supabase](https://supabase.com).

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL and AUTH_SECRET
npm run db:migrate      # applies the schema
npm run db:seed         # loads demo stocks, news, recommendations, packages, users
npm run dev
```

Visit http://localhost:3000.

### Demo accounts

All demo accounts use the password `Password123!`:

| Email | Role |
|---|---|
| admin@sfccapital.com | ADMIN |
| analyst@sfccapital.com | ANALYST |
| customer@sfccapital.com | CUSTOMER |

## Deploying for free

See **[DEPLOY.md](./DEPLOY.md)** for a full, tested walkthrough: Neon
(free Postgres) + Google Cloud Run (free tier), including exact `gcloud`
commands, secret setup, and a note on the `trustHost` fix Cloud Run needs.

## Architecture notes

- **Database**: Postgres via Drizzle ORM (`postgres-js` driver). The schema
  (`db/schema.ts`) uses plain, portable column types.
- **Auth**: `auth.config.ts` holds the edge-safe session/JWT config (with
  `trustHost: true`, required behind reverse proxies like Cloud Run) used by
  `middleware.ts`; `auth.ts` extends it with the credentials provider (which
  needs the database and `bcryptjs`, so it can't run on the edge runtime).
- **Market data / payments / CRM**: each lives behind an interface in
  `services/*/index.ts` with a `Mock*Provider` as the default implementation.
  Set the relevant environment variables and swap in a real adapter behind
  the same interface — no calling code needs to change.

## What's mocked / simplified (by design)

- **Market data** is a deterministic pseudo-random walk seeded from stored
  prices — not a live feed. Swap in a real provider via
  `services/market-data/index.ts`.
- **Payments** always succeed instantly (`services/payments`). Swap in a
  real gateway (Paymob, Fawry, Stripe, etc.) using the same `charge()`
  interface.
- **CRM** just logs leads to the console (`services/crm`). Swap in a real
  HubSpot/Zoho adapter using the same `pushLead()` interface.
- **Notifications** (email/WhatsApp) are not wired up — `EMAIL_API_KEY` and
  `WHATSAPP_API_KEY` are present in `.env.example` as placeholders for a
  future integration.
- **Image uploads** aren't implemented; cover images / logos are plain URL
  fields in the schema.
- Automated tests are not included — this was prioritized as a broad,
  functional build over full test coverage.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (also used by the Dockerfile) |
| `npm run start` | Run the production build locally |
| `npm run db:generate` | Generate a new Drizzle migration from schema changes |
| `npm run db:migrate` | Apply migrations to the database in `DATABASE_URL` |
| `npm run db:seed` | Seed demo data (safe to re-run against a fresh db) |

## Environment variables

See `.env.example`. `DATABASE_URL` and `AUTH_SECRET` are required to run at
all; everything else falls back to the mock adapters when left empty.
