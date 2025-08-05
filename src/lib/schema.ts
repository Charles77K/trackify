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

export const itemFormSchema = z.object({
  item: z
    .number()
    .min(0, "Item must be at least 0")
    .max(9223372036854776000, "Item is too large"),
  quantity: z
    .string("Quantity is required")
    .min(0, "Quantity must be at least 0")
    .max(9223372036854776000, "Quantity is too large"),
  supplier: z
    .string()
    .max(255, "Max length is 255 characters")
    .nullable()
    .optional(),
  cost: z
    .string("Cost is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Cost must be a decimal (e.g., 10.00)"),
});

export type ItemFormData = z.infer<typeof itemFormSchema>;
