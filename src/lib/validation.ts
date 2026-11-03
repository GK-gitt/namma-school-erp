// ───────────────────────────────────────────────────────────────
// Input validation with Zod.
//
// RULE: never trust data coming from the browser. Every form input is
// checked here before it reaches the database. This prevents bad/malicious
// data and gives users clear error messages.
// ───────────────────────────────────────────────────────────────
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const studentSchema = z.object({
  admissionNo: z.string().min(1, "Admission number is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  bloodGroup: z.string().optional(),
  guardianName: z.string().min(1, "Guardian name is required"),
  guardianPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  address: z.string().optional(),
  classId: z.string().optional(),
});

export const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  section: z.string().min(1, "Section is required"),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, "Use format like 2025-2026"),
  classTeacherId: z.string().optional(),
});

export const feeStructureSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  dueDate: z.string().min(1, "Due date is required"),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, "Use format like 2025-2026"),
  classId: z.string().min(1, "Class is required"),
});

export const feePaymentSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  mode: z.enum(["CASH", "UPI", "CARD", "NETBANKING", "CHEQUE"]),
  note: z.string().optional(),
});

export const attendanceSchema = z.object({
  classId: z.string().min(1),
  date: z.string().min(1),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "LEAVE"]),
    }),
  ),
});

export type StudentInput = z.infer<typeof studentSchema>;
export type ClassInput = z.infer<typeof classSchema>;
export type FeeStructureInput = z.infer<typeof feeStructureSchema>;
export type FeePaymentInput = z.infer<typeof feePaymentSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
