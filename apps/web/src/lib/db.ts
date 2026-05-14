import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (error) {
    console.error("Failed to create Prisma Client:", error);
    throw error;
  }
}

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prismaClient = createPrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  prismaClient = globalForPrisma.prisma;
}

export const db = prismaClient;