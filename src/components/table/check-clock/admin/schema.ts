import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const CheckClockSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalEmployee: z.number(),
  type: z.enum(["wfo", "wfa", "hybrid"]),
});

export type CheckClock = z.infer<typeof CheckClockSchema>;