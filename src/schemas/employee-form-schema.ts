import { z } from "zod"

// Define the letter attachment schema
export const letterSchema = z.object({
  name: z.string(),
  file: z.any().optional(),
})

// Define the employee schema
export const employeeSchema = z.object({
  nik: z.string().min(1, "NIK is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
  }),
  phoneNumber: z.string().min(1, "Phone number is required"),
  birthPlace: z.string().min(1, "Birth place is required"),
  birthDate: z.date({
    required_error: "Birth date is required",
  }),
  branch: z.string().min(1, "Branch is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  grade: z.string().min(1, "Grade is required"),
  department: z.string().min(1, "Department is required"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["active", "inactive", "pending", "suspended"], {
    required_error: "Status is required",
  }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  address: z.string().min(1, "Address is required"),
  avatar: z.any().optional(),
  // Make letters an optional array that defaults to an empty array when undefined
  letters: z.array(letterSchema).optional().default([]),
  // Add checkClockSetting as an optional string
  checkClockSetting: z.string().optional(),
})

// Export the type
export type EmployeeFormValues = z.infer<typeof employeeSchema>
