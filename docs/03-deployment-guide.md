# Deployment Guide — Getting SchoolSetu Live
## Written for someone new to web development

> **Goal:** Take the code and make it a real website on the internet, with a
> database and monitoring. Everything here uses **free tiers** — ₹0 to start.
>
> **Why can't the AI do all of this directly?** Three services (Neon, Vercel)
> require logging into *your* account for security/billing reasons — only you can
> click "Authorize". The code is already written and pushed to GitHub; these are
> the final "plug it in" steps. Each takes ~2–5 minutes.

---

## The big picture (what we're connecting)

```
  Your code (GitHub)  ──▶  Vercel (runs the website)  ──▶  Neon (the database)
```

- **GitHub** already has your code.
- **Neon** will be the live database.
- **Vercel** will build and host the website, connecting the two.

Do the steps in this order: **Neon → Vercel**.

---

## STEP 1 — Create the database (Neon)  · ~3 min · Free

1. Go to **https://neon.tech** and click **Sign up** (use your GitHub account —
   easiest).
2. Click **Create Project**. Name it `schoolsetu`. Pick the region closest to
   India (e.g. **Singapore / ap-southeast-1**) for speed.
3. After it's created, Neon shows a **Connection String**. It looks like:
   ```
   postgresql://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **Copy that whole string** and keep it safe for Step 2. This is your
   `DATABASE_URL`. (Treat it like a password — it opens your database.)

> That's it for Neon. Backups and scaling are automatic. You never manage a server.

---

## STEP 2 — Deploy the website (Vercel)  · ~5 min · Free

1. Go to **https://vercel.com** and **Sign up** with your **GitHub** account.
2. Click **Add New… → Project**.
3. Vercel lists your GitHub repos. Find **schoolsetu-erp** and click **Import**.
4. Before clicking Deploy, open **Environment Variables** and add these three:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | *(paste the Neon string from Step 1)* |
   | `AUTH_SECRET` | *(a long random string — see below)* |
   | `NEXTAUTH_URL` | `https://schoolsetu-erp.vercel.app` *(your Vercel URL; you can update after first deploy)* |

   **To generate `AUTH_SECRET`**, run this on your computer (Mac/Linux terminal):
   ```
   openssl rand -base64 32
   ```
   …or just use any long random password-manager string. It encrypts login sessions.

5. Click **Deploy**. Vercel now runs `npm install` + `npm run build` on *its*
   servers (which have internet) and puts your site online. Takes ~2 minutes.

6. When done, you get a live URL like `https://schoolsetu-erp.vercel.app`.
   If it differs from what you set in `NEXTAUTH_URL`, update that env var
   (Settings → Environment Variables) and redeploy.

---

## STEP 3 — Set up the database tables & demo data  · ~2 min

The database exists but is empty. We need to create the tables and add demo
logins. Two options:

### Option A — from your own computer (recommended)
```bash
# in the project folder, with your Neon URL in .env
npm install
npm run db:push     # creates all the tables
npm run db:seed     # adds demo admin/teacher/parent + sample data
```

### Option B — using Neon's SQL editor
If you can't run commands locally, tell the AI assistant and it can generate a
plain SQL file you paste into Neon's web SQL editor. (Prisma's `db:push` is
easier, so try Option A first.)

---

## STEP 4 — Log in and verify  · ~1 min

Open your Vercel URL and log in with the seeded admin:

- **admin@school.edu** / **Admin@123**

Check each thing works:
- Admin dashboard shows student/class counts.
- Add a student, add a class.
- Log out, log in as **teacher@school.edu / Teacher@123** → mark attendance.
- Log in as **parent@school.edu / Parent@123** → see only Aarav's data.

> **Security note:** Change these demo passwords before any real use!

---

## STEP 5 — Monitoring & observability  · optional but recommended

You now have a live site. Here's how to know it's healthy:

1. **Health check:** visit `https://<your-url>/api/health` — should say
   `"status":"healthy"`. Put this URL into a free uptime monitor like
   **UptimeRobot** (https://uptimerobot.com) to get an email/SMS if the site
   ever goes down.
2. **Vercel Analytics:** in your Vercel project → **Analytics** tab — free
   traffic and performance data (page load times, visitor counts).
3. **Vercel Logs:** **Project → Logs** shows live request logs and any errors —
   like `tail -f` on a server.
4. **Error tracking (Sentry):** optional. Sign up free at https://sentry.io,
   and the AI can wire it in so you get a detailed alert (with the exact line of
   code) whenever the app throws an error.

---

## STEP 6 — Custom domain  · optional · ~₹800/year

Want `schoolsetu.in` instead of `...vercel.app`?
1. Buy a domain (e.g. from GoDaddy / Namecheap / BigRock).
2. In Vercel → **Project → Settings → Domains → Add**, enter your domain.
3. Vercel shows DNS records to add at your domain provider. Add them. Done —
   HTTPS is automatic and free.

---

## How updates work from now on (CI/CD)

This is the nice part: **you never manually deploy again.**

```
You (or the AI) change code  →  git push to GitHub  →  Vercel auto-builds & deploys
```

Every push to the `main` branch goes live automatically. Every deploy is saved,
so if something breaks you click **Rollback** in Vercel and you're back to the
previous version in seconds.

---

## Cost recap

| Service | Now | If you scale |
|---------|-----|--------------|
| Neon (DB) | Free | ~₹1,600/mo |
| Vercel (hosting) | Free | ~₹1,700/mo |
| GitHub | Free | — |
| Uptime/Sentry | Free | paid tiers exist |
| Domain | — | ~₹800/year |

**Total to go live: ₹0.** Only pay when a real school's usage grows.
