# Business Requirements Document (BRD)
## Project: Bangalore School ERP ("SchoolSetu")

> **What is this document?**
> Before writing any code, we write down *what* we're building and *why*.
> This is the "design doc" of the project — like an architecture diagram before
> you provision infrastructure. Everything we build later must trace back to a
> requirement here.

---

## 1. Problem Statement

Schools in Bangalore (and India broadly) still run on paper registers, Excel
sheets, and WhatsApp groups for critical operations:

- Attendance is marked on paper and lost / hard to analyze.
- Fees are tracked in ledgers; receipts are manual; defaulters are hard to find.
- Parents have no single place to see their child's attendance, marks, or fee dues.
- Admins spend hours on reports that software could generate in seconds.

**Goal:** A single web application that digitizes the core daily operations of a
school and gives each type of user exactly what they need.

---

## 2. Who Uses It? (User Roles / "Personas")

| Role | Who they are | What they do in the system |
|------|--------------|----------------------------|
| **Admin** | Principal / office staff | Manage students, classes, fees; see everything |
| **Teacher** | Class/subject teachers | Mark attendance, view their classes & students |
| **Parent** | Student's guardian | View their child's attendance, fees, profile |
| **Student** | (older students) | View own attendance, fees, profile |

> **Why roles matter:** Just like Linux file permissions or IAM roles in cloud,
> each user should only see and do what their role allows. A parent must never
> see another child's data. This is called **Role-Based Access Control (RBAC)**.

---

## 3. Scope — What v1 (MVP) Includes

> **MVP = Minimum Viable Product.** The smallest version that is genuinely useful.
> We ship this first, then grow. Trying to build everything at once is how
> projects die.

### IN SCOPE for v1:
1. **Authentication & Roles** — secure login; each user sees their own dashboard.
2. **Student Information** — add/edit/list students with their details.
3. **Classes & Sections** — e.g., "Class 5 - Section A"; assign students & teachers.
4. **Attendance** — teachers mark daily attendance; everyone can view it.
5. **Fee Management** — define fee structure, record payments, see who owes what.
6. **Dashboards** — a role-appropriate home screen for each user.

### OUT OF SCOPE for v1 (future phases):
- Exams & report cards
- Payroll / HR for staff
- Transport (bus tracking), Library, Hostel
- SMS / WhatsApp notifications
- Online fee payment gateway (Razorpay) — we record payments manually first
- Mobile app

---

## 4. India / Bangalore Specific Requirements

(These are what make it a *Bangalore* ERP, not a generic US one.)

- **Currency:** Indian Rupee (₹ / INR).
- **Grading context:** CBSE board assumed for v1 (most common in Bangalore).
- **Academic year:** Starts in **June**, ends in **April** (not Aug–May like the US).
- **Student fields:** Include fields common in India — e.g., Admission Number,
  Blood Group, Parent/Guardian name, and optional category for govt reports.
- **Fee model:** Term/installment-based (Indian schools rarely charge yearly in one go).

### Borrowed from US school systems (good ideas we adopt):
- Clean **parent portal** (US systems like PowerSchool do this well).
- **Attendance analytics** (percentage trends, not just raw marks).
- **Self-service** — parents/teachers do their own lookups instead of calling the office.

---

## 5. Core User Flows (How work actually happens)

### Flow A: Marking Attendance (Teacher)
1. Teacher logs in → sees their assigned classes.
2. Picks a class and today's date.
3. Sees the student list → marks each Present / Absent / Late.
4. Saves → data stored → parents can now see it.

### Flow B: Recording a Fee Payment (Admin)
1. Admin logs in → opens a student's fee page.
2. Sees fee structure and what's paid vs. pending.
3. Records a new payment (amount, date, mode) → a receipt record is created.
4. Pending balance updates automatically.

### Flow C: Parent Checks Their Child (Parent)
1. Parent logs in → sees their child's dashboard.
2. Views attendance %, recent fees, and profile — read-only.

---

## 6. Non-Functional Requirements (the "-ilities")

> These aren't features — they're *qualities* the system must have. As a DevOps
> person, these are your bread and butter.

- **Security:** Passwords hashed, RBAC enforced, no cross-tenant data leaks.
- **Reliability:** Should be available during school hours; auto-deploy with rollback.
- **Observability:** Logs, health checks, error tracking, uptime monitoring.
- **Maintainability:** Clean code, version controlled, documented.
- **Performance:** Pages load in under ~2 seconds for typical school size (≤2000 students).
- **Scalability:** Start free-tier; architecture allows growing to many schools later.

---

## 7. Success Criteria

v1 is "done" when:
- All 4 roles can log in and see a correct, role-appropriate dashboard.
- An admin can add a student and assign them to a class.
- A teacher can mark attendance and it persists.
- An admin can record a fee payment and the balance updates.
- The app is deployed to a public URL with monitoring in place.

---

## 8. Tech Stack Decision (and why)

| Need | Choice | Why (layman) |
|------|--------|--------------|
| Website + logic | **Next.js (React, TypeScript)** | One framework for both the pages and the backend logic. Industry standard. |
| Database | **PostgreSQL + Prisma** | A reliable, free, professional database. Prisma lets us talk to it safely. |
| Styling | **Tailwind CSS** | Build good-looking UI fast. |
| Hosting | **Vercel** | Push code → it goes live automatically. Free tier. |
| Code storage | **GitHub** | Backup + version history + triggers deployments. |
| Monitoring | **Vercel Analytics + health checks + Sentry (errors)** | Know if the app is healthy, like your Grafana/alerting. |

---

*This document is the source of truth. If we ever disagree on what to build,
we come back here.*
