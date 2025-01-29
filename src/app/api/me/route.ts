import { NextRequest, NextResponse } from "next/server";
import {
  UserProfileResponse,
  UserProfileUpdateRequest,
} from "./_types/UserProfile";
import { api } from "@/app/_utils/api";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  try {
    const currentUser = await getCurrentUser({ request });
    const userProfile = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        receiptName: true,
        iconUrl: true,
      },
    });

    if (!userProfile) {
      throw new Error("ユーザーが見つかりません。");
    }
    return NextResponse.json(userProfile, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser({ request });
    const data: UserProfileUpdateRequest = await request.json();
    // ユーザー情報を更新
    const updatedUser = await api.put<
      UserProfileUpdateRequest,
      UserProfileResponse
    >(`/api/oauth/google/${currentUser.id}`, data);

    return NextResponse.json<UserProfileResponse>(updatedUser, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
