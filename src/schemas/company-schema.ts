import { z } from "zod"

export const companySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companyUsername: z.string().min(2, "Company username is required"),
})

export type CompanyFormData = z.infer<typeof companySchema>
