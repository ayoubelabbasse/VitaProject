import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only create Prisma client if DATABASE_URL is available
const createPrismaClient = () => {
  try {
    // Check if we have a valid database URL
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl || databaseUrl.includes('file:')) {
      // SQLite file-based DB won't work on Vercel
      if (process.env.VERCEL) {
        console.warn('⚠️ SQLite database not supported on Vercel. Using fallback mode.');
        return null;
      }
    }
    
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error('Failed to create Prisma client:', error);
    return null;
  }
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

// Graceful connection (only on server-side)
if (typeof window === 'undefined' && prisma) {
  prisma.$connect()
    .then(() => {
      console.log('✅ Database connected successfully');
    })
    .catch((err: unknown) => {
      console.warn('⚠️ Database connection failed (app will use fallback mode):', err);
    });
}

