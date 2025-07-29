import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name too short... minimum 2 characters required" })
    .max(50, { message: "Name too long... maximum 50 characters allowed" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/(?=.*[a-z])/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/(?=.*\d)(?=.*[@$!%*?&])/, {
      message:
        "Password must contain at least one digit and one special character",
    }),

  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, {
      message:
        "Invalid Bangladeshi phone number (must start with 013–019 and be exactly 11 digits)",
    })
    .optional(),

  address: z.string().min(5, { message: "Address too short" }).optional(),
});

export const UpdateZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name too short... minimum 2 characters required" })
    .max(50, { message: "Name too long... maximum 50 characters allowed" })
    .optional(),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/(?=.*[a-z])/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/(?=.*\d)(?=.*[@$!%*?&])/, {
      message:
        "Password must contain at least one digit and one special character",
    })
    .optional(),

  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, {
      message:
        "Invalid Bangladeshi phone number (must start with 013–019 and be exactly 11 digits)",
    })
    .optional(),

  address: z.string().min(5, { message: "Address too short" }).optional(),
  isDeleted: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
});
