import { CourseType, QuestionTagValue } from "@prisma/client";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { OPENAI_MODEL } from "../_constants/openAI";
import { buildPrisma } from "../_utils/prisma";

type GenerateQuestionJsonResponse = {
  title: string;
  inputOutputExample: string;
  content: string;
  template: string;
  level: QuestionLevel;
  exampleAnswer: string;
  tags: QuestionTagValue[];
};

export type QuestionLevel = "EASY" | "MEDIUM" | "HARD";

type NewType = CourseType;

export class AIQuestionGenerateService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

  private static Question = z.object({
    title: z.string(),
    inputOutputExample: z.string(),
    template: z.string(),
    content: z.string(),
    level: z.enum(["EASY", "MEDIUM", "HARD"]),
    exampleAnswer: z.string(),
    tags: z.array(z.enum(["VALUE", "ARRAY", "OBJECT", "FUNCTION", "CLASS"])),
  });

  public static buildPrompt({
    course,
    level,
    titleList,
  }: {
    course: NewType;
    level: QuestionLevel;
    titleList: string[];
  }) {
    return `
# 概要
${course}の問題を作成してください。
これから、JavaScriptを自走して描けるようになるための問題です。
アプリケーションのユーザーが、その問題を解いて、提出して、判定を得ることで、学習を進めることができます。

# 問題のレベル
${level}

# 出力型の説明
* title: 問題のタイトル
* inputOutputExample: 入力と出力の例
* content: 問題の内容(何をすれば良いのか、具体的に)
* level: 問題の難易度
* template: ユーザーが回答するコードのテンプレートです。デフォルト値として表示します。#のコメント文で、次行に何を書いたら良いのかの説明をしてください。
* exampleAnswer: 模範的な解答
* tags: 問題のタグ（複数可）

# 出力例
## 初級の例
  {
    content:
      "引数として受け取った数値を2倍にして返す関数を作成して実行してください。console.logで実行結果を表示してください。",
    template:
      "// ① 引数となる定数の定義\nconst number = 2;\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
    title: "数値を2倍にする関数",
    example: "引数: 2, 返り値: 4",
    exampleAnswer: "const double = num => num * 2;
                    const number = 2;
                    console.log(double(number)); // 4",
    tags: ["FUNCTION"],
    level: "EASY",
    inputOutputExample: "引数: 2, 返り値: 4",
  }

## 中級の例
 {
    content:
      "名前と年齢オブジェクトの配列を受け取り、ageが第二引数で受け取った数字と一致するオブジェクトを返す関数を作成してください。console.logで実行結果を表示してください。",
    template:
      "// ① 引数となる定数の定義\nconst array = [{ name: '太郎', age: 20 }, { name: '次郎', age: 30 }, { name: '三郎', age: 40 }];\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
    title: "一致するオブジェクトの検索",
    example:
      "第一引数: [{ name: '太郎', age: 20 }, { name: '次郎', age: 30 }, { name: '三郎', age: 40 }], 第二引数: 30, 返り値: { name: '次郎', age: 30 }",
    exampleAnswer: "const findByAge = (arr, age) => arr.find(obj => obj.age === age);
                    const people = [{ name: '太郎', age: 20 }, { name: '次郎', age: 30 }, { name: '三郎', age: 40 }];
                    console.log(findByAge(people, 30)); // { name: '次郎', age: 30 }",
    tags: ["FUNCTION", "OBJECT"],
    level: "MEDIUM",
    inputOutputExample: "第一引数: [{ name: '太郎', age: 20 }, { name: '次郎', age: 30 }, { name: '三郎', age: 40 }], 第二引数: 30, 返り値: { name: '次郎', age: 30 }",
  }

## 上級の例
  {
    content:
      "引数として受け取った数値を2倍にして返す関数を作成して実行してください。console.logで実行結果を表示してください。",
    template:
      "// ① 引数となる定数の定義\nconst number = 2;\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
    title: "数値を2倍にする関数",
    example: "引数: 2, 返り値: 4",
    exampleAnswer: "const double = num => num * 2;
                    const number = 2;
                    console.log(double(number)); // 4",
    tags: ["FUNCTION", "OBJECT"],
    level: "HARD",
    inputOutputExample: "引数: 2, 返り値: 4",
  }

# 補足
・説明は、すべて日本語でお願いします。
・以下の問題タイトルとは全く別ジャンルの問題を作ってください。
${titleList.join("\n")}`;
  }

  public static async generateQuestion({
    course,
    level,
  }: {
    course: CourseType;
    level: QuestionLevel;
  }): Promise<GenerateQuestionJsonResponse | null> {
    const prisma = await buildPrisma();
    const questions = await prisma.question.findMany({
      select: {
        title: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    const titleList = questions.map((question) => `  - ${question.title}`);

    const response = await this.openai.beta.chat.completions.parse({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "user",
          content: this.buildPrompt({ course, level, titleList }),
        },
      ],
      temperature: 1,
      max_tokens: 16384,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: zodResponseFormat(this.Question, "event"),
    });

    const content = response.choices[0].message.parsed;

    return content;
  }
}
