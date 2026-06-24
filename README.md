# JobTracker AI

**Live demo:** [https://jobtracker-ai-tau.vercel.app](https://jobtracker-ai-tau.vercel.app)

SaaS for tracking job applications — with AI cover letters and resume analysis.

Track every role from wishlist to offer: status pipeline, quick updates, filters, a stats dashboard, and AI tools to sharpen your applications.

### Try it now

| | |
|---|---|
| **Demo login** | `demo@jobtracker.ai` / `password123` |
| **Or** | [Create a free account](https://jobtracker-ai-tau.vercel.app/register) |

> **Note:** Resume file upload works locally only. Cover letters, application tracking, and the dashboard work on the live demo.

## Features

- **Auth** — email/password sign up & sign in (Auth.js v5, JWT sessions)
- **Applications CRUD** — create, edit, delete roles with company, salary, notes
- **Status workflow** — wishlist → applied → screening → interview → offer, with quick inline updates
- **Filters** — filter the list by any status via URL params
- **Dashboard** — totals, pipeline breakdown, recent activity, onboarding for new users
- **Settings** — update display name, change password
- **AI cover letters** — generate tailored cover letters with **Gemini 2.5 Flash** (Google AI Studio free tier)
- **AI resume analyzer** — upload PDF/DOCX for ATS score, strengths, weaknesses, and keyword tips (OpenAI)

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
| AI (cover letters) | Google Gemini 2.5 Flash |
| AI (resume) | OpenAI API |

## Project structure

```
src/
├── app/
│   ├── (marketing)/     # Public landing page
│   ├── (auth)/          # Login & register
│   ├── (dashboard)/     # Protected app (dashboard, applications, AI tools)
│   └── api/             # Route handlers (e.g. POST /api/cover-letters/generate)
├── components/
│   ├── ui/              # Buttons, inputs, cards, confirm dialog
│   ├── layout/          # Headers, sidebar, mobile shell
│   ├── marketing/       # Landing page sections
│   ├── cover-letters/   # Cover letter generator UI
│   └── resume-analyzer/ # Resume upload & analysis UI
├── lib/                 # Shared utilities (db, auth, gemini, openai, rate-limit)
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
# Set DATABASE_URL, AUTH_SECRET, AUTH_URL, GEMINI_API_KEY (and OPENAI_API_KEY for resume analyzer) in .env
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
| `GEMINI_API_KEY` | Cover letters | API key from [Google AI Studio](https://aistudio.google.com/apikey) (free tier) |
| `GEMINI_MODEL` | No | Gemini model override (defaults to `gemini-2.5-flash`) |
| `OPENAI_API_KEY` | Resume analyzer | OpenAI API key for resume analysis |
| `OPENAI_MODEL` | No | OpenAI model override (defaults to `gpt-4o-mini`) |
| `NEXT_PUBLIC_APP_URL` | No | Public URL used in site metadata |

### Cover letter API

Authenticated users can also generate via HTTP:

```bash
POST /api/cover-letters/generate
Content-Type: application/json

{
  "company": "Northwind Labs",
  "role": "Senior Frontend Engineer",
  "jobDescription": "Paste the full job description here..."
}
```

Returns `{ "content": "..." }` or `{ "error": "..." }`. Requires a signed-in session cookie.

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

### Tests

```bash
npm test
```

Unit tests cover validation schemas and the in-memory rate limiter.

## Deployment (Vercel)

**Production:** [https://jobtracker-ai-tau.vercel.app](https://jobtracker-ai-tau.vercel.app)

Hosted on Vercel with Neon PostgreSQL. Migrations run automatically during build (`prisma migrate deploy`).

To redeploy after pushing to GitHub:

```bash
git push origin main   # if Git integration is connected
# or
npx vercel deploy --prod
```

### Manual setup (first time)

1. Push the repo to GitHub and import it in [Vercel](https://vercel.com/new).
2. Provision PostgreSQL (e.g. [Neon](https://neon.tech)) and copy the **pooled** connection string.
3. Set environment variables in Vercel:
   - `DATABASE_URL` — Neon pooled Postgres URL
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `AUTH_URL` — your production URL (e.g. `https://jobtracker-ai-tau.vercel.app`)
   - `NEXT_PUBLIC_APP_URL` — same as `AUTH_URL`
   - `GEMINI_API_KEY` — from [Google AI Studio](https://aistudio.google.com/apikey) (cover letters)
   - `OPENAI_API_KEY` — for resume analyzer (optional if you disable that feature)
4. Deploy. Build runs `prisma generate`, `prisma migrate deploy`, and `next build`.
5. Seed the demo account (optional):

```bash
DATABASE_URL="<production-url>" npm run db:seed
```

### Resume uploads on Vercel

The resume analyzer stores uploaded files on the local filesystem (`storage/uploads/resumes/`). This works locally but **does not persist on Vercel's serverless runtime**. Cover letters and the rest of the app work fine in production; resume file storage requires cloud storage (e.g. S3, Vercel Blob) for full production support.

## License

MIT
