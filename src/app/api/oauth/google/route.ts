import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { GoogleRequest } from "./_types/GoogleRequest";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";
import { buildError } from "@/app/api/_utils/buildError";

export const POST = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  const { accessToken }: GoogleRequest = await request.json();
  try {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        supabaseUserId: data.user.id,
      },
    });
    const avatarUrl = data.user.user_metadata.avatar_url;
    if (user) {
      return NextResponse.json(
        { message: "既存ユーザー", isNewUser: false },
        { status: 200 }
      );
    }

    // 新規ユーザーの場合
    await prisma.user.create({
      data: {
        supabaseUserId: data.user.id,
        stripeCustomerId: `cus_ReqDummy_${randomBytes(10).toString("hex")}`,
        name: data.user.user_metadata.full_name,
        email: data.user.user_metadata.email,
        iconUrl: avatarUrl,
      },
    });

    return NextResponse.json(
      {
        user,
        message: "新規ユーザー登録",
        isNewUser: true, // 新規ユーザーであることを示すフラグ
      },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};
