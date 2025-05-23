// Mock PrismaClient for build
const PrismaClient = function() {
  return {
    // Add any methods used by your app here
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
    $connect: async () => {},
    $disconnect: async () => {}
  };
};

// Export mock PrismaClient
export { PrismaClient };