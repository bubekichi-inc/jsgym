"use client";

import Link from "next/link";
import { QuestionCard } from "@/app/_components/QuestionCard";
import { useQuestions } from "@/app/_hooks/useQuestions";

interface Props {
  limit: number;
}

export const Questions: React.FC<Props> = ({ limit }) => {
  const { questions, hasMore, isLoading, handleLoadMore } = useQuestions({
    limit,
  });

  return (
    <section className="mx-auto max-w-screen-xl bg-gray-100/50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              新しい問題
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              毎日新しい問題が追加されます。自分のレベルに合わせて挑戦してみましょう。
            </p>
          </div>
        </div>

        {/* 問題一覧 */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>

          {questions.length === 0 && !isLoading && (
            <div className="mt-8 text-center text-gray-500">
              問題が見つかりませんでした。検索条件を変更してみてください。
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Link
            href="/q"
            className="mt-8 rounded border border-textMain px-4 py-2 duration-150 hover:bg-textMain hover:text-white"
          >
            もっと見る
          </Link>
        </div>
      </div>
    </section>
  );
};
