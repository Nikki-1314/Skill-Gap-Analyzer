import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  get adapter() {
    return PrismaAdapter(prisma as any);
  },
  session: { strategy: "database" },
  secret: process.env.NEXTAUTH_SECRET || "build-time-secret-fallback",
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "dummy-id",
      clientSecret: process.env.GITHUB_SECRET || "dummy-secret",
      httpOptions: {
        timeout: 15000,
      },
    }),
  ],
};

