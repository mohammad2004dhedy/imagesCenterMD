import { PrismaClient } from "@prisma/client";
import { hasDatabase } from "@/lib/env";

const globalForPrisma = globalThis;

export const prisma = hasDatabase()
  ? globalForPrisma.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
    })
  : null;

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export function requirePrisma() {
  if (!prisma) {
    const error = new Error("Database is not configured. Add DATABASE_URL to enable this feature.");
    error.code = "DATABASE_NOT_CONFIGURED";
    throw error;
  }
  return prisma;
}
