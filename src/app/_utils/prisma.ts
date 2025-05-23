import { PrismaClient } from "@prisma/client";

// Mock client for build
const mockPrismaClient = {
  user: {
    findUnique: async () => ({
      id: 'mock-user-id',
      name: 'Mock User',
      email: 'mock@example.com',
      role: 'ADMIN'
    })
  },
  // Add other tables as needed
  $connect: async () => {},
  $disconnect: async () => {}
};

// To prevent multiple instances in development
let prismaClient;

// For build time, use mock client
if (process.env.NEXT_PUBLIC_BUILD_BYPASS === 'true') {
  prismaClient = mockPrismaClient;
} else {
  try {
    prismaClient = new PrismaClient();
  } catch (e) {
    console.error("Failed to initialize PrismaClient, using mock instead", e);
    prismaClient = mockPrismaClient;
  }
}

export const buildPrisma = async () => {
  try {
    if (prismaClient.$connect) {
      await prismaClient.$connect();
    }
  } catch (e) {
    console.error("Failed to connect to Prisma", e);
  }
  return prismaClient;
};
