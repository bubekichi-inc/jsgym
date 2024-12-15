import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}
export const GET = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  //プロトタイプ用のtestアカウントID
  const userId = "aa47a833-3bd9-4ad3-92f5-dcea9f9fab7e";
  const { questionId } = await params;
  try {
    const question = await prisma.question.findUnique({
      where: {
        id: parseInt(questionId, 10),
      },
      include: {
        lesson: {
          include: { course: true },
        },
      },
    });
    const questions = await prisma.lesson.findUnique({
      where: {
        id: question?.lessonId,
      },
      include: {
        questions: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    const answer = await prisma.answer.findMany({
      where: {
        AND: [{ userId, questionId: parseInt(questionId, 10) }],
      },
    });

    //出力用の問題番号をレスポンスに含める
    const currentQuestionNumber = questions?.questions.findIndex(
      q => q.id === parseInt(questionId, 10)
    );

    const newQuestions = questions?.questions.map((question, index) => ({
      id: question.id,
      title: question.title,
      content: question.content,
      questionNumber: index + 1,
    }));

    console.log(currentQuestionNumber && currentQuestionNumber + 1);
    return NextResponse.json(
      {
        course: question?.lesson.course,
        lesson: { id: question?.lesson.id, name: question?.lesson.name },
        question: {
          id: question?.id,
          title: question?.title,
          content: question?.content,
          questionNumber:
            currentQuestionNumber !== undefined && currentQuestionNumber + 1,
        },
        questions: newQuestions,
        answer:
          answer.length === 0
            ? null
            : {
                id: answer[0].id,
                code: answer[0].answer,
                status: answer[0].status,
              },
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
