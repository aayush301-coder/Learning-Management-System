import { z } from "zod";
import { COURSE_CATEGORIES, COURSE_LEVELS, COURSE_LANGUAGES } from "../../../constants/courseConstants";

export const courseSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(150),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  thumbnail: z.string().trim().url("Invalid thumbnail URL").optional().or(z.literal("")),
  category: z.enum(COURSE_CATEGORIES, { message: "Category is required" }),
  level: z.enum(COURSE_LEVELS, { message: "Level is required" }),
  language: z.enum(COURSE_LANGUAGES).default("english"),
  price: z.coerce.number().min(0, "Price cannot be negative").default(0),
});
