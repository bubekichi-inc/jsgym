import { CourseType, UserQuestionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../../_utils/buildError";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}

export type QuestionResponse = {
  question: {
    id: string;
    title: string;
    inputCode: string;
    outputCode: string;
    exampleAnswer: string;
    content: string;
    template: string;
    createdAt: Date;
    lesson: {
      id: number;
      name: string;
      course: {
        id: number;
        name: CourseType;
      };
    };
    reviewer: {
      id: number;
      name: string;
      bio: string;
      profileImageUrl: string;
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
    id: string;
    title: string;
    lesson: {
      id: number;
      name: string;
    };
  } | null;
};

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

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      select: {
        id: true,
        title: true,
        inputCode: true,
        outputCode: true,
        exampleAnswer: true,
        content: true,
        template: true,
        createdAt: true,
        lesson: {
          select: {
            id: true,
            name: true,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            bio: true,
            profileImageUrl: true,
          },
        },
      },
    });
    if (!question)
      return NextResponse.json(
        { error: "問題が見つかりません。" },
        { status: 404 }
      );

    const userQuestion = currentUser
      ? await prisma.userQuestion.findUnique({
          where: {
            userId_questionId: {
              userId: currentUser.id,
              questionId,
            },
          },
        })
      : null;

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
        userQuestions: {
          none: {
            userId: currentUser?.id,
          },
        },
      },
      select: {
        id: true,
        title: true,
        lesson: {
          select: {
            id: true,
            name: true,
          },
        },
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
    return await buildError(e);
  }
};
