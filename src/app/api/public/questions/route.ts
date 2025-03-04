import { NextRequest, NextResponse } from "next/server";
import { buildError } from "../../_utils/buildError";
import { buildPrisma } from "@/app/_utils/prisma";

export const dynamic = "force-dynamic";

export type Question = {
  id: string;
  title: string;
  createdAt: Date;
  content: string;
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
};

export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();

  const limit = Number(request.nextUrl.searchParams.get("limit"));

  try {
    const questions = await prisma.question.findMany({
      take: limit,
      orderBy: {
        id: "desc",
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
