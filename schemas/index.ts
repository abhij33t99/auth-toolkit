import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const LoginSchema = z.object(
    {
        email: z.string().email({
            message: "Email is required"
        }),
        password: z.string().min(6, "Password should be atleast 6 characters long"),
        code: z.optional(z.string())
    }
)

export const RegisterSchema = z.object(
    {
        name: z.string().min(1, "Name is required"),
        email: z.string().email({
            message: "Email is required"
        }),
        password: z.string().min(6, "Password should be atleast 6 characters long")
    }
)

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
        message: "Minimum of 6 characters required",
    }),
})

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
})
    .refine((data) => {
        if (data.password && !data.newPassword)
            return false;
        return true;
    }, {
        message: "New password is required!",
        path: ["newPassword"]
    })
    .refine((data) => {
        if (!data.password && data.newPassword)
            return false;
        return true;
    }, {
        message: "Password is required!",
        path: ["password"]
    })