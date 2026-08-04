import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1, "Please select a rating").max(5),
  comment: z.string().trim().max(1000, "Comment cannot exceed 1000 characters").optional(),
});
