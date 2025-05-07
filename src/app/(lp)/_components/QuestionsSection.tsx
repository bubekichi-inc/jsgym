"use client";

import { QuestionType, UserQuestionStatus } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QuestionTabs } from "@/app/_components/QuestionTabs";
import { Questions } from "@/app/_components/Questions";
import { QuestionsSkelton } from "@/app/_components/QuestionsSkelton";
import { SectionTitle } from "@/app/_components/SectionTitle";
import { useQuestions } from "@/app/_hooks/useQuestions";
import { QuestionLevel } from "@/app/_serevices/JsQuestionGenerateService";

// 拡張ステータス型
type ExtendedStatus = UserQuestionStatus | "NOT_SUBMITTED" | "ALL";
interface Props {
  limit: number;
}

export const QuestionsSection: React.FC<Props> = ({ limit }) => {
  const searchParams = useSearchParams();

  // URLクエリパラメータから初期状態を取得
  const initialTitle = searchParams.get("title") || "";
  const initialLevel =
    (searchParams.get("level") as QuestionLevel | "ALL") || "ALL";
  const initialType =
    (searchParams.get("type") as QuestionType | "ALL") || "ALL";
  const initialStatus = (searchParams.get("status") as ExtendedStatus) || "ALL";

  const {
    questions,
    selectedLevel,
    selectedStatus,
    isLoading,
    handleLevelChange,
    handleStatusChange,
    selectedType,
    handleTypeChange,
  } = useQuestions({
    limit,
    initialTitle,
    initialType,
    initialLevel,
    initialStatus,
  });

  return (
    <section className="py-8 md:pb-[52px] md:pt-20">
      <div className="mx-auto flex flex-col items-center justify-center space-y-4 px-6 text-center">
        <div className="grid gap-y-3 text-left md:gap-y-4 md:text-center">
          <SectionTitle>JS Gymでは、毎日新しい問題が追加されます</SectionTitle>
          <p className="text-base/[1.5] text-gray-500 md:text-xl/[1.5]">
            より実務に特化した、幅広いレベルの問題を出題。
          </p>
        </div>
      </div>

      <QuestionTabs
        selectedType={selectedType}
        handleTypeChange={handleTypeChange}
        selectedLevel={selectedLevel}
        handleLevelChange={handleLevelChange}
        selectedStatus={selectedStatus}
        handleStatusChange={handleStatusChange}
      />

      {/* 問題一覧 */}
      {isLoading ? (
        <QuestionsSkelton />
      ) : (
        <div className="px-6">
          <div className="mt-8 md:mt-10">
            <Questions questions={questions} isLoading={isLoading} />
          </div>

          <div className="flex justify-center">
            <Link
              href="/q"
              className="mt-8 rounded-[5px] border border-gray-500 bg-white px-6 py-2.5 text-[1.375rem]/[1] font-bold text-gray-500 transition-colors hover:bg-gray-500 hover:text-white md:mt-16"
            >
              もっと見る
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};
