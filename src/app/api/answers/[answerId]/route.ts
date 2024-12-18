import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildError } from "../../_utils/buildError";
interface Props {
  params: Promise<{
    answerId: string;
  }>;
}

export const DELETE = async (request: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();

  const { answerId } = await params;
  try {
    const { id: currentUserId } = await getCurrentUser({ request });
    await prisma.answer.delete({
      where: {
        id: answerId,
        userId: currentUserId,
      },
    });
    return NextResponse.json({ message: "deleted!" }, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
