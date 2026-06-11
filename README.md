# JobTracker AI

SaaS for tracking job applications — built over **10 days** (1 commit/day).

Track every role from wishlist to offer: status pipeline, quick updates, filters, and a stats dashboard — behind email/password auth.

## Features

- **Auth** — email/password sign up & sign in (Auth.js v5, JWT sessions)
- **Applications CRUD** — create, edit, delete roles with company, salary, notes
- **Status workflow** — wishlist → applied → screening → interview → offer, with quick inline updates
- **Filters** — filter the list by any status via URL params
- **Dashboard** — totals, pipeline breakdown, recent activity
- **Settings** — update display name, change password

## Stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js 15 (App Router, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Auth | Auth.js (next-auth v5) |
| Validation | Zod |

## Project structure

```
src/
├── app/
│   ├── (marketing)/     # Public pages
│   ├── (auth)/          # Login & register (Day 3)
│   ├── (dashboard)/     # Protected app (Day 4+)
│   └── api/             # Route handlers (Day 3+)
├── components/
│   ├── ui/              # Buttons, inputs, cards
│   ├── layout/          # Headers, sidebar
│   ├── auth/            # Auth forms
│   └── dashboard/       # Dashboard widgets
├── config/              # Site & app configuration
├── lib/                 # Shared utilities (db, auth helpers)
├── server/
│   ├── actions/         # Server Actions
│   └── services/        # Data / business logic
├── types/               # Shared TypeScript types
└── validations/         # Zod schemas
prisma/
├── schema.prisma        # Database models
└── migrations/          # SQL migrations
```

## Getting started

```bash
npm install
cp .env.example .env
# Set DATABASE_URL, AUTH_SECRET, AUTH_URL in .env
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon, Supabase, or local) |
| `AUTH_SECRET` | Yes | Session secret — generate with `openssl rand -base64 32` |
| `AUTH_URL` | Yes | App URL (`http://localhost:3000` locally) |
| `NEXT_PUBLIC_APP_URL` | No | Public URL used in site metadata |

### Demo account

After `npm run db:seed`: **demo@jobtracker.ai** / **password123** (3 sample applications).

### Database commands

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Apply migrations (development) |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:push` | Push schema without migration files |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed demo user + sample applications |

## Build roadmap (10 days · 1 commit/day)

| Day | Focus | Commit message (example) |
|-----|--------|---------------------------|
| 1 | ✅ Project init & structure | `chore: initialize jobtracker-ai project` |
| 2 | ✅ Prisma + PostgreSQL schema | `feat(db): add schema and initial migration` |
| 3 | ✅ Auth.js + sign up / sign in | `feat(auth): add auth and credentials flow` |
| 4 | ✅ Landing polish + dashboard shell | `feat: add landing page and dashboard layout` |
| 5 | ✅ Dashboard stats + applications list | `feat(dashboard): add overview and applications list` |
| 6 | ✅ Create & edit applications | `feat(applications): add create and edit flows` |
| 7 | ✅ Delete, status updates & filters | `feat(applications): add delete and status workflow` |
| 8 | ✅ Settings & profile | `feat(settings): add profile settings page` |
| 9 | ✅ Production prep (build, docs, polish) | `chore: prepare for production deployment` |
| 10 | Deploy to Vercel | `chore: deploy to vercel` |

**Compressed from 14 days:** auth (3+4), layout (5+6), list+stats (7+8), CRUD split (9–11 → 6–7), ship (13–14 → 9–10).

## Deployment (Vercel)

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com/new).
2. Provision PostgreSQL (e.g. [Neon](https://neon.tech)) and copy the connection string.
3. Set environment variables in Vercel:
   - `DATABASE_URL` — your production Postgres URL
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `AUTH_URL` — your production URL (e.g. `https://jobtracker-ai.vercel.app`)
4. Deploy. The build runs `prisma generate` automatically.
5. Apply migrations against production:

```bash
DATABASE_URL="<production-url>" npx prisma migrate deploy
```

## License

MIT
