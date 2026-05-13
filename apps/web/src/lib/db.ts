import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use direct connection URL for the pool to avoid pgbouncer issues in serverless
const rawUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

// Clean URL: ensure we use the direct port 5432 for the adapter if pgbouncer isn't needed
const connectionString = rawUrl?.replace(":6543/", ":5432/").split('?')[0];

const pool = new Pool({ 
  connectionString,
  max: process.env.NODE_ENV === 'development' ? 10 : 2, // Slightly more room for Vercel
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000, // 10s timeout
});

const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;