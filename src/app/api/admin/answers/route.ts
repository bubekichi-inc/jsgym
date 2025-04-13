import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

export interface AdminAnswersResponse {
  answers: {
    id: string;
    createdAt: string;
    question: {
      id: string;
      title: string;
    };
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
    answerFiles: {
      id: string;
      name: string;
      ext: string;
      content: string;
    }[];
    questionFiles: {
      id: string;
      name: string;
      ext: string;
      exampleAnswer: string;
    }[];
    codeReview: {
      id: string;
      result: "APPROVED" | "REJECTED";
      score: number;
    } | null;
  }[];
  total: number;
}

export interface AdminAnswersQuery {
  page?: string;
  limit?: string;
  search?: string;
  result?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser({ request });

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query: AdminAnswersQuery = {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "50",
      search: searchParams.get("search") ?? "",
      result: searchParams.get("result") ?? "",
      sortBy: searchParams.get("sortBy") ?? "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",
    };

    const prisma = await buildPrisma();

    const where: Prisma.AnswerWhereInput = {};

    if (query.search) {
      where.userQuestion = {
        question: {
          title: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      };
    }

    if (query.result) {
      where.userQuestion = {
        ...((where.userQuestion as Prisma.UserQuestionWhereInput) || {}),
        codeReviews: {
          some: {
            result: query.result as "APPROVED" | "REJECTED",
          },
        },
      };
    }

    const page = parseInt(query.page ?? "1");
    const limit = parseInt(query.limit ?? "50");
    const skip = (page - 1) * limit;

    const orderBy: Record<string, "asc" | "desc"> = {};
    orderBy[query.sortBy ?? "createdAt"] = query.sortOrder ?? "desc";

    const total = await prisma.answer.count({ where });

    const answers = await prisma.answer.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        createdAt: true,
        answerFiles: {
          select: {
            id: true,
            name: true,
            ext: true,
            content: true,
          },
        },
        userQuestion: {
          select: {
            id: true,
            userId: true,
            questionId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            question: {
              select: {
                id: true,
                title: true,
                questionFiles: {
                  select: {
                    id: true,
                    name: true,
                    ext: true,
                    exampleAnswer: true,
                  },
                },
              },
            },
            codeReviews: {
              take: 1,
              orderBy: {
                createdAt: "desc",
              },
              select: {
                id: true,
                result: true,
                score: true,
              },
            },
          },
        },
      },
    });

    const formattedAnswers = answers.map((answer) => ({
      id: answer.id,
      createdAt: answer.createdAt.toISOString(),
      question: {
        id: answer.userQuestion.question.id,
        title: answer.userQuestion.question.title,
      },
      user: answer.userQuestion.user,
      answerFiles: answer.answerFiles,
      questionFiles: answer.userQuestion.question.questionFiles,
      codeReview: answer.userQuestion.codeReviews[0] || null,
    }));

    return NextResponse.json({
      answers: formattedAnswers,
      total,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "回答一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
