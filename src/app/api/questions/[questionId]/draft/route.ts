import { NextRequest, NextResponse } from "next/server";
import { Draft } from "../../_types/Draft";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}
export const POST = async (request: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { questionId } = await params;
  try {
    const { id: userId } = await getCurrentUser({ request });
    const body: Draft = await request.json();

    const userQuestion = await prisma.userQuestion.upsert({
      where: {
        userId_questionId: { userId, questionId: parseInt(questionId, 10) },
      },
      update: {},
      create: { userId, questionId: parseInt(questionId, 10), status: "DRAFT" },
    });

    await prisma.answer.create({
      data: {
        userQuestionId: userQuestion.id,
        answer: body.answer,
      },
    });

    return NextResponse.json<Draft>({ answer: "success!" }, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
