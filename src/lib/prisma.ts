import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Ensure Prisma is connected (only on server-side)
if (typeof window === 'undefined') {
  // Test connection on startup
  prisma.$connect()
    .then(() => {
      console.log('✅ Database connected successfully');
    })
    .catch((err: unknown) => {
      console.error('❌ Failed to connect to database:', err);
    });
}

