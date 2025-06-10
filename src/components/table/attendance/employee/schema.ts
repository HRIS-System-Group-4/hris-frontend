
// src/components/table/attendance/schema.ts

import { z } from "zod";

const EmployeeSchema = z.object({
  avatar: z.string().url(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});
export interface AttendanceRecord {
  id: string; // ID unik untuk setiap record
  employee: z.infer<typeof EmployeeSchema>; // Data karyawan
  date: Date; // yyyy-mm-dd, contoh: "2025-06-08"
  clockIn?: string | null;  // jam masuk "08:00:00" atau null
  clockOut?: string | null; // jam keluar "17:00:00" atau null
  workHours?: { hours: number; minutes: number } | null; // {hours: 8, minutes: 0} atau null
  attendanceType: 'On Time' | 'Late' | 'Sick Leave' | 'Absent' | 'Annual Leave'; // sesuai BE
  approval?: 'approve' | 'rejected' | 'waiting' | null;
  startDate?: Date | null; // yyyy-mm-dd, contoh: "2025-06-01"
  endDate?: Date | null; // yyyy-mm-dd, contoh: "2025-06-30"
  branchName?: string | null; // nama cabang, contoh: "Jakarta"
  branchAddress?: string | null; // alamat cabang, contoh: "Jl. Sudirman No. 1, Jakarta"
  proofPath?: string | null; // path ke bukti kehadiran, contoh: "/uploads/proof.jpg"
}
