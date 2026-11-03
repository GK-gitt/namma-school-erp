# Multi-Tenancy Design — Making Namma School ERP a SaaS
## How many schools share one app, safely

> **What is this?** The plan to turn the single-school app into a true
> multi-school SaaS, where each school's data is completely isolated from every
> other school. This is the most important architectural decision for the
> product, so it's written down carefully.

---

## 1. The model: Shared database, row-level tenancy

- **One app, one database** serves ALL schools (cheapest, scales to thousands).
- Every tenant (school) is a row in a **`School`** table.
- Every data record carries a **`schoolId`** pointing to its school.
- Every query is **automatically filtered by the current user's `schoolId`**.

Why this model (not DB-per-school): it's the standard for SaaS at this stage —
simple, cost-effective, and scales fine. We can migrate a huge client to an
isolated DB later if ever needed, without rewriting the app.

---

## 2. Roles — now with a SaaS owner on top

| Role | Scope | Who |
|------|-------|-----|
| **SUPER_ADMIN** | ALL schools | You — the SaaS owner. Onboards schools, sees platform stats. |
| **ADMIN** | One school | A school's principal/office. Manages that school only. |
| **TEACHER** | One school | Teaches within their school. |
| **PARENT / STUDENT** | One school | Sees their own child/self within their school. |

Every user except SUPER_ADMIN belongs to exactly **one** `schoolId`.

---

## 3. The golden rule of isolation

> A user from School A must NEVER see School B's data — not by accident, not by
> editing a URL, not ever.

Enforced by:
1. `schoolId` stored in the user's session (set at login).
2. A central **tenant guard** that injects `where: { schoolId }` into every
   query — so an individual query can't "forget" to filter.
3. Server-side checks (never trust the browser).
4. Unique constraints scoped per-school (e.g. admission numbers unique *within*
   a school, not globally).

---

## 4. What changes in the schema

- New **`School`** model (the tenant): name, branding, subdomain/slug, plan.
- Add `schoolId` (relation to School) to: `User`, `SchoolClass`, `Student`,
  `Attendance`, `FeeStructure`, `FeePayment`, and move `SchoolSettings` fields
  into `School`.
- Unique constraints become composite with `schoolId`
  (e.g. `@@unique([schoolId, admissionNo])`).

---

## 5. How a school signs up (onboarding flow)

1. SUPER_ADMIN (or a public signup) creates a **School** + its first ADMIN user.
2. That ADMIN logs in → sees only their school → sets up classes, students, etc.
3. Each school can later get its own subdomain (e.g. `dps.nammaschool.app`) or a
   school-picker — a future enhancement.

---

## 6. Billing (SaaS revenue) — future

- Each `School` has a `plan` (FREE / PRO) and optional `trialEndsAt`.
- Gate premium features by plan.
- Integrate subscription billing later (Razorpay subscriptions / Stripe).

---

## 7. Migration note

Because we already deployed a single-school version, converting to multi-tenant
is a schema change. On our demo DB (no real data) this is safe. The seed will
create one demo **School** ("Namma Demo School") and put all existing demo data
under it, plus a SUPER_ADMIN account for the platform owner.
