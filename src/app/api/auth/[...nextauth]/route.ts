export const dynamic = "force-dynamic";
import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

async function handler(req: any, res: any) {
  return await NextAuth(req, res, authOptions);
}

export { handler as GET, handler as POST };

