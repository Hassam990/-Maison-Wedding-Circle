import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// The Self-Healing Engine:
// Protects the build machine from crashes while ensuring the live site is always connected.
export const db = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (typeof window !== "undefined") return undefined;
    
    // Safety check for internal React/Next.js probes
    if (prop === '$$typeof' || prop === 'then') return undefined;

    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
    }
    
    // @ts-ignore
    return globalForPrisma.prisma[prop];
  }
});