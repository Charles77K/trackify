import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  username: z
    .string("Please enter a valid username")
    .nonempty("Reg_no must be at least 1 character"),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase character" }),
});
export type LoginSchema = z.infer<typeof loginSchema>;
