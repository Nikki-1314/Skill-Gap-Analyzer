import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const createPrismaClient = () => {
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build" || 
                       process.env.NODE_ENV === "production" && !process.env.DATABASE_URL;

  try {
    const adapter = new PrismaMariaDb({
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USER || 'sga',
      password: process.env.DATABASE_PASSWORD || 'Nikhitha@1314',
      database: process.env.DATABASE_NAME || 'skill_gap_analyzer',
      port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 3306,
      connectionLimit: 5,
      allowPublicKeyRetrieval: true,
      ...(process.env.DATABASE_HOST !== 'localhost' && {
        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: false,
        },
      }),
    });

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (error) {
    if (isBuildPhase) {
      console.warn("Prisma initialization failed during build, using dummy client");
      return {} as PrismaClient;
    }
    throw error;
  }
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
