import { buildPrisma } from "@/app/_utils/prisma";
import { NextResponse } from "next/server";
import { buildError } from "../../_utils/buildError";

export const dynamic = "force-dynamic";

export type Question = {
  id: number;
  title: string;
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

export const GET = async () => {
  const prisma = await buildPrisma();
  try {
    const questions = await prisma.question.findMany({
      take: 9,
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        title: true,
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
    return buildError(e);
  }
};
