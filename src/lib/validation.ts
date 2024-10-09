import { z } from "zod";

// Required Field
const requiredString = z.string().trim().min(1, "Required");

// Sign up schema
export const signUpSchema = z.object({
  firstname: requiredString.regex(
    /^[a-zA-Z0-9_-\s]+$/,
    "Only letters, numbers, - and _ allowed"
  ),
  lastname: requiredString.regex(
    /^[a-zA-Z0-9_-\s]+$/,
    "Only letters, numbers, - and _ allowed"
  ),
  email: requiredString.email("Invalid email address"),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

// Login schema
export const loginSchema = z.object({
  email: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;
