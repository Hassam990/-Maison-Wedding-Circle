import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// The Master Proxy: Uses the high-performance PostgreSQL adapter
// required by Vercel for Prisma 7 stability.
export const db = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (typeof window !== "undefined") return undefined;
    if (prop === '$$typeof' || prop === 'constructor' || prop === 'then') return undefined;

    if (!globalForPrisma.prisma) {
      const connectionString = process.env.DATABASE_URL;
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      
      globalForPrisma.prisma = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
    }
    
    const value = (globalForPrisma.prisma as any)[prop];
    return value;
  }
});