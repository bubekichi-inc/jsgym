import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { supabase } from "@/app/_utils/supabase";
import { buildError } from "@/app/api/_utils/buildError";

export const POST = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  try {
    const token = request.headers.get("Authorization") ?? "";
    const body = await request.json();
    const { type } = body;
    const { data } = await supabase.auth.getUser(token);
    const currentUser = data.user
      ? await prisma.user.findUnique({
          where: {
            supabaseUserId: data.user.id,
          },
        })
      : null;

    await prisma.click.create({
      data: {
        type,
        userId: currentUser?.id,
      },
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (e) {
    return await buildError(e);
  }
};
