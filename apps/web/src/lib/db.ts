import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// The Smart Proxy: Acts like Prisma, but only initializes when a query is actually made.
// This prevents crashes during the Vercel build phase.
export const db = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (typeof window !== "undefined") return undefined;
    
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
    }
    
    // @ts-ignore
    return globalForPrisma.prisma[prop];
  }
});