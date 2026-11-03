# Architecture & Budget
## Project: SchoolSetu — Bangalore School ERP

> **What is this document?**
> This records *how* we build it and *what it costs* — the technical blueprint
> and the money. Think of it as an Architecture Decision Record (ADR): if anyone
> later asks "why Postgres and not MongoDB?", the answer is written here.

---

## 1. Guiding Principles

We optimize for, in this order:
1. **Security** — it holds children's and parents' personal data. Non-negotiable.
2. **Reliability / High Availability** — school staff depend on it daily.
3. **Low cost** — start at ₹0; pay only when a real school scales up.
4. **Maintainability** — one person should be able to understand and run it.

---

## 2. System Architecture

```
 BROWSER  ──HTTPS──▶  VERCEL (Next.js app + API)  ──▶  NEON (PostgreSQL)
   ▲                        │          │
   │                        │          └─▶ Sentry (error monitoring)
   └── Auth.js sessions ◀───┘
                    ▲
             GITHUB (source of truth, triggers auto-deploy)
```

- **Frontend (UI):** Next.js pages rendered for the browser.
- **Backend (API):** Next.js server actions / API routes — all business logic & DB access.
- **Database:** Neon managed PostgreSQL, accessed via Prisma ORM.
- **Auth:** Auth.js (NextAuth) with hashed passwords (bcrypt) and secure cookies.
- **Hosting:** Vercel — global edge network, auto-scaling, automatic HTTPS.
- **CI/CD:** GitHub push → Vercel builds & deploys → rollback available instantly.
- **Monitoring:** Vercel Analytics (traffic/perf) + Sentry (errors) + a /health endpoint.

---

## 3. Technology Choices & Rationale

| Layer | Technology | Why chosen |
|-------|-----------|------------|
| Language | TypeScript | Type safety catches bugs before production. |
| Framework | Next.js 15 (App Router) | Full-stack, industry standard, great DX, free to host. |
| UI | Tailwind CSS + shadcn/ui | Fast, consistent, accessible components. |
| ORM | Prisma | Type-safe DB access; prevents SQL injection by design. |
| Database | PostgreSQL (Neon) | Reliable, relational (ideal for school data), managed, auto-backup. |
| Auth | Auth.js (NextAuth) | Battle-tested; handles sessions/security correctly. |
| Validation | Zod | Validates all input — never trust client data. |
| Hosting | Vercel | HA by default, auto-scale, zero server ops. |
| Repo/CI | GitHub + Vercel integration | Versioning + automatic, rollback-able deploys. |
| Errors | Sentry | See crashes in real time with stack traces. |

---

## 4. Security Design (Defense in Depth)

- **Transport:** HTTPS everywhere (enforced by Vercel).
- **Passwords:** Hashed with bcrypt — plaintext is never stored.
- **Sessions:** HTTP-only, encrypted cookies — not readable by JavaScript.
- **Authorization (RBAC):** Every server action checks the user's role AND that
  they own the data (a parent can only read their own child). Enforced on the
  server, never trusting the browser.
- **Input validation:** All inputs validated with Zod before touching the DB.
- **SQL injection:** Prevented by Prisma's parameterized queries.
- **Secrets:** Stored as environment variables in Vercel/Neon — never in the repo.
- **Dependencies:** Kept updated; `npm audit` in CI.

---

## 5. High Availability & Reliability

- **No single server to crash:** Vercel runs the app across a global edge network.
- **Database:** Neon is managed with automated backups + point-in-time recovery.
- **Deploys:** Every deploy is immutable and versioned; one-click rollback.
- **Health endpoint:** `/api/health` returns app + DB status for uptime monitors.
- **Graceful degradation:** Clear error pages instead of blank crashes.

---

## 6. Budget

> Start at **₹0/month**. Everything below runs on free tiers for development and
> a single small school.

| Service | Free tier | Paid (if scaling) |
|---------|-----------|-------------------|
| Vercel (hosting) | Hobby — free | Pro ~$20/mo (~₹1,700) |
| Neon (database) | Free — 0.5 GB | ~$19/mo (~₹1,600) |
| GitHub (repo) | Free | — |
| Sentry (errors) | Free — 5k errors/mo | ~$26/mo |
| Custom domain (optional) | — | ~₹800/year |

**Dev/demo:** ₹0/month. **One real school:** likely ₹0, up to ~₹1,700/mo if busy.
Only likely early spend: a custom domain for a professional URL.

---

## 7. External Accounts Needed (require the owner's signup/login)

| Step | Service | Cost | Who does it |
|------|---------|------|-------------|
| Store code | GitHub | Free | Owner authorizes; agent pushes |
| Database | Neon | Free | Owner signs up; agent configures |
| Hosting | Vercel | Free | Owner signs up; agent configures |
| (Optional) Errors | Sentry | Free | Owner signs up later |

Everything else (code, schema, config, security) is handled by the agent.

---

*This is the technical source of truth. Code and infra must match this design.*
