import { NextRequest, NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";
import { CoursesResponse } from "./_types/CoursesResponse";
import { getCurrentUser } from "../_utils/getCurrentUser";
import { buildError } from "../_utils/buildError";

export const GET = async (request: NextRequest) => {
  const prisma = await buildPrisma();
  try {
    await getCurrentUser({ request });
    const courses = await prisma.course.findMany({});
    return NextResponse.json<CoursesResponse>({ courses }, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
