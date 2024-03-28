import NextAuth, { DefaultSession } from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from "@/lib/db"
import { getUserById } from "@/data/user"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
import { getAccountByUserId } from "@/data/account"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  pages: {
    error: "/auth/error"
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials')
        return true;

      const existingUser = await getUserById(user.id as string);
      if (!existingUser?.emailVerified)
        return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (!twoFactorConfirmation)
          return false;

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
        return true;
      }


      return true;
    },
    async session({ token, session }) {
      console.log("Token", token)
      if (token.sub && session.user)
        session.user.id = token.sub
      if (token.role && session.user)
        session.user.role = token.role as UserRole
      if (token.isTwoFactorEnabled && session.user)
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      if (token.name && session.user)
        session.user.name = token.name
      if (token.email && session.user)
        session.user.email = token.email
      session.user.isOAuth = token.isOAuth as boolean;
      return session
    },
    async jwt({ token }) {
      if (!token.sub) return null;
      const user = await getUserById(token.sub)
      const existingAcc = await getAccountByUserId(token.sub)
      if (!user) return null;
      token.isOAuth = !!existingAcc
      token.name = user.name;
      token.email = user.email;
      token.role = user.role
      token.isTwoFactorEnabled = user.isTwoFactorEnabled
      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})