import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Dual-Mode Database Engine:
// 1. Returns a virtual client during Vercel Build (prevents crashes)
// 2. Returns the real Supabase client during Runtime (enables site)
export const db = (function() {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return {} as PrismaClient;
  }
  
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
})();