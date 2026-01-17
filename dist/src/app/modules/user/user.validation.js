"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, { message: "Name too short... minimum 2 characters required" })
        .max(50, { message: "Name too long... maximum 50 characters allowed" }),
    email: zod_1.default.string().email({ message: "Invalid email address" }),
    password: zod_1.default
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/(?=.*[A-Z])/, {
        message: "Password must contain at least one uppercase letter",
    })
        .regex(/(?=.*[a-z])/, {
        message: "Password must contain at least one lowercase letter",
    })
        .regex(/(?=.*\d)(?=.*[@$!%*?&])/, {
        message: "Password must contain at least one digit and one special character",
    }),
    phone: zod_1.default
        .string()
        .regex(/^01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number (must start with 013–019 and be exactly 11 digits)",
    })
        .optional(),
    address: zod_1.default.string().min(5, { message: "Address too short" }).optional(),
});
exports.UpdateZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, { message: "Name too short... minimum 2 characters required" })
        .max(50, { message: "Name too long... maximum 50 characters allowed" })
        .optional(),
    password: zod_1.default
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/(?=.*[A-Z])/, {
        message: "Password must contain at least one uppercase letter",
    })
        .regex(/(?=.*[a-z])/, {
        message: "Password must contain at least one lowercase letter",
    })
        .regex(/(?=.*\d)(?=.*[@$!%*?&])/, {
        message: "Password must contain at least one digit and one special character",
    })
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number (must start with 013–019 and be exactly 11 digits)",
    })
        .optional(),
    address: zod_1.default.string().min(5, { message: "Address too short" }).optional(),
    isDeleted: zod_1.default.boolean().optional(),
    isVerified: zod_1.default.boolean().optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
});
