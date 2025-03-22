import { buildPrisma } from "../src/app/_utils/prisma";
// import { AIreviewers, Reviewer } from "./data/aiReviewers";
// import { QuestionTag, questionTags } from "./data/questionTags";

export type Question = {
  id: number;
  content: string;
  template: string;
  title: string;
  example: string;
  exampleAnswer: string;
};

const seedData = async () => {
  const prisma = await buildPrisma();

  // 全てのquestionに対してquestionFileを生成
  // const createQuestionFiles = async () => {
  //   const questions = await prisma.question.findMany();
  //   console.log(`${questions.length}個の問題に対してファイルを生成します...`);

  //   for (const question of questions) {
  //     // 既存のquestionFileを確認
  //     const existingFile = await prisma.questionFile.findFirst({
  //       where: {
  //         questionId: question.id,
  //         name: "index",
  //         ext: "JS",
  //       },
  //     });

  //     // 既存のファイルがなければ作成
  //     if (!existingFile) {
  //       await prisma.questionFile.create({
  //         data: {
  //           questionId: question.id,
  //           name: "index",
  //           ext: "JS",
  //           template: question.template || "// デフォルトのテンプレートコード",
  //           exampleAnswer:
  //             question.exampleAnswer || "// デフォルトの回答コード",
  //         },
  //       });
  //       console.log(`問題ID: ${question.id} にファイルを作成しました`);
  //     } else {
  //       console.log(`問題ID: ${question.id} には既にファイルが存在します`);
  //     }
  //   }

  //   console.log("ファイル生成が完了しました");
  // };

  // 全てのanswerに対してanswerFileを生成
  const createAnswerFiles = async () => {
    const answers = await prisma.answer.findMany({
      where: {
        answerFiles: {
          none: {},
        },
      },
    });
    console.log(`${answers.length}個の回答に対してファイルを生成します...`);

    for (const answer of answers) {
      // 既存のanswerFileを確認
      const existingFile = await prisma.answerFile.findFirst({
        where: {
          answerId: answer.id,
          name: "index",
          ext: "JS",
        },
      });

      // 既存のファイルがなければ作成
      if (!existingFile) {
        await prisma.answerFile.create({
          data: {
            answerId: answer.id,
            name: "index",
            ext: "JS",
            content: answer.answer || "// デフォルトの回答コード",
          },
        });
        console.log(`回答ID: ${answer.id} にファイルを作成しました`);
      } else {
        console.log(`回答ID: ${answer.id} には既にファイルが存在します`);
      }
    }

    console.log("回答ファイル生成が完了しました");
  };

  try {
    // await createQuestionFiles();
    await createAnswerFiles();
  } catch (error) {
    console.error(`QuestionFile生成中にエラーが発生しました: ${error}`);
  }

  // const upsertReviewers = async (reviewers: Reviewer[]) => {
  //   await Promise.all(
  //     reviewers.map((reviewer) =>
  //       prisma.reviewer.upsert({
  //         where: { id: reviewer.id },
  //         create: reviewer,
  //         update: reviewer,
  //       })
  //     )
  //   );
  // };

  // const upsertQuestionTags = async (questionTags: QuestionTag[]) => {
  //   await Promise.all(
  //     questionTags.map((questionTag) =>
  //       prisma.questionTag.upsert({
  //         where: { id: questionTag.id },
  //         create: questionTag,
  //         update: questionTag,
  //       })
  //     )
  //   );
  // };

  // try {
  //   await upsertReviewers(AIreviewers);
  //   await upsertQuestionTags(questionTags);
  // } catch (error) {
  //   console.error(`エラー発生${error}`);
  // } finally {
  //   await prisma.$disconnect();
  // }
};

seedData();

// 以下、以前のコード
// import { buildPrisma } from "../src/app/_utils/prisma";
// import { AIreviewers, Reviewer } from "./data/aiReviewers";
// import { QuestionTag, questionTags } from "./data/questionTags";

// export type Question = {
//   id: number;
//   content: string;
//   template: string;
//   title: string;
//   example: string;
//   exampleAnswer: string;
// };

// const seedData = async () => {
//   const prisma = await buildPrisma();

//   const upsertReviewers = async (reviewers: Reviewer[]) => {
//     await Promise.all(
//       reviewers.map((reviewer) =>
//         prisma.reviewer.upsert({
//           where: { id: reviewer.id },
//           create: reviewer,
//           update: reviewer,
//         })
//       )
//     );
//   };

//   const upsertQuestionTags = async (questionTags: QuestionTag[]) => {
//     await Promise.all(
//       questionTags.map((questionTag) =>
//         prisma.questionTag.upsert({
//           where: { id: questionTag.id },
//           create: questionTag,
//           update: questionTag,
//         })
//       )
//     );
//   };

//   try {
//     await upsertReviewers(AIreviewers);
//     await upsertQuestionTags(questionTags);
//   } catch (error) {
//     console.error(`エラー発生${error}`);
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// seedData();
