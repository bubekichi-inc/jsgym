"use client";

import { Footer } from "../_components/Footer";
import { QuestionTabs } from "../_components/QuestionTabs";
import { SectionTitle } from "../_components/SectionTitle";
import { Pagination } from "./_components/Pagination";
import { Questions } from "@/app/_components/Questions";
import { QuestionsSkelton } from "@/app/_components/QuestionsSkelton";
import { useQuestions } from "@/app/_hooks/useQuestions";
import { useEffect } from "react";

export default function Page() {
  const {
    questions,
    selectedLevel,
    selectedStatus,
    isLoading,
    handleLevelChange,
    handleStatusChange,
    selectedType,
    handleTypeChange,
    totalPages,
    currentPage,
    handlePageChange,
  } = useQuestions({});

  // ページアクセス時にフォーカスを設定（アクセシビリティ向上）
  useEffect(() => {
    document.title = "問題一覧 - JSGym";
    const mainElement = document.querySelector("main");
    mainElement?.focus();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <main
        className="flex-1 pb-[71px] pt-[50px] md:pb-[142px] md:pt-[100px]"
        tabIndex={-1}
        aria-label="問題一覧ページ"
      >
        <div className="grid gap-y-3 px-6 text-left md:gap-y-4 md:text-center">
          <SectionTitle>自分のレベルに合わせて挑戦してみよう</SectionTitle>
          <p className="text-base/[1.5] text-gray-500 md:text-xl/[1.5]">
            より実務に特化した、幅広いレベルの問題を出題。
            {questions.length > 0 && (
              <span className="ml-2 font-semibold text-blue-600">
                {questions.length}件の問題が見つかりました
              </span>
            )}
          </p>
        </div>

        <QuestionTabs
          selectedType={selectedType}
          handleTypeChange={handleTypeChange}
          selectedLevel={selectedLevel}
          handleLevelChange={handleLevelChange}
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
        />

        {isLoading ? (
          <QuestionsSkelton />
        ) : (
          <div className="px-6">
            <div className="mt-8 md:mt-10">
              <Questions questions={questions} isLoading={isLoading} />
            </div>
            {questions.length !== 0 && totalPages > 1 && (
              <Pagination
                pageCount={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
