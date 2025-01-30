import { NextRequest, NextResponse } from "next/server";
import { PointsResponse } from "./_types/PointsResponse";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  try {
    const { id } = await getCurrentUser({ request });
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
      return NextResponse.json(
        { error: "user情報の取得に失敗しました" },
        { status: 404 }
      );
    return NextResponse.json<PointsResponse>(
      { points: user.points },
      { status: 200 }
    );
  } catch (e) {
    return buildError(e);
  }
};
