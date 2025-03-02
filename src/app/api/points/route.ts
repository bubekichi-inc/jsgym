import { NextRequest, NextResponse } from "next/server";
import { PointsResponse } from "./_types/PointsResponse";
import { PointService } from "@/app/api/_services/PointService";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

export const dynamic = "force-dynamic"; // キャッシュを無効化

// ポイント残高を取得するAPI
export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  try {
    const { id } = await getCurrentUser({ request });
    const pointService = new PointService(prisma, id);
    const points = await pointService.getPoints();
    return NextResponse.json<PointsResponse>({ points }, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
