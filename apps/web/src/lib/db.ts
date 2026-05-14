import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  console.log("Initializing Prisma Client...");
  
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("❌ DATABASE_URL environment variable is not set!");
  }
  console.log("✅ DATABASE_URL found");

  let pool: Pool;
  let adapter: PrismaPg;
  
  try {
    pool = new Pool({ connectionString });
    console.log("✅ pg Pool created");
    adapter = new PrismaPg(pool);
    console.log("✅ PrismaPg adapter created");
  } catch (err) {
    console.error("❌ Error creating pg Pool/Prisma adapter:", err);
    throw err;
  }
  
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
  
  console.log("✅ Prisma Client initialized");
  
  return client;
}

let prismaInstance: PrismaClient;

try {
  prismaInstance = globalForPrisma.prisma ?? createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
} catch (err) {
  console.error("❌ FATAL: Failed to initialize Prisma Client:", err);
  throw err;
}

export const db = prismaInstance;
