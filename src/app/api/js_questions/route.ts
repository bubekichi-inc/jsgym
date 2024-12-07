import { buildPrisma } from "@/app/_utils/prisma";

export const GET = async () => {
  const prisma = await buildPrisma();

  try {
    const questions = await prisma.question.findMany();
    return Response.json(questions, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  }
};
