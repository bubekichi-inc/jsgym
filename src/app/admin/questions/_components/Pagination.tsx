"use client";

import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { AdminQuestionsQuery } from "@/app/api/admin/questions/route";

interface PaginationProps {
  currentPage: number;
  maxPage: number;
  changePage: (page: number) => void;
  changeLimit: (limit: string) => void;
  total: number;
  queryParams: AdminQuestionsQuery;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  maxPage,
  changePage,
  changeLimit,
  total,
  queryParams,
}) => {
  const createPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    // 1ページ目は常に表示
    pageNumbers.push(1);

    // 現在のページの前後に表示するページ番号を決定
    const startPage = Math.max(
      2,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(maxPage - 1, startPage + maxVisiblePages - 2);

    // 「...」を表示するかの判定
    if (startPage > 2) {
      pageNumbers.push("...");
    }

    // 表示するページ番号を追加
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // 「...」を表示するかの判定
    if (endPage < maxPage - 1) {
      pageNumbers.push("...");
    }

    // 最大ページが1より大きければ、最大ページを表示
    if (maxPage > 1) {
      pageNumbers.push(maxPage);
    }

    return pageNumbers;
  };

  if (maxPage <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center">
        <p className="text-sm text-gray-700">
          <span className="font-medium">{total}</span> 件中
          <span className="font-medium">
            {(currentPage - 1) * parseInt(queryParams.limit || "10") + 1}
          </span>{" "}
          -
          <span className="font-medium">
            {Math.min(currentPage * parseInt(queryParams.limit || "10"), total)}
          </span>{" "}
          件を表示
        </p>
        <div className="ml-4">
          <select
            value={queryParams.limit}
            onChange={(e) => changeLimit(e.target.value)}
            className="rounded-md border border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="10">10件</option>
            <option value="25">25件</option>
            <option value="50">50件</option>
            <option value="100">100件</option>
          </select>
        </div>
      </div>

      <div>
        <nav
          className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-l-md border border-gray-300 p-2 text-sm font-medium ${
              currentPage === 1
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <span className="sr-only">前へ</span>
            <FontAwesomeIcon icon={faChevronLeft} className="size-4" />
          </button>

          {createPageNumbers().map((pageNumber, index) => (
            <React.Fragment key={index}>
              {typeof pageNumber === "number" ? (
                <button
                  onClick={() => changePage(pageNumber)}
                  className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium ${
                    currentPage === pageNumber
                      ? "z-10 border-blue-500 bg-blue-50 text-blue-600"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              ) : (
                <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                  {pageNumber}
                </span>
              )}
            </React.Fragment>
          ))}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === maxPage}
            className={`relative inline-flex items-center rounded-r-md border border-gray-300 p-2 text-sm font-medium ${
              currentPage === maxPage
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <span className="sr-only">次へ</span>
            <FontAwesomeIcon icon={faChevronRight} className="size-4" />
          </button>
        </nav>
      </div>
    </div>
  );
};
