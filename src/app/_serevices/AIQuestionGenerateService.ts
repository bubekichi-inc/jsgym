import { CourseType, QuestionTagValue, Reviewer } from "@prisma/client";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { GPT_4_5 } from "../_constants/openAI";
import { buildReviewerSettingPrompt } from "../_utils/buildReviewerSettingPrompt";
import { buildPrisma } from "../_utils/prisma";

type GenerateQuestionJsonResponse = {
  title: string;
  inputCode: string;
  outputCode: string;
  content: string;
  template: string;
  level: QuestionLevel;
  exampleAnswer: string;
  tags: QuestionTagValue[];
};

export type QuestionLevel = "BASIC" | "ADVANCED" | "REAL_WORLD";

type NewType = CourseType;

export class AIQuestionGenerateService {
  private static readonly Lesson1Example = `
# 問題のレベル
BASIC

# 問題の特徴
* 1つのメソッドや短いコードで完結する基本的な問題

# 例
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
    inputCode: "2",
    outputCode: "4",
  }
`;

  private static readonly Lesson2Example = `
# 問題のレベル
ADVANCED

# 問題の特徴
* 配列の操作やオブジェクトの操作などが複合的に組み合わさった問題

# 例
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
    inputCode: "第一引数: [{ name: '太郎', age: 20 }, { name: '次郎', age: 30 }, { name: '三郎', age: 40 }], 第二引数: 30",
    outputCode: "{ name: '次郎', age: 30 }",
  }
`;

  private static readonly Lesson3Example = `
# 問題のレベル
REAL_WORLD

# 問題の特徴
* 問題が発生したストーリーがある（実際の用途を想像したいので）
* いろいろな構文の組み合わせが必要
* コードの量が多くなる

# 例
  {
    title: "イベントログ分析システムの実装",
    content:
      "あなたはEコマースサイト「TechBazaar」のフロントエンドエンジニアとして働いています。最近、マーケティングチームから「ユーザーの行動パターンをより詳細に分析したい」という要望がありました。\n\nイベントログ分析システムの核となる関数 " + "processEventLogs" + " を実装してください。この関数は生のイベントログデータを受け取り、以下の処理を行います：\n\n1. イベントを種類（type）ごとにグループ化する\n2. 各イベントタイプの発生回数をカウントする\n3. 時間帯別（朝、昼、夜）のイベント発生分布を計算する\n4. ユーザーごとの行動パターンを抽出する\n5. 非同期でのデータ処理に対応する\n6. パフォーマンスを考慮したメモ化（caching）を実装する",
    template:
      "/**\n * イベントログを処理して分析データを生成する関数\n * @param {Array} eventLogs - 生のイベントログデータ\n * @returns {Promise<Object>} 分析結果を含むオブジェクト\n */\nfunction processEventLogs(eventLogs) {\n  // 1. 非同期処理のためのPromiseを返す\n  return new Promise((resolve, reject) => {\n    try {\n      // 2. イベントを時系列でソート\n      \n      // 3. イベントタイプごとのカウントを計算\n      \n      // 4. 時間帯別の分布を計算\n      \n      // 5. ユーザーごとの行動パターンを抽出\n      \n      // 6. 商品ごとのインタラクション回数を計算\n      \n      // 7. 結果を返す\n      \n    } catch (error) {\n      reject(error);\n    }\n  });\n}\n\n// メイン処理\nasync function main() {\n  try {\n    const eventLogs = [\n      // イベントログデータをここに配置\n    ];\n    \n    console.time('処理時間');\n    const analysisResult = await processEventLogs(eventLogs);\n    console.timeEnd('処理時間');\n    \n    console.log('分析結果:', JSON.stringify(analysisResult, null, 2));\n  } catch (error) {\n    console.error('エラーが発生しました:', error);\n  }\n}\n\n// 実行\nmain();",
    example: "入力: イベントログの配列, 出力: 分析結果オブジェクト（イベントタイプ別カウント、時間帯別分布、ユーザーパターン、商品インタラクション）",
    exampleAnswer: "/**\n * イベントログを処理して分析データを生成する関数\n * @param {Array} eventLogs - 生のイベントログデータ\n * @returns {Promise<Object>} 分析結果を含むオブジェクト\n */\nfunction processEventLogs(eventLogs) {\n  // メモ化（キャッシュ）のための仕組み\n  const cache = new Map();\n  const cacheKey = JSON.stringify(eventLogs.map(log => log.id).sort());\n  \n  // キャッシュチェック\n  if (cache.has(cacheKey)) {\n    return Promise.resolve(cache.get(cacheKey));\n  }\n  \n  return new Promise((resolve, reject) => {\n    try {\n      // 1. イベントを時系列でソート\n      const sortedLogs = [...eventLogs].sort((a, b) => \n        new Date(a.timestamp) - new Date(b.timestamp)\n      );\n      \n      // 2. イベントタイプごとのカウントを計算\n      const eventsByType = sortedLogs.reduce((acc, log) => {\n        acc[log.type] = (acc[log.type] || 0) + 1;\n        return acc;\n      }, {});\n      \n      // 3. 時間帯別の分布を計算\n      const timeDistribution = sortedLogs.reduce((acc, log) => {\n        const hour = new Date(log.timestamp).getUTCHours();\n        \n        if (hour >= 6 && hour < 12) {\n          acc.morning = (acc.morning || 0) + 1;\n        } else if (hour >= 12 && hour < 18) {\n          acc.afternoon = (acc.afternoon || 0) + 1;\n        } else {\n          acc.evening = (acc.evening || 0) + 1;\n        }\n        \n        return acc;\n      }, { morning: 0, afternoon: 0, evening: 0 });\n      \n      // 4. ユーザーごとの行動パターンを抽出\n      const userLogs = {};\n      sortedLogs.forEach(log => {\n        if (!userLogs[log.userId]) {\n          userLogs[log.userId] = [];\n        }\n        userLogs[log.userId].push(log);\n      });\n      \n      const userPatterns = {};\n      Object.entries(userLogs).forEach(([userId, logs]) => {\n        const sequence = logs.map(log => log.type);\n        \n        // イベントタイプの出現回数をカウント\n        const typeCounts = sequence.reduce((acc, type) => {\n          acc[type] = (acc[type] || 0) + 1;\n          return acc;\n        }, {});\n        \n        // 最も頻繁に発生したイベントを特定\n        const mostFrequent = Object.entries(typeCounts)\n          .sort((a, b) => b[1] - a[1])[0][0];\n        \n        // コンバージョンパスを確認（ページ閲覧からカート追加まで）\n        const hasPageView = sequence.includes('pageView');\n        const hasAddToCart = sequence.includes('addToCart');\n        const conversionPath = hasPageView && hasAddToCart;\n        \n        userPatterns[userId] = {\n          sequence: [...new Set(sequence)], // 重複を除去\n          mostFrequent,\n          conversionPath\n        };\n      });\n      \n      // 5. 商品ごとのインタラクション回数を計算\n      const productInteractions = sortedLogs.reduce((acc, log) => {\n        if (log.productId) {\n          acc[log.productId] = (acc[log.productId] || 0) + 1;\n        }\n        return acc;\n      }, {});\n      \n      // 6. 結果オブジェクトを作成\n      const result = {\n        eventsByType,\n        timeDistribution,\n        userPatterns,\n        productInteractions\n      };\n      \n      // キャッシュに結果を保存\n      cache.set(cacheKey, result);\n      \n      // 結果を返す\n      resolve(result);\n      \n    } catch (error) {\n      reject(error);\n    }\n  });\n}\n\n// テスト用のイベントログデータ\nconst eventLogs = [\n  { \n    id: 'e001', \n    userId: 'user123', \n    type: 'pageView', \n    page: 'home', \n    timestamp: '2023-10-15T08:30:00Z'\n  },\n  { \n    id: 'e002', \n    userId: 'user123', \n    type: 'click', \n    element: 'product-card', \n    productId: 'prod456', \n    timestamp: '2023-10-15T08:32:00Z'\n  },\n  // 他のイベントログ...\n];\n\n// 実行\nprocessEventLogs(eventLogs).then(result => {\n  console.log('分析結果:', result);\n});",
    tags: ["FUNCTION", "OBJECT"],
    level: "HARD",
    inputCode: "const eventLogs = [
      {
        id: 'e001',
        userId: 'user123',
        type: 'pageView',
        page: 'home',
        timestamp: '2023-10-15T08:30:00Z'
      },
      {
        id: 'e002',
        userId: 'user123',
        type: 'click',
        element: 'product-card',
        productId: 'prod456',
        timestamp: '2023-10-15T08:32:00Z'
      },
      {
        id: 'e003',
        userId: 'user123',
        type: 'productView',
        productId: 'prod456',
        timestamp: '2023-10-15T08:33:00Z'
      },
      {
        id: 'e004',
        userId: 'user456',
        type: 'pageView',
        page: 'home',
        timestamp: '2023-10-15T12:15:00Z'
      },
      {
        id: 'e005',
        userId: 'user456',
        type: 'search',
        query: 'laptop',
        timestamp: '2023-10-15T12:18:00Z'
      },
      {
        id: 'e006',
        userId: 'user123',
        type: 'addToCart',
        productId: 'prod456',
        quantity: 1,
        timestamp: '2023-10-15T08:40:00Z'
      },
      {
        id: 'e007',
        userId: 'user789',
        type: 'pageView',
        page: 'products',
        timestamp: '2023-10-15T19:20:00Z'
      },
      {
        id: 'e008',
        userId: 'user789',
        type: 'productView',
        productId: 'prod789',
        timestamp: '2023-10-15T19:25:00Z'
      }
    ]",
    outputCode: "{
      "eventsByType": {
        "pageView": 3,
        "click": 1,
        "productView": 2,
        "addToCart": 1,
        "search": 1
      },
      "timeDistribution": {
        "morning": 4,
        "afternoon": 2,
        "evening": 2
      },
      "userPatterns": {
        "user123": {
          "sequence": [
            "pageView",
            "click",
            "productView",
            "addToCart"
          ],
          "mostFrequent": "pageView",
          "conversionPath": true
        },
        "user456": {
          "sequence": [
            "pageView",
            "search"
          ],
          "mostFrequent": "pageView",
          "conversionPath": false
        },
        "user789": {
          "sequence": [
            "pageView",
            "productView"
          ],
          "mostFrequent": "pageView",
          "conversionPath": false
        }
      },
      "productInteractions": {
        "prod456": 3,
        "prod789": 1
      }
    }",
  }
`;

  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  });

  private static Question = z.object({
    title: z.string(),
    inputCode: z.string(),
    outputCode: z.string(),
    template: z.string(),
    content: z.string(),
    level: z.enum(["BASIC", "ADVANCED", "REAL_WORLD"]),
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
これから、JavaScriptを自走して書けるようになるための問題です。
アプリケーションのユーザーが、その問題を解いて、提出して、判定を得ることで、学習を進めることができます。

${level === "EASY" && this.Lesson1Example}
${level === "MEDIUM" && this.Lesson2Example}
${level === "HARD" && this.Lesson3Example}

# 出力型の説明
* title: 問題のタイトル
* inputCode: 入力コード
* outputCode: 出力コード
* content: 問題の内容(何をすれば良いのか、具体的に)
* level: 問題の難易度
* template: ユーザーが回答するコードのテンプレートです。デフォルト値として表示します。#のコメント文で、次行に何を書いたら良いのかの説明をしてください。
* exampleAnswer: 模範的な解答
* tags: 問題のタグ（複数可）

# 補足
・説明は、すべて日本語でお願いします。
・以下の問題タイトルとは全く別ジャンルの問題を作ってください。
${titleList.join("\n")}`;
  }

  public static async generateQuestion({
    course,
    level,
    reviewer,
  }: {
    course: CourseType;
    level: QuestionLevel;
    reviewer: Reviewer;
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
      model: GPT_4_5,
      messages: [
        {
          role: "developer",
          content: buildReviewerSettingPrompt({ reviewer }),
        },
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
