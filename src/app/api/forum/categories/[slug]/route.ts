import { NextRequest, NextResponse } from "next/server";

// 特定のカテゴリを取得するGETエンドポイント
export async function GET(
  request: NextRequest, 
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  try {
    return NextResponse.json({
      category: {
        id: "sample-id",
        slug: slug,
        title: "Sample Title",
        description: "Sample Description",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("カテゴリの取得に失敗しました:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
