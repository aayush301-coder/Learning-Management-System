import { z } from "zod";

export const lessonSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().trim().optional(),
  videoUrl: z.string().trim().url("Must be a valid YouTube URL").optional().or(z.literal("")),
  duration: z.coerce.number().min(0, "Duration cannot be negative").default(0),
  order: z.coerce.number().min(0).default(0),
  isPreview: z.coerce.boolean().default(false),
});
