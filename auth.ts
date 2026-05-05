import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

/**
 * Full NextAuth configuration with Prisma adapter.
 * NOT edge-compatible - use auth.config.ts for edge environments.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      // Add user.id to the JWT token on sign in
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      // Add user.id to the session from the JWT token
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  ...authConfig,
});
