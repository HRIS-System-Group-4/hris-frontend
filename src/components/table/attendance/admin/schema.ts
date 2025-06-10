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

export const AttendanceAdminSchema = z.object({
  id: z.string(),
  employee_name: z.string(),
  avatar: z.string(),
  // employee: EmployeeSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // format YYYY-MM-DD
  clock_in: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  clock_out: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  work_hours: WorkHoursSchema,
  attendance_type: z.enum(["On Time", "Annual Leave", "Late", "Sick Leave", "Absent"]),
  status: z.enum(["approved", "rejected", "waiting", "pending"]).nullable(),
  // startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  // endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
});

export type AttendanceAdmin = z.infer<typeof AttendanceAdminSchema>;