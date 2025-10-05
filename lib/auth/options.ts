import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
          include: { patient: true, therapist: true }
        });
        if (!user) {
          return null;
        }
        const valid = await verifyPassword(credentials.password, user.passwordHash);
        if (!valid) {
          return null;
        }
        return { id: user.id, email: user.email, name: user.email };
      }
    })
  ],
  pages: {
    signIn: "/patient/login"
  }
};
