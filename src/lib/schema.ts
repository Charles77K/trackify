import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  username: z
    .string("Please enter a valid username")
    .nonempty("Username must be at least 1 character"),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase character" }),
});
export type LoginSchema = z.infer<typeof loginSchema>;

//
//
//
//
//item form schema
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

const MAX_INT = 9223372036854776000;

//
//
//
// sales schema
export const SalesSchema = z.object({
  outlet: z
    .number()
    .int()
    .min(0, "Outlet must be at least 0")
    .max(MAX_INT)
    .refine((val) => !isNaN(val), { message: "Outlet is required" }),
  item: z
    .number()
    .int()
    .min(0, "Item must be at least 0")
    .max(MAX_INT)
    .refine((val) => !isNaN(val), { message: "Item is required" }),
  quantity: z
    .number()
    .int()
    .min(0, "Quantity must be at least 0")
    .max(MAX_INT)
    .refine((val) => !isNaN(val), { message: "Quantity is required" })
});

export type SalesFormData = z.infer<typeof SalesSchema>;

//
//
//
// outlet schema
export const outletFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name is too long" }),
  location: z
    .string()
    .max(255, { message: "Location is too long" })
    .nullable()
    .optional(),
});

export type OutletFormData = z.infer<typeof outletFormSchema>;

//
//
//
//
//inventory schema
export const InventorySchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  min_quantity: z.number().min(0, "Minimum quantity must be non-negative"),
  unit: z.string().min(1, "Unit is required"),
  cost_price: z.string().min(1, "Cost price is required"),
  selling_price: z.string().min(1, "Selling price is required"),
});

export type InventoryFormData = z.infer<typeof InventorySchema>;
