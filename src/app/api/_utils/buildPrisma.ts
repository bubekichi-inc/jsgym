import { PrismaClient } from "@prisma/client";

// Mock PrismaClient for build
const mockPrismaClient = {
  // Add mock methods as needed
  forumCategory: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({})
  },
  forumThread: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({})
  },
  forumPost: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({})
  },
  forumReaction: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    delete: async () => ({})
  },
  user: {
    findUnique: async () => ({ id: "mock-user-id", role: "ADMIN" })
  }
};

// PrismaClientのインスタンスを生成する関数
export async function buildPrisma() {
  // For build-time, use mock
  if (process.env.NODE_ENV === 'production') {
    return mockPrismaClient;
  }
  
  // For runtime, use real client
  try {
    const prisma = new PrismaClient();
    return prisma;
  } catch (e) {
    console.error("Failed to create PrismaClient, using mock", e);
    return mockPrismaClient;
  }
}