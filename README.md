# JobTracker AI

SaaS for tracking job applications — built over **10 days** (1 commit/day).

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- PostgreSQL + Prisma *(Day 2)*
- Auth.js *(Day 3)*

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
| 9 | Production prep (build, docs, polish) | `chore: prepare for production deployment` |
| 10 | Deploy to Vercel | `chore: deploy to vercel` |

**Compressed from 14 days:** auth (3+4), layout (5+6), list+stats (7+8), CRUD split (9–11 → 6–7), ship (13–14 → 9–10).

## License

MIT
