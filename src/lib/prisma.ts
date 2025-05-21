import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Declare global variable for TypeScript
const globalAny: any = global;

// Make sure we have a valid DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
}

// Initialize Prisma Client with connection handling optimized for serverless
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

// Use type any to avoid TypeScript errors
const globalForPrisma = globalAny as { prisma?: PrismaClient };

// Create or reuse the Prisma client instance
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Set global prisma in development to prevent hot-reload connection issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };
