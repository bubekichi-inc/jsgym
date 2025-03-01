import { NextResponse } from "next/server";
import { buildError } from "../../_utils/buildError";

export const dynamic = "force-dynamic";

export const GET = async () => {
  // const prisma = await buildPrisma();
  try {
    console.log("generate_questions");
    return NextResponse.json({ message: "success." }, { status: 200 });
  } catch (e) {
    return buildError(e);
  }
};
