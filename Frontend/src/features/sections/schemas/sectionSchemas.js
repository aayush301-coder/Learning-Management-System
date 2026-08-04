import { z } from "zod";

export const sectionSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  order: z.coerce.number().min(0).default(0),
});
