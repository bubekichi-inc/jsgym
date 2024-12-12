import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";

interface Props {
  params: Promise<{
    id: string;
  }>;
}
export const DELETE = async (req: NextRequest, { params }: Props) => {
  const prisma = await buildPrisma();
  const { id } = await params;
  try {
    await prisma.answer.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ message: "deleted!" }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
