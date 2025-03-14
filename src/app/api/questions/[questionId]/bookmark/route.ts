import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../../../_utils/buildError";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}

export const GET = async (request: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { questionId } = await params;

  try {
    const token = request.headers.get("Authorization") ?? "";
    const { data } = await supabase.auth.getUser(token);
    const currentUser = data.user
      ? await prisma.user.findUnique({
          where: {
            supabaseUserId: data.user.id,
          },
        })
      : null;

    if (!currentUser) {
      return NextResponse.json({ bookmark: false }, { status: 200 });
    }

    const bookmark = await prisma.questionBookmark.findUnique({
      where: {
        userId_questionId: {
          userId: currentUser.id,
          questionId,
        },
      },
    });

    return NextResponse.json({ bookmark: !!bookmark }, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};

export const POST = async (request: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { questionId } = await params;

  try {
    const { id: userId } = await getCurrentUser({ request });

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "問題が見つかりません。" },
        { status: 404 }
      );
    }

    const existingBookmark = await prisma.questionBookmark.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { message: "すでにブックマークされています。" },
        { status: 200 }
      );
    }

    const bookmark = await prisma.questionBookmark.create({
      data: {
        userId,
        questionId,
      },
    });

    return NextResponse.json(
      { message: "ブックマークしました。", bookmark },
      { status: 200 }
    );
  } catch (e) {
    return await buildError(e);
  }
};

export const DELETE = async (request: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { questionId } = await params;

  try {
    const { id: userId } = await getCurrentUser({ request });

    await prisma.questionBookmark.delete({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });

    return NextResponse.json(
      { message: "ブックマークを解除しました。" },
      { status: 200 }
    );
  } catch (e) {
    return await buildError(e);
  }
};
