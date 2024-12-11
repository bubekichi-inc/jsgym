import { NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";

export const POST = async () => {
  const prisma = await buildPrisma();
  try {
    const user = await prisma.user.create({
      data: {
        supabaseUserId: "test2",
      },
    });

    return NextResponse.json(
      {
        user,
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
