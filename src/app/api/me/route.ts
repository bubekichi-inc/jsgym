import { NextRequest, NextResponse } from "next/server";
import { UserProfileUpdateRequest } from "./_types/UserProfile";
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
    const prisma = await buildPrisma();
    const data: UserProfileUpdateRequest = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: data.name,
        email: data.email,
        receiptName: data.receiptName,
        iconUrl: data.iconUrl,
      },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
// export const PUT = async (request: NextRequest) => {
//   try {
//     const currentUser = await getCurrentUser({ request });
//     const prisma = await buildPrisma();
//     const data = await request.json();

//     // 更新するデータオブジェクトを作成
//     const updateData = {
//       ...(data.name !== undefined && { name: data.name }),
//       ...(data.email !== undefined && { email: data.email }),
//       ...(data.receiptName !== undefined && { receiptName: data.receiptName }),
//       ...(data.iconUrl !== undefined && { iconUrl: data.iconUrl }),
//     };

//     // データオブジェクトが空でない場合のみ更新を実行
//     if (Object.keys(updateData).length > 0) {
//       const updatedUser = await prisma.user.update({
//         where: { id: currentUser.id },
//         data: updateData,
//       });
//       return NextResponse.json(updatedUser, { status: 200 });
//     } else {
//       return NextResponse.json(
//         { message: "No fields to update" },
//         { status: 400 }
//       );
//     }
//   } catch (e) {
//     return buildError(e);
//   }
// };
