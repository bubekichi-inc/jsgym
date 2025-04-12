"use client";

import {
  faChevronDown,
  faChevronUp,
  faEye,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { AdminAnswersQuery } from "../_hooks/useAdminAnswers";
import { AnswerModal } from "./AnswerModal";

interface AnswerTableProps {
  answers: {
    id: string;
    createdAt: string;
    question: {
      id: string;
      title: string;
    };
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
    answerFiles: {
      id: string;
      name: string;
      ext: string;
      content: string;
    }[];
    questionFiles: {
      id: string;
      name: string;
      ext: string;
      exampleAnswer: string;
    }[];
    codeReview: {
      id: string;
      result: "APPROVED" | "REJECTED";
      score: number;
    } | null;
  }[];
  queryParams: AdminAnswersQuery;
  changeSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
  isLoading: boolean;
}

export const AnswerTable: React.FC<AnswerTableProps> = ({
  answers,
  queryParams,
  changeSort,
  isLoading,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerTableProps["answers"][0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = (sortBy: string) => {
    const newSortOrder =
      queryParams.sortBy === sortBy && queryParams.sortOrder === "desc"
        ? "asc"
        : "desc";
    changeSort(sortBy, newSortOrder);
  };

  const renderSortIcon = (columnName: string) => {
    if (queryParams.sortBy !== columnName) return null;
    return (
      <FontAwesomeIcon
        icon={queryParams.sortOrder === "asc" ? faChevronUp : faChevronDown}
        className="ml-1 text-xs"
      />
    );
  };

  const openModal = (answer: AnswerTableProps["answers"][0]) => {
    setSelectedAnswer(answer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnswer(null);
  };

  const getStatusBadge = (result: "APPROVED" | "REJECTED" | undefined) => {
    if (!result) return null;
    
    return result === "APPROVED" ? (
      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
        合格
      </span>
    ) : (
      <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
        不合格
      </span>
    );
  };

  return (
    <>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin text-2xl text-blue-500"
            />
          </div>
        ) : answers.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-gray-500">回答が見つかりませんでした</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  <button
                    onClick={() => handleSort("question.title")}
                    className="flex items-center font-medium text-gray-500"
                  >
                    問題タイトル {renderSortIcon("question.title")}
                  </button>
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
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  <button
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center font-medium text-gray-500"
                  >
                    提出日時 {renderSortIcon("createdAt")}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {answers.map((answer) => (
                <tr key={answer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {answer.question.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {answer.user.name || answer.user.email || "未設定"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(answer.codeReview?.result)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(answer.createdAt).toLocaleString("ja-JP")}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => openModal(answer)}
                      className="flex items-center text-blue-600 hover:text-blue-900"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnswerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        answer={selectedAnswer}
      />
    </>
  );
};
