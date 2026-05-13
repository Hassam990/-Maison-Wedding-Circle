import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use direct connection URL for the pool to avoid pgbouncer issues in serverless
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL?.replace(":6543/", ":5432/").replace("?pgbouncer=true", "");

// Optimized for Vercel Serverless Functions but robust for dev
const pool = new Pool({ 
  connectionString,
  max: process.env.NODE_ENV === "production" ? 1 : 10, // More connections in dev
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: connectionString?.includes("supabase") ? { rejectUnauthorized: false } : undefined
});

const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;