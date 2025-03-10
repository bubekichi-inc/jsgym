import { NextResponse } from "next/server";
import { buildError } from "../_utils/buildError";
import { buildPrisma } from "@/app/_utils/prisma";

export interface ReviewerRanking {
  id: number;
  name: string;
  profileImageUrl: string;
  bio: string;
  reviewCount: number;
}

export type ReviewerRankingResponse = {
  reviewers: ReviewerRanking[];
};

export async function GET() {
  const prisma = await buildPrisma();
  try {
    // レビュワー毎のコードレビュー数を取得（bioも含める）
    const reviewerRankings = await prisma.$queryRaw<
      Array<Omit<ReviewerRanking, "reviewCount"> & { reviewCount: bigint }>
    >`
      SELECT
        r.id,
        r.name,
        r.profile_image_url as "profileImageUrl",
        r.bio,
        COUNT(cr.id) as "reviewCount"
      FROM
        reviewers r
      LEFT JOIN
        messages m ON r.id = m.reviewer_id
      LEFT JOIN
        code_reviews cr ON m.id = cr.message_id
      GROUP BY
        r.id, r.name, r.profile_image_url, r.bio
      ORDER BY
        "reviewCount" DESC
    `;

    // BigIntを数値に変換
    const formattedRankings: ReviewerRanking[] = reviewerRankings.map(
      (reviewer) => ({
        ...reviewer,
        reviewCount: Number(reviewer.reviewCount),
      })
    );

    const responseData: ReviewerRankingResponse = {
      reviewers: formattedRankings,
    };

    return NextResponse.json(responseData);
  } catch (e) {
    return await buildError(e);
  }
}
