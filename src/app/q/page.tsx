"use client";

import { Footer } from "../_components/FooterTemp";
import { QuestionTabs } from "../_components/QuestionTabs";
import { SectionTitle } from "../_components/SectionTitle";
import { Pagination } from "./_components/Pagination";
import { Questions } from "@/app/_components/Questions";
import { QuestionsSkelton } from "@/app/_components/QuestionsSkelton";
import { useQuestions } from "@/app/_hooks/useQuestions";

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

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-[71px] pt-[50px] md:pb-[142px] md:pt-[100px]">
        <div className="grid gap-y-3 px-6 text-left md:gap-y-4 md:text-center">
          <SectionTitle>自分のレベルに合わせて挑戦してみよう</SectionTitle>
          <p className="text-base/[1.5] text-gray-500 md:text-xl/[1.5]">
            より実務に特化した、幅広いレベルの問題を出題。
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
