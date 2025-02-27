import { EditorFontSize, EditorTheme } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

export type EditorSetting = {
  editorTheme: EditorTheme;
  editorFontSize: EditorFontSize;
};

const prisma = await buildPrisma();

export const GET = async (request: NextRequest) => {
  try {
    const token = request.headers.get("Authorization") ?? "";
    const { data } = await supabase.auth.getUser(token);
    const user = data.user
      ? await prisma.user.findUnique({
          where: {
            supabaseUserId: data.user.id,
          },
          select: {
            editorTheme: true,
            editorFontSize: true,
          },
        })
      : null;

    // 認証されていないユーザーにはデフォルト値返す
    if (!user) {
      return NextResponse.json<{ editorSetting: EditorSetting }>(
        {
          editorSetting: {
            editorTheme: EditorTheme.DARK,
            editorFontSize: EditorFontSize.MEDIUM,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json<{ editorSetting: EditorSetting }>(
      { editorSetting: user },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser({ request });
    const data: EditorSetting = await request.json();
    const { editorTheme, editorFontSize } = data;
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        editorTheme,
        editorFontSize,
      },
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
