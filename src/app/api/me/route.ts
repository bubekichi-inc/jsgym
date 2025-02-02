import { NextRequest, NextResponse } from "next/server";
import { UserProfileUpdateRequest } from "./_types/UserProfile";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

//共通処理: Prisma インスタンス取得
const getPrisma = async () => await buildPrisma();

//プロフィール取得関数
const getUserProfile = async (userId: string) => {
  const prisma = await getPrisma();
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      receiptName: true,
      iconUrl: true,
    },
  });
};

//GET
export const GET = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser({ request });
    const userProfile = await getUserProfile(currentUser.id);

    return userProfile
      ? NextResponse.json(userProfile, { status: 200 })
      : NextResponse.json(
          { error: "ユーザーが見つかりません。" },
          { status: 404 }
        );
  } catch (e) {
    return buildError(e);
  }
};

//PUT
export const PUT = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser({ request });
    const prisma = await getPrisma();
    const data: UserProfileUpdateRequest = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
