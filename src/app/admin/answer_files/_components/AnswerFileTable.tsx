"use client";

import {
  faSort,
  faSortUp,
  faSortDown,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";
import {
  AdminAnswerFilesQuery,
  AdminAnswerFilesResponse,
} from "../../../api/admin/answer_files/route";
import { CodeViewModal } from "./CodeViewModal";

interface AnswerFileTableProps {
  answerFiles: AdminAnswerFilesResponse["answerFiles"];
  queryParams: AdminAnswerFilesQuery;
  changeSort: (sortBy: string, sortOrder?: "asc" | "desc") => void;
  isLoading: boolean;
}

export const AnswerFileTable: React.FC<AnswerFileTableProps> = ({
  answerFiles,
  queryParams,
  changeSort,
  isLoading,
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    fileName: string;
    fileExt: string;
    content: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSort = (field: string) => {
    const newOrder =
      queryParams.sortBy === field && queryParams.sortOrder === "asc"
        ? "desc"
        : "asc";
    changeSort(field, newOrder);
  };

  const handleViewCode = (
    fileName: string,
    fileExt: string,
    content: string
  ) => {
    setSelectedFile({ fileName, fileExt, content });
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="mt-4 flex h-96 items-center justify-center rounded-lg bg-white p-6 shadow">
        <div className="text-lg font-medium text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (answerFiles.length === 0) {
    return (
      <div className="mt-4 flex h-96 items-center justify-center rounded-lg bg-white p-6 shadow">
        <div className="text-lg font-medium text-gray-500">
          ファイルが見つかりません
        </div>
      </div>
    );
  }

  const getExtensionLabel = (ext: string) => {
    switch (ext) {
      case "JS":
        return "JavaScript";
      case "TS":
        return "TypeScript";
      case "JSX":
        return "JSX";
      case "TSX":
        return "TSX";
      case "CSS":
        return "CSS";
      case "HTML":
        return "HTML";
      case "JSON":
        return "JSON";
      default:
        return ext;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "BASIC":
        return {
          label: "基本",
          style: "bg-green-100 text-green-800",
        };
      case "ADVANCED":
        return {
          label: "応用",
          style: "bg-yellow-100 text-yellow-800",
        };
      case "REAL_WORLD":
        return {
          label: "実践",
          style: "bg-red-100 text-red-800",
        };
      default:
        return {
          label: level,
          style: "bg-gray-100 text-gray-800",
        };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "JAVA_SCRIPT":
        return "JavaScript";
      case "TYPE_SCRIPT":
        return "TypeScript";
      case "REACT_JS":
        return "React (JS)";
      case "REACT_TS":
        return "React (TS)";
      default:
        return type;
    }
  };

  return (
    <>
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
                  onClick={() => handleSort("name")}
                >
                  <span className="flex items-center">
                    ファイル名
                    {renderSortIcon("name")}
                  </span>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  拡張子
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  問題タイトル
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  レベル
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  タイプ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  ユーザー
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  ステータス
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  <FontAwesomeIcon icon={faEye} className="text-gray-500" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {answerFiles.map((answerFile) => {
                const level = getLevelLabel(
                  answerFile.answer.userQuestion.question.level
                );
                return (
                  <tr key={answerFile.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {dayjs(answerFile.createdAt).format("YYYY/MM/DD")}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {answerFile.name}
                      {answerFile.isRoot && (
                        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                          root
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {getExtensionLabel(answerFile.ext)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <Link
                        href={`/admin/questions/${answerFile.answer.userQuestion.question.id}`}
                        className="hover:text-blue-600"
                      >
                        <p className="w-64 truncate">
                          {answerFile.answer.userQuestion.question.title}
                        </p>
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${level.style}`}
                      >
                        {level.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {getTypeLabel(
                        answerFile.answer.userQuestion.question.type
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {answerFile.answer.userQuestion.user.name || "名前なし"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          answerFile.answer.userQuestion.status === "PASSED"
                            ? "bg-green-100 text-green-800"
                            : answerFile.answer.userQuestion.status ===
                              "REVISION_REQUIRED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {answerFile.answer.userQuestion.status === "PASSED"
                          ? "合格"
                          : answerFile.answer.userQuestion.status ===
                            "REVISION_REQUIRED"
                          ? "要修正"
                          : "下書き"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                      <button
                        onClick={() =>
                          handleViewCode(
                            answerFile.name,
                            answerFile.ext,
                            answerFile.content
                          )
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedFile && (
        <CodeViewModal
          fileName={selectedFile.fileName}
          fileExt={selectedFile.fileExt}
          content={selectedFile.content}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
