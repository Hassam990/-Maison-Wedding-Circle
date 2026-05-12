import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL is available for Prisma 7
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres.sztsypdamevylxnjagqz:MEqLrab1D3lWMU5W@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;