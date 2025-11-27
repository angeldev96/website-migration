import { PrismaClient } from '@prisma/client/edge';

// Use a global variable to reuse the Prisma client in development
// and avoid exhausting database connections.
const globalForPrisma = globalThis;

function getPrismaClient() {
  return new PrismaClient({
    // Only log errors, not queries
    log: ['error'],
  });
}

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
