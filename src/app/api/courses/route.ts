import { NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { CoursesResponse } from "./_types/CoursesResponse";

export const GET = async () => {
  const prisma = await buildPrisma();
  try {
    const courses = await prisma.course.findMany({});

    return NextResponse.json<CoursesResponse>({ courses }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
  }
};
