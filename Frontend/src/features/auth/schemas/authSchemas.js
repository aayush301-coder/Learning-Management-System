import { z } from "zod";

// Kept in sync with Backend/src/modules/auth/auth.validation.js
export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),

    email: z.string().trim().min(1, "Email is required").email("Invalid email address"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(8, "Confirm password is required"),

    role: z.enum(["student", "instructor"], { required_error: "Role is required" }).default("student"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
