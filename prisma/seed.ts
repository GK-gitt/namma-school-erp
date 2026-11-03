// ───────────────────────────────────────────────────────────────
// Seed script (MULTI-TENANT) — fills the DB with demo data.
// Run automatically on each deploy (idempotent: safe to re-run).
//
// Creates:
//   • 1 SUPER_ADMIN (the SaaS platform owner — no school)
//   • 1 demo School ("Namma Demo School")
//   • Within that school: admin, teacher, parent, classes, students,
//     fee structures, a payment, and today's attendance.
// ───────────────────────────────────────────────────────────────
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database (multi-tenant)…");

  const hash = (p: string) => bcrypt.hashSync(p, 10);

  // ── SUPER_ADMIN (platform owner, no school) ────────────────
  await prisma.user.upsert({
    where: { email: "owner@nammaschool.app" },
    update: {},
    create: {
      email: "owner@nammaschool.app",
      passwordHash: hash("Owner@123"),
      name: "Platform Owner",
      role: "SUPER_ADMIN",
      schoolId: null,
    },
  });

  // ── Demo School (the tenant) ───────────────────────────────
  const school = await prisma.school.upsert({
    where: { slug: "namma-demo" },
    update: {},
    create: {
      slug: "namma-demo",
      name: "Namma Demo School",
      tagline: "One source of truth for the entire school",
      affiliation: "CBSE",
      academicYear: "2025-2026",
      city: "Bengaluru",
      state: "Karnataka",
      principalName: "Priya Sharma",
      phone: "9880012345",
      email: "office@nammademo.edu",
      upiId: "nammademo@okhdfcbank",
    },
  });
  const schoolId = school.id;

  // ── Users within the school ────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@school.edu" },
    update: {},
    create: {
      email: "admin@school.edu",
      passwordHash: hash("Admin@123"),
      name: "Priya Sharma (Admin)",
      role: "ADMIN",
      phone: "9880012345",
      schoolId,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@school.edu" },
    update: {},
    create: {
      email: "teacher@school.edu",
      passwordHash: hash("Teacher@123"),
      name: "Rajesh Kumar (Teacher)",
      role: "TEACHER",
      phone: "9880054321",
      schoolId,
    },
  });

  const parent = await prisma.user.upsert({
    where: { email: "parent@school.edu" },
    update: {},
    create: {
      email: "parent@school.edu",
      passwordHash: hash("Parent@123"),
      name: "Anil Reddy (Parent)",
      role: "PARENT",
      phone: "9880098765",
      schoolId,
    },
  });

  // ── Classes ────────────────────────────────────────────────
  const class5A = await prisma.schoolClass.upsert({
    where: {
      schoolId_name_section_academicYear: {
        schoolId,
        name: "Class 5",
        section: "A",
        academicYear: "2025-2026",
      },
    },
    update: {},
    create: {
      schoolId,
      name: "Class 5",
      section: "A",
      academicYear: "2025-2026",
      classTeacherId: teacher.id,
    },
  });

  const class6B = await prisma.schoolClass.upsert({
    where: {
      schoolId_name_section_academicYear: {
        schoolId,
        name: "Class 6",
        section: "B",
        academicYear: "2025-2026",
      },
    },
    update: {},
    create: {
      schoolId,
      name: "Class 6",
      section: "B",
      academicYear: "2025-2026",
    },
  });

  // ── Students ───────────────────────────────────────────────
  const studentsData = [
    {
      admissionNo: "ADM001",
      firstName: "Aarav",
      lastName: "Reddy",
      gender: "Male",
      guardianName: "Anil Reddy",
      guardianPhone: "9880098765",
      classId: class5A.id,
      parentId: parent.id,
    },
    {
      admissionNo: "ADM002",
      firstName: "Diya",
      lastName: "Nair",
      gender: "Female",
      guardianName: "Suresh Nair",
      guardianPhone: "9880011111",
      classId: class5A.id,
    },
    {
      admissionNo: "ADM003",
      firstName: "Vihaan",
      lastName: "Gowda",
      gender: "Male",
      guardianName: "Manju Gowda",
      guardianPhone: "9880022222",
      classId: class5A.id,
    },
    {
      admissionNo: "ADM004",
      firstName: "Ananya",
      lastName: "Iyer",
      gender: "Female",
      guardianName: "Lakshmi Iyer",
      guardianPhone: "9880033333",
      classId: class6B.id,
    },
    {
      admissionNo: "ADM005",
      firstName: "Arjun",
      lastName: "Shetty",
      gender: "Male",
      guardianName: "Deepak Shetty",
      guardianPhone: "9880044444",
      classId: class6B.id,
    },
  ];

  const createdStudents = [];
  for (const s of studentsData) {
    const student = await prisma.student.upsert({
      where: { schoolId_admissionNo: { schoolId, admissionNo: s.admissionNo } },
      update: {},
      create: {
        schoolId,
        admissionNo: s.admissionNo,
        firstName: s.firstName,
        lastName: s.lastName,
        dateOfBirth: new Date("2014-06-15"),
        gender: s.gender,
        bloodGroup: "O+",
        guardianName: s.guardianName,
        guardianPhone: s.guardianPhone,
        address: "Bengaluru, Karnataka",
        classId: s.classId,
        parentId: s.parentId ?? null,
      },
    });
    createdStudents.push(student);
  }

  // ── Fee structures ─────────────────────────────────────────
  for (const cls of [class5A, class6B]) {
    const exists = await prisma.feeStructure.findFirst({
      where: { classId: cls.id },
    });
    if (!exists) {
      await prisma.feeStructure.createMany({
        data: [
          {
            schoolId,
            title: "Term 1 Tuition",
            amount: 25000,
            dueDate: new Date("2025-07-15"),
            academicYear: "2025-2026",
            classId: cls.id,
          },
          {
            schoolId,
            title: "Term 2 Tuition",
            amount: 25000,
            dueDate: new Date("2025-11-15"),
            academicYear: "2025-2026",
            classId: cls.id,
          },
        ],
      });
    }
  }

  // ── A sample payment for Aarav ─────────────────────────────
  const aarav = createdStudents[0];
  const hasPayment = await prisma.feePayment.findFirst({
    where: { studentId: aarav.id },
  });
  if (!hasPayment) {
    await prisma.feePayment.create({
      data: {
        schoolId,
        studentId: aarav.id,
        amount: 25000,
        mode: "UPI",
        receiptNo: "RCPT-SEED-001",
      },
    });
  }

  // ── Today's attendance for Class 5A ────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const student of createdStudents.filter(
    (s) => s.classId === class5A.id,
  )) {
    await prisma.attendance.upsert({
      where: { studentId_date: { studentId: student.id, date: today } },
      update: {},
      create: {
        schoolId,
        studentId: student.id,
        date: today,
        status: "PRESENT",
        classId: class5A.id,
        markedById: teacher.id,
      },
    });
  }

  console.log("✅ Seed complete.");
  console.log(
    "   Platform owner: owner@nammaschool.app / Owner@123 (SUPER_ADMIN)",
  );
  console.log("   School admin:   admin@school.edu / Admin@123");
  console.log("   Teacher:        teacher@school.edu / Teacher@123");
  console.log("   Parent:         parent@school.edu / Parent@123");
  void admin;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
