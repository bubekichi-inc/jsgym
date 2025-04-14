"use client";

import React from "react";
import { AnswerFileTable } from "./_components/AnswerFileTable";
import { Pagination } from "./_components/Pagination";
import { useAdminAnswerFiles } from "./_hooks/useAdminAnswerFiles";

export default function AnswerFilesPage() {
  const {
    answerFiles,
    total,
    isLoading,
    queryParams,
    currentPage,
    maxPage,
    changePage,
    changeSort,
    changeLimit,
  } = useAdminAnswerFiles();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">回答ファイル一覧</h1>
      </div>

      <AnswerFileTable
        answerFiles={answerFiles}
        queryParams={queryParams}
        changeSort={changeSort}
        isLoading={isLoading}
      />

      <Pagination
        currentPage={currentPage}
        maxPage={maxPage}
        changePage={changePage}
        changeLimit={changeLimit}
        total={total}
        queryParams={queryParams}
      />
    </div>
  );
}
