import {
  FileExtension,
  QuestionFile,
  QuestionLevel,
  QuestionType,
  UserQuestionStatus,
} from "@prisma/client";
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
    content: string;
    createdAt: Date;
    level: QuestionLevel;
    type: QuestionType;
    reviewer: {
      id: number;
      name: string;
      bio: string;
      profileImageUrl: string;
    };
    questionFiles: QuestionFile[];
  };
  userQuestion: {
    id: string;
    status: UserQuestionStatus;
  } | null;
  answer: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    answerFiles: {
      id: string;
      name: string;
      ext: FileExtension;
      content: string;
    }[];
  } | null;
  nextQuestion: {
    id: string;
    title: string;
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
        content: true,
        createdAt: true,
        level: true,
        type: true,
        reviewer: {
          select: {
            id: true,
            name: true,
            bio: true,
            profileImageUrl: true,
          },
        },
        questionFiles: true,
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
          include: {
            answerFiles: {
              select: {
                id: true,
                name: true,
                ext: true,
                content: true,
              },
            },
          },
        })
      : null;

    const nextQuestion = await prisma.question.findFirst({
      where: {
        level: question.level,
        type: question.type,
        userQuestions: {
          none: {
            userId: currentUser?.id,
          },
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
    return await buildError(e);
  }
};
