import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";

export async function GET(request: NextRequest) {
  try {
    const prisma = await buildPrisma();
    const token = request.headers.get("Authorization") ?? "";
    const { data } = await supabase.auth.getUser(token);
    const currentUser = data.user
      ? await prisma.user.findUnique({
          where: {
            supabaseUserId: data.user.id,
          },
          select: {
            memo: true,
          },
        })
      : null;

    if (!currentUser) {
      return NextResponse.json({ memo: "" }, { status: 200 });
    }

    return NextResponse.json({ memo: currentUser.memo || "" });
  } catch (error) {
    console.error("メモ取得エラー:", error);
    return NextResponse.json(
      { error: "メモの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const prisma = await buildPrisma();
    const user = await getCurrentUser({ request });

    const { memo } = await request.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        memo,
      },
      select: {
        memo: true,
      },
    });

    return NextResponse.json({ memo: updatedUser.memo });
  } catch (error) {
    console.error("メモ更新エラー:", error);
    return NextResponse.json(
      { error: "メモの更新に失敗しました" },
      { status: 500 }
    );
  }
}
