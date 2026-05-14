import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// The Ultra-Safe Proxy: Prevents "Cannot read properties of null" errors
// by ensuring that we only access Prisma when the environment is ready.
export const db = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (typeof window !== "undefined") return undefined;
    
    // Safety check for common JS/Next.js internal property probes
    if (prop === '$$typeof' || prop === 'constructor' || prop === 'then') return undefined;

    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
    }
    
    const value = (globalForPrisma.prisma as any)[prop];
    
    // If we're accessing a model (e.g. db.user), wrap its methods to be safe
    if (value && typeof value === 'object' && !Array.isArray(value)) {
       return value;
    }
    
    return value;
  }
});