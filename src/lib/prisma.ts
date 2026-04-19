import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => {
  if (process.env.DATABASE_HOST && process.env.DATABASE_USER) {
    const adapter = new PrismaMariaDb({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME || 'test',
      port: Number(process.env.DATABASE_PORT) || 4000,
      connectionLimit: 10,
      allowPublicKeyRetrieval: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
};

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

