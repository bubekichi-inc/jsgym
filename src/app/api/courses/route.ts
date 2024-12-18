import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { CoursesResponse } from "./_types/CoursesResponse";
import { getUser } from "../_utils/getUser";

export const GET = async (req: NextRequest) => {
  const prisma = await buildPrisma();
  const token = req.headers.get("Authorization") ?? "";
  try {
    await getUser({ token });
    const courses = await prisma.course.findMany({});
    return NextResponse.json<CoursesResponse>({ courses }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "Unauthorized") {
        return NextResponse.json({ error: e.message }, { status: 401 });
      }
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
