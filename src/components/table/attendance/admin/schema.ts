import { start } from "repl";
import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

const WorkHoursSchema = z
  .object({
    hours: z.number().int().min(0),
    minutes: z.number().int().min(0).max(59),
  })
  .nullable();

// export const AttendanceAdminSchema = z.object({
//   id: z.string(),
//   employee_name: z.string(),
//   avatar: z.string(),
//   // employee: EmployeeSchema,
//   date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // format YYYY-MM-DD
//   clock_in: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
//   clock_out: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
//   work_hours: WorkHoursSchema,
//   attendance_type: z.enum(["On Time", "Annual Leave", "Late", "Sick Leave", "Absent"]),
//   status: z.enum(["approved", "rejected", "waiting", "pending"]).nullable(),
//   startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
//   endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
// });

export interface AttendanceAdmin {
  id: string; // ID unik untuk setiap record
  avatar: string | null; // URL gambar avatar, contoh: "https://via.placeholder.com/150"
  employee_name: string; // Nama karyawan, contoh: "John Doe"
  email: string | null; // Nama karyawan, contoh: "John Doe"
  job_title: string | null; // Nama karyawan, contoh: "John Doe"
  grade: string | null; // Nama karyawan, contoh: "John Doe"
  date: Date; // yyyy-mm-dd, contoh: "2025-06-08"
  clock_in?: string | null;  // jam masuk "08:00:00" atau null
  clock_out?: string | null; // jam keluar "17:00:00" atau null
  work_hours?: { hours: number; minutes: number } | null; // {hours: 8, minutes: 0} atau null
  attendance_type: 'On Time' | 'Late' | 'Sick Leave' | 'Absent' | 'Annual Leave'; // sesuai BE
  status?: 'approve' | 'rejected' | 'waiting' | 'pending' | null;
  start_date?: Date | null; // yyyy-mm-dd, contoh: "2025-06-01"
  end_date?: Date | null; // yyyy-mm-dd, contoh: "2025-06-30"
  branch_name?: string | null; // nama cabang, contoh: "Jakarta"
  branch_address?: string | null; // alamat cabang, contoh: "Jl. Sudirman No. 1, Jakarta"
  proof_path?: string | null; // path ke bukti kehadiran, contoh: "/uploads/proof.jpg"
}

// export type AttendanceAdmin = z.infer<typeof AttendanceAdminSchema>;