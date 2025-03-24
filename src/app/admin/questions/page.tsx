"use client";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { Pagination } from "./_components/Pagination";
import { QuestionTable } from "./_components/QuestionTable";
import { SearchFilter } from "./_components/SearchFilter";
import { useAdminQuestions } from "@/app/admin/questions/_hooks/useAdminQuestions";

export default function QuestionsPage() {
  const adminQuestionsData = useAdminQuestions();
  const {
    questions,
    total,
    isLoading,
    queryParams,
    currentPage,
    maxPage,
    changePage,
    changeSearch,
    changeLevel,
    changeType,
    changeSort,
    changeLimit,
    clearFilters,
  } = adminQuestionsData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">問題一覧</h1>
        <Link
          href="/admin/questions/new"
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          新規作成
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <SearchFilter
          queryParams={queryParams}
          changeSearch={changeSearch}
          changeLevel={changeLevel}
          changeType={changeType}
          clearFilters={clearFilters}
        />
        <QuestionTable
          questions={questions}
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
