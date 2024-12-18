import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { getUser } from "../../_utils/getUser";
interface Props {
  params: Promise<{
    answerId: string;
  }>;
}

export const DELETE = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const token = req.headers.get("Authorization") ?? "";
  const { answerId } = await params;
  try {
    await getUser({ token });
    await prisma.answer.delete({
      where: {
        id: answerId,
      },
    });
    return NextResponse.json({ message: "deleted!" }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "Unauthorized") {
        return NextResponse.json({ error: e.message }, { status: 401 });
      }
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
