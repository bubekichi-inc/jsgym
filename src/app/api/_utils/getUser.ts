import { supabase } from "@/app/_utils/supabase";
import { buildPrisma } from "@/app/_utils/prisma";
export const getUser = async ({ token }: { token: string }) => {
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
  return {
    id: user.id,
  };
};
