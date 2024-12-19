import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";
import { buildError } from "@/app/api/_utils/buildError";
import { GoogleRequest } from "./_types/GoogleRequest";
export const POST = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  const { accessToken }: GoogleRequest = await request.json();
  try {
    const { data, error } = await supabase.auth.getUser(accessToken);
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
        user,
        message: "新規ユーザー登録",
      },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};
