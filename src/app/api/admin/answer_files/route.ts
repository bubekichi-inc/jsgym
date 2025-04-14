import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

export interface AdminAnswerFilesResponse {
  answerFiles: {
    id: string;
    name: string;
    ext: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    isRoot: boolean;
    answer: {
      id: string;
      userQuestion: {
        id: string;
        status: string;
        user: {
          id: string;
          name: string;
        };
        question: {
          id: string;
          title: string;
          level: string;
          type: string;
        };
      };
    };
  }[];
  total: number;
}

export interface AdminAnswerFilesQuery {
  page?: string;
  limit?: string;
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
    const query: AdminAnswerFilesQuery = {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "50",
      sortBy: searchParams.get("sortBy") ?? "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",
    };

    const prisma = await buildPrisma();

    const page = parseInt(query.page ?? "1");
    const limit = parseInt(query.limit ?? "50");
    const skip = (page - 1) * limit;

    const orderBy: Record<string, "asc" | "desc"> = {};
    orderBy[query.sortBy ?? "createdAt"] = query.sortOrder ?? "desc";

    const total = await prisma.answerFile.count();

    const answerFiles = await prisma.answerFile.findMany({
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        ext: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        isRoot: true,
        answer: {
          select: {
            id: true,
            userQuestion: {
              select: {
                id: true,
                status: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                question: {
                  select: {
                    id: true,
                    title: true,
                    level: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formattedAnswerFiles = answerFiles.map((answerFile) => ({
      id: answerFile.id,
      name: answerFile.name,
      ext: answerFile.ext,
      content: answerFile.content,
      createdAt: answerFile.createdAt.toISOString(),
      updatedAt: answerFile.updatedAt.toISOString(),
      isRoot: answerFile.isRoot,
      answer: answerFile.answer,
    }));

    return NextResponse.json({
      answerFiles: formattedAnswerFiles,
      total,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Answer Filesの取得に失敗しました" },
      { status: 500 }
    );
  }
}
