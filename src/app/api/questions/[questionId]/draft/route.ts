import { NextRequest, NextResponse } from "next/server";
import { Draft } from "../../_types/Draft";
import { buildPrisma } from "@/app/_utils/prisma";
import { getUser } from "@/app/api/_utils/getUser";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}
export const POST = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const token = req.headers.get("Authorization") ?? "";
  const { questionId } = await params;
  const body: Draft = await req.json();
  try {
    const { id: userId } = await getUser({ token });

    const answer = await prisma.answer.findMany({
      where: {
        AND: [{ userId, questionId: parseInt(questionId, 10) }],
      },
    });

    if (answer.length === 0) {
      await prisma.answer.create({
        data: {
          questionId: parseInt(questionId, 10),
          answer: body.answer,
          status: "DRAFT",
          userId,
        },
      });
    } else {
      await prisma.answer.update({
        where: {
          id: answer[0].id,
        },
        data: {
          answer: body.answer,
          status: "DRAFT",
        },
      });
    }

    //下書きも履歴登録
    await prisma.answerHistory.create({
      data: {
        userId: userId,
        questionId: parseInt(questionId, 10),
        answer: body.answer,
      },
    });

    return NextResponse.json<Draft>({ answer: "success!" }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "Unauthorized") {
        return NextResponse.json({ error: e.message }, { status: 401 });
      }
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
