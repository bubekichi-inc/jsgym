import { CourseType, UserQuestionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../../_utils/buildError";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}

export type QuestionResponse = {
  question: {
    id: number;
    title: string;
    example: string | null;
    exampleAnswer: string;
    content: string;
    template: string;
    lesson: {
      id: number;
      name: string;
      caution: string | null;
      course: {
        id: number;
        name: CourseType;
      };
    };
  };
  userQuestion: {
    id: string;
    status: UserQuestionStatus;
  } | null;
  answer: {
    answer: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  nextQuestion: {
    id: number;
    title: string;
  } | null;
};

const prisma = await buildPrisma();

export const GET = async (request: NextRequest, { params }: Props) => {
  const { questionId } = await params;
  try {
    const { id: userId } = await getCurrentUser({ request });
    const question = await prisma.question.findUnique({
      where: {
        id: parseInt(questionId, 10),
      },
      select: {
        id: true,
        title: true,
        example: true,
        exampleAnswer: true,
        content: true,
        template: true,
        lesson: {
          select: {
            id: true,
            name: true,
            caution: true,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!question)
      return NextResponse.json(
        { error: "問題が見つかりません。" },
        { status: 404 }
      );

    const userQuestion = await prisma.userQuestion.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId: parseInt(questionId, 10),
        },
      },
    });

    const answer = userQuestion
      ? await prisma.answer.findFirst({
          where: {
            userQuestionId: userQuestion.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      : null;

    const nextQuestion = await prisma.question.findFirst({
      where: {
        lessonId: question.lesson.id,
        id: {
          gt: question.id,
        },
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json<QuestionResponse>(
      {
        question,
        userQuestion,
        nextQuestion,
        answer,
      },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};
