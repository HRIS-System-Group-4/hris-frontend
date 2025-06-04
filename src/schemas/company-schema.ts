// src/schemas/company-schema.ts
import * as z from "zod"

export const companyInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyUsername: z.string().min(1, "Company username is required"),
  id: z.string().optional(),
})

export const locationSchema = z.object({
  latitude: z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, 'Invalid latitude')
    .refine(val => val !== '', { message: "Latitude is required" }),
  longitude: z
    .string()
    .regex(/^-?\d+(\.\d+)?$/, 'Invalid longitude')
    .refine(val => val !== '', { message: "Longitude is required" }),
})

export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>
export type LocationFormData = z.infer<typeof locationSchema>
