import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";
export const POST = async (req: NextRequest) => {
  const prisma = await buildPrisma();
  const token = req.headers.get("Authorization") ?? "";
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      console.error("Supabase error:", error.message);
      throw new Error("Unauthorized");
    }
    const user = await prisma.user.findUnique({
      where: {
        supabaseUserId: data.user.id,
      },
    });
    if (user)
      return NextResponse.json({ message: "既存ユーザー" }, { status: 200 });

    await prisma.user.create({
      data: {
        supabaseUserId: data.user.id,
        name: data.user.user_metadata.id,
        email: data.user.user_metadata.email,
      },
    });
    return NextResponse.json(
      {
        message: "新規ユーザー登録",
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "Unauthorized") {
        return NextResponse.json({ error: e.message }, { status: 401 });
      }
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
