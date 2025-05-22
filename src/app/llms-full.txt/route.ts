import { QuestionLevel, QuestionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { buildPrisma } from "@/app/_utils/prisma";

export async function GET() {
  const prisma = await buildPrisma();

  try {
    // すべての問題を取得
    const questions = await prisma.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        level: true,
        createdAt: true,
        reviewer: {
          select: {
            name: true,
          },
        },
        questions: {
          select: {
            tag: true,
          },
        },
        questionFiles: {
          select: {
            name: true,
            ext: true,
            template: true,
            exampleAnswer: true,
          },
        },
      },
    });

    // マークダウンコンテンツを生成
    const content = `# JSGym 問題一覧

このファイルはJSGymで提供されているすべての問題の一覧です。
LLMsがサイト全体の情報を把握しやすくするために提供されています。

## 問題数: ${questions.length}問

${questions
  .map((question) => {
    // 問題のタグを取得
    const tags = question.questions.map((q) => q.tag.name).join(", ");

    // ファイル情報を整形
    const files = question.questionFiles
      .map((file) => {
        return `
### ${file.name}.${file.ext.toLowerCase()}

**テンプレート:**
\`\`\`${file.ext.toLowerCase()}
${file.template}
\`\`\`

**回答例:**
\`\`\`${file.ext.toLowerCase()}
${file.exampleAnswer}
\`\`\`
`;
      })
      .join("\n");

    // 問題の詳細をマークダウン形式で出力
    return `
## ${question.title}

**ID**: ${question.id}
**作成日**: ${question.createdAt.toISOString().split("T")[0]}
**タイプ**: ${getQuestionTypeJa(question.type)}
**レベル**: ${getQuestionLevelJa(question.level)}
**レビュワー**: ${question.reviewer.name}
**タグ**: ${tags || "なし"}

### 問題文
${question.content}

### ファイル
${files}
`;
  })
  .join("\n---\n")}
`;

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating llms-full.txt:", error);
    return new NextResponse("Error generating content", { status: 500 });
  }
}

// 問題タイプの日本語表示
function getQuestionTypeJa(type: QuestionType): string {
  const typeMap: Record<QuestionType, string> = {
    JAVA_SCRIPT: "JavaScript",
    TYPE_SCRIPT: "TypeScript",
    REACT_JS: "React (JavaScript)",
    REACT_TS: "React (TypeScript)",
  };
  return typeMap[type] || type;
}

// 問題レベルの日本語表示
function getQuestionLevelJa(level: QuestionLevel): string {
  const levelMap: Record<QuestionLevel, string> = {
    BASIC: "基本",
    ADVANCED: "応用",
    REAL_WORLD: "実践",
  };
  return levelMap[level] || level;
}
