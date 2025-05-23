"use client";

import React from "react";
import Link from "next/link";
import { useForumCategories } from "@/app/_hooks/forum";
import { ForumLayout } from "./_components/ForumLayout";
import { faPlus, faChevronRight, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMe } from "../(member)/_hooks/useMe";

export default function ForumPage() {
  const { categories, isLoadingCategories } = useForumCategories();
  const { data: me } = useMe();
  const isAdmin = me?.role === "ADMIN";

  return (
    <ForumLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">カテゴリ一覧</h2>
        {isAdmin && (
          <Link
            href="/forum/admin/categories/new"
            className="flex items-center justify-center gap-2 self-start rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 mt-2 md:mt-0"
          >
            <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
            <span>新規カテゴリ</span>
          </Link>
        )}
      </div>

      {isLoadingCategories ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-500">読み込み中...</div>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">カテゴリがありません</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 border-t border-b">
          {categories.map((category) => (
            <li key={category.id} className="transition hover:bg-gray-50">
              <Link
                href={`/forum/${category.slug}`}
                className="flex items-start gap-4 py-5 px-4"
              >
                <div className="flex-shrink-0 pt-1">
                  <FontAwesomeIcon
                    icon={faFolder}
                    className="h-6 w-6 text-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {category.title}
                    </h3>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="h-4 w-4 text-gray-400"
                    />
                  </div>
                  {category.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {category.description}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-900">
                      {category.threadsCount}
                    </span>{" "}
                    スレッド
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </ForumLayout>
  );
}