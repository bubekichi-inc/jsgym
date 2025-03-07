import { UserQuestionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";

export const dynamic = "force-dynamic";

export type Question = {
  id: string;
  title: string;
  createdAt: Date;
  content: string;
  reviewer: {
    id: number;
    bio: string;
    name: string;
    profileImageUrl: string;
  };
  questions: {
    tag: {
      name: string;
    };
  }[];
  lesson: {
    id: number;
    name: string;
    course: {
      id: number;
      name: string;
    };
  };
  userQuestions: {
    status: UserQuestionStatus;
  }[];
};

export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();

  const limit = Number(request.nextUrl.searchParams.get("limit"));

  const token = request.headers.get("Authorization") ?? "";
  const { data } = await supabase.auth.getUser(token);
  const currentUser = data.user
    ? await prisma.user.findUnique({
        where: {
          supabaseUserId: data.user.id,
        },
      })
    : null;

  const userQuestionsQuery = currentUser
    ? {
        userQuestions: {
          where: {
            userId: currentUser.id,
          },
          select: {
            status: true,
          },
        },
      }
    : {};

  try {
    const questions = await prisma.question.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        content: true,
        questions: {
          select: {
            tag: true,
          },
        },
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
        ...userQuestionsQuery,
      },
    });

    return NextResponse.json<{ questions: Question[] }>(
      {
        questions,
      },
      { status: 200 }
    );
  } catch (e) {
    return await buildError(e);
  }
};
