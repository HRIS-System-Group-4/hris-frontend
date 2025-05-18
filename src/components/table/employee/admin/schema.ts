import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const EmployeeSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional(),
  jobTitle: z.string(),
  grade: z.string(),
  branch: z.string(),
  status: z.enum(["active", "inactive"]),
  email: z.string(),
  phone: z.string(),
  startDate: z.string(),  
  department: z.string(),
});

export type Employee = z.infer<typeof EmployeeSchema>;