"use client";

import React from "react";
import { AnswerTable } from "./_components/AnswerTable";
import { Pagination } from "./_components/Pagination";
import { SearchFilter } from "./_components/SearchFilter";
import { useAdminAnswers } from "./_hooks/useAdminAnswers";

export default function AnswersPage() {
  const {
    answers,
    total,
    isLoading,
    queryParams,
    currentPage,
    maxPage,
    changePage,
    changeSearch,
    changeResult,
    changeSort,
    changeLimit,
    clearFilters,
  } = useAdminAnswers();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">回答一覧</h1>

      <SearchFilter
        queryParams={queryParams}
        changeSearch={changeSearch}
        changeResult={changeResult}
        clearFilters={clearFilters}
      />

      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <AnswerTable
          answers={answers}
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
    </div>
  );
}
