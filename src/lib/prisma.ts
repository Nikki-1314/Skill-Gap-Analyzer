import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const createPrismaClient = () => {
  const isBuild = process.env.NEXT_PHASE === "phase-production-build";
  const url = process.env.DATABASE_URL || "mysql://root:pass@localhost:3306/db";
  
  try {
    return new PrismaClient();
  } catch (error) {
    if (isBuild) {
      console.warn("Prisma initialization failed during build, using dummy client");
      return {} as PrismaClient;
    }
    throw error;
  }
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
