"use server";

import { signIn } from '@/auth';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail';
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/token';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import * as z from 'zod';

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
    const validateFields = LoginSchema.safeParse(values);

    if (!validateFields.success)
        return { error: 'Invalid fields!' };

    const { email, password, code } = validateFields.data

    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { success: "Confirmation email sent!" }
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const expectedCode = await getTwoFactorTokenByEmail(existingUser.email);
            if (!expectedCode || expectedCode.token !== code) {
                return { error: "Invalid code!" }
            }
            const hasExpired = new Date(expectedCode.expires) < new Date();
            if (hasExpired)
                return { error: "Code expired!" }
            await db.twoFactorToken.delete({
                where: { id: expectedCode.id }
            });
            const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            if (twoFactorConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id }
                });
            }
            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,

                }
            });
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
            return { twoFactor: true };
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
        })
    } catch (error) {
        console.log(error)
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid Credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error;
    }
}