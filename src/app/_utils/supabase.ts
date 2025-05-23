import { createClient } from "@supabase/supabase-js";

// Create a mock Supabase client for build
const createMockClient = () => {
  return {
    auth: {
      getUser: async () => ({ 
        data: { 
          user: { 
            id: 'mock-user-id',
            email: 'mock@example.com' 
          } 
        },
        error: null
      })
    }
  };
};

// Use the real Supabase client only if we have credentials and not in build mode
let client;
if (process.env.NEXT_PUBLIC_BUILD_BYPASS === 'true') {
  client = createMockClient();
} else {
  try {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.com',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'
    );
  } catch (e) {
    console.error("Failed to create Supabase client, using mock", e);
    client = createMockClient();
  }
}

export const supabase = client;
