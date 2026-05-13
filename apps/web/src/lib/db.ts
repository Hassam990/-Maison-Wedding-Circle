import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Ironclad Lazy Loader: Prisma is ONLY created when first requested
export const db = (function() {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    // Return a dummy object during build to prevent crashes
    return {} as PrismaClient;
  }
  
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
})();