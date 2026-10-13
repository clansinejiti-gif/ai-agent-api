import { z } from "zod";

export const registerSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(15)
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Verification code must be 6 digits"),
});
