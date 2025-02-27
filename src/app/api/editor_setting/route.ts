import { EditorFontSize, EditorTheme } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

export type EditorSetting = {
  editorTheme: EditorTheme;
  editorFontSize: EditorFontSize;
};

const prisma = await buildPrisma();

export const GET = async (request: NextRequest) => {
  try {
    const { id } = await getCurrentUser({ request });

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        editorTheme: true,
        editorFontSize: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザー情報の取得に失敗しました" },
        { status: 404 }
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
