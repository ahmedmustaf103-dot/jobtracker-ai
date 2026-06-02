# JobTracker AI

SaaS for tracking job applications — built over **14 days** (1 commit/day).

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- PostgreSQL + Prisma *(Day 2)*
- Auth.js *(Day 3–4)*

## Project structure

```
src/
├── app/
│   ├── (marketing)/     # Public pages
│   ├── (auth)/          # Login & register (Day 4)
│   ├── (dashboard)/     # Protected app (Day 6+)
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
```

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build roadmap

| Day | Focus |
|-----|--------|
| 1 | ✅ Project init & structure |
| 2 | Prisma + PostgreSQL schema |
| 3 | Auth.js setup |
| 4 | Sign up / sign in |
| 5 | Landing page polish |
| 6 | Dashboard shell |
| 7 | Dashboard stats + seed |
| 8 | Applications list |
| 9 | Create application |
| 10 | Edit application |
| 11 | Delete & status updates |
| 12 | Settings |
| 13 | Production prep |
| 14 | Deploy |

## License

MIT
