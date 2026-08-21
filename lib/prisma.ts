import { PrismaClient } from "@/app/generated/prisma";

/**
 * Shared Prisma client.
 *
 * Every route and page previously ran its own `new PrismaClient()`, which meant
 * ~25 separate connection pools against a single Postgres instance. In
 * development that is worse still, because hot reload re-evaluates modules and
 * leaks a new pool each time until the database refuses connections.
 *
 * The client is cached on globalThis outside production so hot reload reuses
 * one instance. In production the module is evaluated once, so a plain
 * singleton is enough.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
