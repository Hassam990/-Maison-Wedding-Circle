import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use the Direct URL for maximum stability if the pooled connection is problematic
// Port 5432 is the standard direct PostgreSQL port
const connectionString = process.env.DATABASE_URL?.replace(":6543/", ":5432/").replace("?pgbouncer=true", "");
console.log("Connecting to:", connectionString?.split("@")[1]); // Log host part only for security

const pool = new Pool({ 
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;