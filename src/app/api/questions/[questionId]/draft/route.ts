import { NextRequest, NextResponse } from "next/server";
import { Draft } from "../../_types/Draft";
import { buildPrisma } from "@/app/_utils/prisma";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}
export const POST = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  //プロトタイプ用のtestアカウントID
  const userId = "aa47a833-3bd9-4ad3-92f5-dcea9f9fab7e";
  const { questionId } = await params;
  const body: Draft = await req.json();
  try {
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

    return NextResponse.json({ message: "success!" }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
