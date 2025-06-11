import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const BranchSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  status: z.enum(["active", "inactive"]),
});

export type Branch = z.infer<typeof BranchSchema>;