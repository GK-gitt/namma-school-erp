# SchoolSetu — Bangalore School ERP

A secure, reliable, role-based School ERP (Enterprise Resource Planning) web app
for schools in Bangalore/India, with ideas borrowed from US school systems.

> **Status:** v1 (MVP) — Students, Classes, Attendance, Fees, with role-based
> dashboards for Admin / Teacher / Parent / Student.

---

## What it does

| Role | Can do |
|------|--------|
| **Admin** | Manage students, classes, fee structures, record payments; see all stats |
| **Teacher** | Mark attendance for their class; view their students |
| **Parent** | View their own child's attendance & fees (read-only) |
| **Student** | View their own attendance & fees (read-only) |

India-specific: ₹ (INR) currency, CBSE context, academic year Jun–Apr,
admission numbers, guardian details, Indian mobile validation.

---

## Tech Stack

- **Next.js 15** (App Router, TypeScript) — UI + backend in one framework
- **PostgreSQL** (via **Neon**, managed) + **Prisma** ORM
- **Auth.js (NextAuth v5)** + **bcrypt** — secure login, hashed passwords
- **Tailwind CSS** — styling
- **Zod** — input validation
- Hosted on **Vercel**, source on **GitHub**

See [`docs/02-architecture-and-budget.md`](docs/02-architecture-and-budget.md)
for the full design and cost breakdown.

---

## Security highlights

- Passwords hashed with bcrypt (never stored as plain text)
- Role-based access control (RBAC) enforced on the **server** for every action
- A parent can only ever read their own child's data
- HTTPS enforced + security headers (HSTS, X-Frame-Options, etc.)
- All input validated with Zod; SQL injection prevented by Prisma

---

## Run it locally

> Prerequisites: Node.js 18+ and a PostgreSQL database URL (free from Neon).

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
#    then edit .env and paste your Neon DATABASE_URL
#    and generate AUTH_SECRET with:  openssl rand -base64 32

# 3. Create the database tables
npm run db:push

# 4. Fill with demo data
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open http://localhost:3000 and log in:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.edu | Admin@123 |
| Teacher | teacher@school.edu | Teacher@123 |
| Parent | parent@school.edu | Parent@123 |

---

## Deploy to production

See the step-by-step guide: [`docs/03-deployment-guide.md`](docs/03-deployment-guide.md)

Short version: create a Neon DB → push this repo to GitHub → import into Vercel →
set env vars → deploy. Free tier covers development and a single small school.

---

## Health check

`GET /api/health` returns `200` when the app + database are healthy, `503` otherwise.
Point an uptime monitor at it.

---

## Project structure

```
docs/                       Business + architecture + deployment docs
prisma/
  schema.prisma             Database tables & relationships
  seed.ts                   Demo data
src/
  app/                      Pages (UI) + API routes + server actions
    dashboard/              The authenticated app (role-based)
    login/                  Login page
    api/health/             Health check endpoint
  components/ui.tsx         Reusable UI pieces
  lib/                      auth, prisma, rbac, validation, formatting
  middleware.ts             Route protection
```
