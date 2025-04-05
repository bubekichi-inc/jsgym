import { UserQuestionStatus } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

export type CourseResponse = {
  course: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string | null;
  };
  lessons: {
    id: string;
    title: string;
    description: string;
    questions: {
      id: string;
      title: string;
      content: string;
      level: string;
      type: string;
      userQuestionStatus: UserQuestionStatus | null;
    }[];
  }[];
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const prisma = await buildPrisma();

    // ユーザー情報の取得を試みる（認証エラーの場合はnullとして処理）
    let currentUser = null;
    try {
      currentUser = await getCurrentUser({ request });
    } catch {
      // 認証情報がない場合は匿名ユーザーとして処理を続行
      console.log("Anonymous user accessing course details");
    }

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: {
          include: {
            questions: {
              select: {
                id: true,
                title: true,
                content: true,
                level: true,
                type: true,
                userQuestions: currentUser
                  ? {
                      where: {
                        userId: currentUser.id,
                      },
                      select: {
                        status: true,
                      },
                      take: 1,
                    }
                  : undefined,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "コースが見つかりません" },
        { status: 404 }
      );
    }

    const response: CourseResponse = {
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl,
      },
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        questions: lesson.questions.map((question) => ({
          id: question.id,
          title: question.title,
          content: question.content,
          level: question.level,
          type: question.type,
          userQuestionStatus:
            question.userQuestions && question.userQuestions.length > 0
              ? question.userQuestions[0].status
              : null,
        })),
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("コース詳細取得中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "コース詳細の取得に失敗しました" },
      { status: 500 }
    );
  }
}
