import { NextRequest, NextResponse } from "next/server";
import { Draft } from "../../_types/Draft";
import { buildPrisma } from "@/app/_utils/prisma";
import { buildError } from "@/app/api/_utils/buildError";
import { getCurrentUser } from "@/app/api/_utils/getCurrentUser";

interface Props {
  params: Promise<{
    questionId: string;
  }>;
}

export const DELETE = async (request: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { questionId } = await params;

  try {
    const { id: userId } = await getCurrentUser({ request });

    await prisma.userQuestion.delete({
      where: {
        userId_questionId: { userId, questionId },
      },
    });

    return NextResponse.json<Draft>({ answer: "success!" }, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};
