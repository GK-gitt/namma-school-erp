// ───────────────────────────────────────────────────────────────
// Seed script — fills the database with realistic demo data so the
// app isn't empty on first run. Run with:  npm run db:seed
//
// Creates: 1 admin, 1 teacher, 1 parent + student login, 2 classes,
// several students, a fee structure, some payments and attendance.
// ───────────────────────────────────────────────────────────────
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  const hash = (p: string) => bcrypt.hashSync(p, 10);

  // ── Users ──────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@school.edu" },
    update: {},
    create: {
      email: "admin@school.edu",
      passwordHash: hash("Admin@123"),
      name: "Priya Sharma (Admin)",
      role: "ADMIN",
      phone: "9880012345",
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
    },
  });

  // ── Classes ────────────────────────────────────────────
  const class5A = await prisma.schoolClass.upsert({
    where: {
      name_section_academicYear: {
        name: "Class 5",
        section: "A",
        academicYear: "2025-2026",
      },
    },
    update: {},
    create: {
      name: "Class 5",
      section: "A",
      academicYear: "2025-2026",
      classTeacherId: teacher.id,
    },
  });

  const class6B = await prisma.schoolClass.upsert({
    where: {
      name_section_academicYear: {
        name: "Class 6",
        section: "B",
        academicYear: "2025-2026",
      },
    },
    update: {},
    create: { name: "Class 6", section: "B", academicYear: "2025-2026" },
  });

  // ── Students ───────────────────────────────────────────
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
      where: { admissionNo: s.admissionNo },
      update: {},
      create: {
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

  // ── Fee structures ─────────────────────────────────────
  for (const cls of [class5A, class6B]) {
    const exists = await prisma.feeStructure.findFirst({
      where: { classId: cls.id },
    });
    if (!exists) {
      await prisma.feeStructure.createMany({
        data: [
          {
            title: "Term 1 Tuition",
            amount: 25000,
            dueDate: new Date("2025-07-15"),
            academicYear: "2025-2026",
            classId: cls.id,
          },
          {
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

  // ── A sample payment for Aarav ─────────────────────────
  const aarav = createdStudents[0];
  const hasPayment = await prisma.feePayment.findFirst({
    where: { studentId: aarav.id },
  });
  if (!hasPayment) {
    await prisma.feePayment.create({
      data: {
        studentId: aarav.id,
        amount: 25000,
        mode: "UPI",
        receiptNo: "RCPT-SEED-001",
      },
    });
  }

  // ── A few attendance records ───────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const student of createdStudents.filter(
    (s) => s.classId === class5A.id,
  )) {
    await prisma.attendance.upsert({
      where: { studentId_date: { studentId: student.id, date: today } },
      update: {},
      create: {
        studentId: student.id,
        date: today,
        status: "PRESENT",
        classId: class5A.id,
        markedById: teacher.id,
      },
    });
  }

  console.log("✅ Seed complete.");
  console.log("   Admin:   admin@school.edu / Admin@123");
  console.log("   Teacher: teacher@school.edu / Teacher@123");
  console.log("   Parent:  parent@school.edu / Parent@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
