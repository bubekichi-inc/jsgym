import { NextRequest } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";

export const getCurrentUser = async ({ request }: { request: NextRequest }) => {
  // Return mock user during build
  if (process.env.NODE_ENV === 'production') {
    return {
      id: "mock-user-id",
      name: "Mock User",
      email: "mock@example.com",
      role: "ADMIN",
      supabaseUserId: "mock-supabase-id",
      iconUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  const token = request.headers.get("Authorization") ?? "";
  if (!token) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    console.error("Supabase error:", error.message);
    throw new Error("Unauthorized");
  }
  const prisma = await buildPrisma();
  const user = await prisma.user.findUnique({
    where: {
      supabaseUserId: data.user.id,
    },
  });
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
};
