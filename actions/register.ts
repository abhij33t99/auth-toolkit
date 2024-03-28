"use server";

import { RegisterSchema } from '@/schemas';
import * as z from 'zod'
import { createUser, getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success)
        return { error: 'Invalid fields!' }

    const { name, email, password } = validateFields.data

    const existingUser = await getUserByEmail(email)
    if (existingUser)
        return { error: 'Email already exists!' }

    await createUser({ name, email, password })

    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: 'Verification email sent!!' }
}