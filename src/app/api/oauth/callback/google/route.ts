import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";
import { buildError } from "@/app/api/_utils/buildError";
export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  const { searchParams } = new URL(request.url);
  console.log(searchParams.get("code"));
  const code = searchParams.get("code");

  if (!code)
    return NextResponse.json({ message: "codeがありません" }, { status: 400 });
  try {
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);
    if (error)
      return NextResponse.json(
        { message: "ユーザー情報の変換に失敗" },
        { status: 400 }
      );
    if (!supabaseUser)
      return NextResponse.json(
        { message: "ユーザー情報無し" },
        { status: 400 }
      );
    await prisma.user.create({
      data: {
        supabaseUserId: supabaseUser.id,
        name: supabaseUser.user_metadata.id,
        email: supabaseUser.user_metadata.email,
      },
    });

    NextResponse.redirect("/courses");
  } catch (e) {
    return buildError(e);
  }
};
