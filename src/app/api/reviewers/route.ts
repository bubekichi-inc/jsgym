import { NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { buildPrisma } from "@/app/_utils/prisma";

export const dynamic = "force-dynamic";

export type Reviewer = {
  id: number;
  name: string;
  bio: string;
  profileImageUrl: string;
  questionCount: number;
};

export const GET = async () => {
  const prisma = await buildPrisma();

  try {
    // レビュワー一覧を取得し、各レビュワーが持つ問題数もカウント
    const reviewers = await prisma.reviewer.findMany({
      where: {
        fired: false,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        profileImageUrl: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: {
        questions: {
          _count: "desc",
        },
      },
    });

    // レスポンス形式を整形
    const formattedReviewers: Reviewer[] = reviewers.map((reviewer) => ({
      id: reviewer.id,
      name: reviewer.name,
      bio: reviewer.bio,
      profileImageUrl: reviewer.profileImageUrl,
      questionCount: reviewer._count.questions,
    }));

    return NextResponse.json<{ reviewers: Reviewer[] }>(
      {
        reviewers: formattedReviewers,
      },
      { status: 200 }
    );
  } catch (e) {
    return await buildError(e);
  }
};
