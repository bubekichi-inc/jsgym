import { CourseType } from "@prisma/client";
//相対パスにしないと認識されない
import { buildPrisma } from "../src/app/_utils/prisma";

type Course = {
  id: number;
  name: CourseType;
};
type Lesson = {
  id: number;
  name: string;
  courseId: number;
};
type Question = {
  id: number;
  lessonId: number;
  content: string;
  template: string;
  title: string;
  example: string;
};
type TableType =
  | {
      name: "course";
      data: Course[];
    }
  | {
      name: "lesson";
      data: Lesson[];
    }
  | {
      name: "question";
      data: Question[];
    };

const createData = async () => {
  const prisma = await buildPrisma();

  const upsertRecords = async ({ updateTable }: { updateTable: TableType }) => {
    switch (updateTable.name) {
      case "course":
        await Promise.all(
          updateTable.data.map(course =>
            prisma.course.upsert({
              where: { id: course.id },
              create: course,
              update: course,
            })
          )
        );
        break;
      case "lesson":
        await Promise.all(
          updateTable.data.map(lesson =>
            prisma.lesson.upsert({
              where: { id: lesson.id },
              create: lesson,
              update: lesson,
            })
          )
        );
        break;
      case "question":
        await Promise.all(
          updateTable.data.map(question =>
            prisma.question.upsert({
              where: { id: question.id },
              create: question,
              update: question,
            })
          )
        );
    }
  };

  const courses = [{ id: 1, name: CourseType.JAVA_SCRIPT }];
  const lessons = [
    {
      id: 1,
      name: "初級",
      courseId: 1,
    },
  ];
  const questions = [
    {
      id: 1,
      lessonId: 1,
      content:
        "引数として受け取った数値を2倍にして返す関数を作成して実行してください。console.logで実行結果を表示してください。",
      template:
        "// ① 引数となる定数の定義\nconst number = 2;\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
      title: "数値を2倍にする関数",
      example: "引数: 2, 返り値: 4",
    },
    {
      id: 2,
      lessonId: 1,
      content:
        "最大値を返す関数を作成して実行してください。console.logで実行結果を表示してください",
      template:
        "// ① 引数となる定数の定義\nconst array = [1, 3, 2, 5, 4];\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
      title: "最大値を求める関数",
      example: "引数: 1, 3, 2, 5, 4, 返り値: 5",
    },
    {
      id: 3,
      lessonId: 1,
      content:
        "配列を引数として受け取り、偶数のみを返す関数を作成して実行してください。console.logで実行結果を表示してください",
      template:
        "// ① 引数となる定数の定義\nconst array = [1, 2, 3, 4, 5, 6];\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
      title: "偶数をフィルタリングする関数",
      example: "引数: [1, 2, 3, 4, 5, 6], 返り値: [2, 4, 6]",
    },
    {
      id: 4,
      lessonId: 1,
      content:
        "配列内の重複を除去する関数を作成してください。console.logで実行結果を表示してください。",
      template:
        "// ① 引数となる定数の定義\nconst array = [1, 2, 3, 2, 4, 5, 6, 5, 6];\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
      title: "配列の重複を除去する関数",
      example: "引数: [1, 2, 3, 2, 4, 5, 6, 5, 6], 返り値: [1, 2, 3, 4, 5, 6]",
    },
    {
      id: 5,
      lessonId: 1,
      content:
        "テンプレートリテラルを使用して、引数で受け取った名前を元に「こんにちは、○○さん」と出力する関数を作成してください。console.logで実行結果を表示してください。",
      template:
        "// ① 引数となる定数の定義\nconst name = '太郎';\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
      title: "テンプレートリテラル",
      example: "引数: '太郎', 出力: こんにちは、太郎さん",
    },
    {
      id: 6,
      lessonId: 1,
      content:
        "配列を引数として受け取り、各要素を2倍にした新しい配列を返す関数を作成してください。console.logで実行結果を表示してください。",
      template:
        "// ① 引数となる定数の定義\nconst array = [1, 2, 3];\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
      title: "配列の要素を2倍にする関数",
      example: "引数: [1, 2, 3], 返り値: [2, 4, 6]",
    },
    {
      id: 7,
      lessonId: 1,
      content:
        "文字列の配列を受け取り、index番号を付けたオブジェクトを返す関数を作成してください。console.logで実行結果を表示してください。",
      template:
        "// ① 引数となる定数の定義\nconst array = ['a', 'b', 'c'];\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
      title: "オブジェクトを返す関数",
      example:
        "引数: ['a', 'b', 'c'], 返り値: [{ index: 0, value: 'a' }, { index: 1, value: 'b' }, { index: 2, value: 'c' }]",
    },
    {
      id: 8,
      lessonId: 1,
      content:
        "名前と年齢オブジェクトの配列を受け取り、ageが第二引数で受け取った数字と一致するオブジェクトを返す関数を作成してください。console.logで実行結果を表示してください。",
      template:
        "// ① 引数となる定数の定義\nconst array = [{ name: '太郎', age: 20 }, { name: '次郎', age: 30 }, { name: '三郎', age: 40 }];\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
      title: "一致するオブジェクトの検索",
      example:
        "第一引数: [{ name: '太郎', age: 20 }, { name: '次郎', age: 30 }, { name: '三郎', age: 40 }], 第二引数: 30, 返り値: { name: '次郎', age: 30 }",
    },
    {
      id: 9,
      lessonId: 1,
      content:
        "配列を引数として受け取り、偶数のみをフィルタリングし、その後各要素を2倍にした新しい配列を返す関数を作成してください。console.logで実行結果を表示してください。",
      template:
        "// ① 引数となる定数の定義\nconst array = [1, 2, 3, 4, 5, 6];\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
      title: "偶数を2倍にする関数",
      example: "引数: [1, 2, 3, 4, 5, 6], 返り値: [4, 8, 12]",
    },
    {
      id: 10,
      lessonId: 1,
      content:
        "配列を引数として受け取り、各要素を2倍にし、その後偶数のみをフィルタリングし、最後に要素を昇順にソートした新しい配列を返す関数を作成してください。console.logで実行結果を表示してください。",
      template:
        "// ① 引数となる定数の定義\nconst array = [1, 2, 3, 4, 5, 6];\n\n// ② お題を満たす関数の定義\n// ここに関数定義のコードを書いてください。\n\n// ③ 関数の実行\n// ここに関数定義のコードを書いてください。 ",
      title: "ソートした配列の作成",
      example: "引数: [1, 2, 3, 4, 5, 6], 返り値: [2, 4, 6, 8, 10, 12]",
    },
  ];

  try {
    await upsertRecords({ updateTable: { name: "course", data: courses } });
    await upsertRecords({ updateTable: { name: "lesson", data: lessons } });
    await upsertRecords({ updateTable: { name: "question", data: questions } });
  } catch (error) {
    console.error(`エラー発生${error}`);
  } finally {
    await prisma.$disconnect();
  }
};

createData();
