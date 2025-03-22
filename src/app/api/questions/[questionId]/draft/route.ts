import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";
import { CodeEditorFile } from "@/app/q/[questionId]/_hooks/useCodeEditor";

export type Draft = {
  files: CodeEditorFile[];
};

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
        userId_questionId: { userId, questionId },
      },
      update: {},
      create: { userId, questionId, status: "DRAFT" },
    });

    await prisma.answer.create({
      data: {
        userQuestionId: userQuestion.id,
        answerFiles: {
          create: body.files.map((file) => ({
            name: file.name,
            content: file.content,
            ext: file.ext,
          })),
        },
      },
    });

    return NextResponse.json({ message: "success!" }, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};
