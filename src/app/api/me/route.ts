import { NextRequest, NextResponse } from "next/server";
import {
  UserProfileResponse,
  UserProfileUpdateRequest,
} from "./_types/UserProfile";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

const prisma = await buildPrisma();

//GET
export const GET = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser({ request });

    // ユーザーが見つからない場合は早期リターン
    if (!currentUser) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません。" },
        { status: 404 }
      );
    }
    return NextResponse.json<UserProfileResponse>(currentUser, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};

//PUT
export const PUT = async (request: NextRequest) => {
  try {
    const currentUser = await getCurrentUser({ request });
    const data: UserProfileUpdateRequest = await request.json();
    const { name, email, receiptName, iconUrl } = data;
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        email,
        receiptName,
        iconUrl,
      },
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
