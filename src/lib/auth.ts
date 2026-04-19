import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  get adapter() {
    return PrismaAdapter(prisma);
  },
  session: { strategy: "database" },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      httpOptions: {
        timeout: 15000,
      },
    }),
  ],
};

