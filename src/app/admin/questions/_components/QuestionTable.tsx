"use client";

import {
  faBookmark,
  faUsers,
  faSort,
  faSortUp,
  faSortDown,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import {
  AdminQuestionsQuery,
  AdminQuestionsResponse,
} from "@/app/api/admin/questions/route";

interface QuestionTableProps {
  questions: AdminQuestionsResponse["questions"];
  queryParams: AdminQuestionsQuery;
  changeSort: (sortBy: string, sortOrder?: "asc" | "desc") => void;
  isLoading: boolean;
}

export const QuestionTable: React.FC<QuestionTableProps> = ({
  questions,
  queryParams,
  changeSort,
  isLoading,
}) => {
  // ソートアイコンを表示
  const renderSortIcon = (field: string) => {
    if (queryParams.sortBy !== field) {
      return <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400" />;
    }
    return queryParams.sortOrder === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="ml-1 text-blue-500" />
    ) : (
      <FontAwesomeIcon icon={faSortDown} className="ml-1 text-blue-500" />
    );
  };

  // ソート処理
  const handleSort = (field: string) => {
    const newOrder =
      queryParams.sortBy === field && queryParams.sortOrder === "asc"
        ? "desc"
        : "asc";
    changeSort(field, newOrder);
  };

  if (isLoading) {
    return (
      <div className="mt-4 flex h-96 items-center justify-center rounded-lg bg-white p-6 shadow">
        <div className="text-lg font-medium text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mt-4 flex h-96 items-center justify-center rounded-lg bg-white p-6 shadow">
        <div className="text-lg font-medium text-gray-500">
          問題が見つかりません
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                onClick={() => handleSort("createdAt")}
              >
                <span className="flex items-center">
                  作成日
                  {renderSortIcon("createdAt")}
                </span>
              </th>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                onClick={() => handleSort("title")}
              >
                <span className="flex items-center">
                  タイトル
                  {renderSortIcon("title")}
                </span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                本文
              </th>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                onClick={() => handleSort("level")}
              >
                <span className="flex items-center">
                  レベル
                  {renderSortIcon("level")}
                </span>
              </th>
              <th
                scope="col"
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                onClick={() => handleSort("type")}
              >
                <span className="flex items-center">
                  タイプ
                  {renderSortIcon("type")}
                </span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                レビュアー
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <FontAwesomeIcon icon={faBookmark} className="text-gray-500" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <FontAwesomeIcon icon={faUsers} className="text-gray-500" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                詳細
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {questions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <Link
                    href={`/admin/questions/${question.id}`}
                    className="hover:text-blue-600"
                  >
                    {dayjs(question.createdAt).format("YYYY/MM/DD")}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  <Link
                    href={`/admin/questions/${question.id}`}
                    className="hover:text-blue-600"
                  >
                    {question.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <Link
                    href={`/admin/questions/${question.id}`}
                    className="hover:text-blue-600"
                  >
                    <p className="w-64 truncate">{question.content}</p>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <Link
                    href={`/admin/questions/${question.id}`}
                    className="hover:text-blue-600"
                  >
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        question.level === "BASIC"
                          ? "bg-green-100 text-green-800"
                          : question.level === "ADVANCED"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {question.level === "BASIC"
                        ? "基本"
                        : question.level === "ADVANCED"
                        ? "応用"
                        : "実践"}
                    </span>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <Link
                    href={`/admin/questions/${question.id}`}
                    className="hover:text-blue-600"
                  >
                    {question.type === "JAVA_SCRIPT"
                      ? "JavaScript"
                      : question.type === "TYPE_SCRIPT"
                      ? "TypeScript"
                      : question.type === "REACT_JS"
                      ? "React (JS)"
                      : "React (TS)"}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <Link
                    href={`/admin/questions/${question.id}`}
                    className="hover:text-blue-600"
                  >
                    {question.reviewer.name}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                  <Link
                    href={`/admin/questions/${question.id}`}
                    className="hover:text-blue-600"
                  >
                    {question.bookmarkCount}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                  <Link
                    href={`/admin/questions/${question.id}`}
                    className="hover:text-blue-600"
                  >
                    {question.userQuestionCount}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                  <Link
                    href={`/admin/questions/${question.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
