"use client";

import {
  faChevronDown,
  faChevronUp,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";
import { AdminUsersQuery } from "../../../api/admin/users/route";

interface UserTableProps {
  users: {
    id: string;
    email: string | null;
    name: string | null;
    iconUrl: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
    userQuestionCount: number;
  }[];
  queryParams: AdminUsersQuery;
  changeSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
  isLoading: boolean;
}

export function UserTable({
  users,
  queryParams,
  changeSort,
  isLoading,
}: UserTableProps) {
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

  return (
    <div className="overflow-x-auto">
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="animate-spin text-2xl text-blue-500"
          />
        </div>
      ) : users.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-gray-500">ユーザーが見つかりませんでした</p>
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
                  onClick={() => handleSort("name")}
                  className="flex items-center font-medium text-gray-500"
                >
                  ユーザー名 {renderSortIcon("name")}
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <button
                  onClick={() => handleSort("email")}
                  className="flex items-center font-medium text-gray-500"
                >
                  メールアドレス {renderSortIcon("email")}
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                回答数
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                <button
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center font-medium text-gray-500"
                >
                  登録日 {renderSortIcon("createdAt")}
                </button>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                権限
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    {user.iconUrl ? (
                      <Image
                        src={user.iconUrl}
                        alt={user.name || "ユーザー"}
                        className="mr-3 size-8 rounded-full"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="mr-3 size-8 rounded-full bg-gray-200"></div>
                    )}
                    <span className="font-medium">{user.name || "未設定"}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.email || "未設定"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.userQuestionCount.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("ja-JP")}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role === "ADMIN" ? "管理者" : "一般ユーザー"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
