import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

const EmployeeSchema = z.object({
  avatar: z.string().url(),
  firstName: z.string(),
  lastName: z.string(),
});

const WorkHoursSchema = z
  .object({
    hours: z.number().int().min(0),
    minutes: z.number().int().min(0).max(59),
  })
  .nullable();

export const AttendanceAdminSchema = z.object({
  id: z.number(),
  employee: EmployeeSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // format YYYY-MM-DD
  clockIn: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  clockOut: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  workHours: WorkHoursSchema,
  attendanceType: z.enum(["ontime", "annual leave", "late", "sick leave", "absent"]),
  approval: z.enum(["approve", "rejected", "waiting"]).nullable(),
});

export type AttendanceAdmin = z.infer<typeof AttendanceAdminSchema>;