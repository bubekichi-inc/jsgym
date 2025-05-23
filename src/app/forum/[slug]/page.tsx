"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForumCategories, useForumThreads } from "@/app/_hooks/forum";
import { ForumLayout } from "../_components/ForumLayout";
import { Pagination } from "@/app/q/_components/Pagination";
import {
  faArrowLeft,
  faPlus,
  faComments,
  faEye,
  faLock,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMe } from "@/app/(member)/_hooks/useMe";
import { CreateThreadRequest } from "@/app/api/forum/threads/route";

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { data: me } = useMe();
  const { category, isLoadingCategory } = useForumCategories({ initialSlug: slug });
  const { 
    threads, 
    pagination, 
    isLoadingThreads,
    changePage, 
    createThread
  } = useForumThreads({ categorySlug: slug });

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    
    setIsSubmitting(true);
    try {
      const data: CreateThreadRequest = {
        categoryId: category.id,
        title,
        content,
      };
      
      const result = await createThread(data);
      setTitle("");
      setContent("");
      setIsCreating(false);
      
      // 作成したスレッドへ移動
      router.push(`/forum/threads/${result.thread.id}`);
    } catch (error) {
      console.error("スレッド作成エラー:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCategory) {
    return (
      <ForumLayout>
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-500">読み込み中...</div>
        </div>
      </ForumLayout>
    );
  }

  if (!category) {
    return (
      <ForumLayout>
        <div className="rounded-md bg-red-50 p-6">
          <p className="text-center text-red-500">カテゴリが見つかりませんでした</p>
          <div className="mt-4 text-center">
            <Link
              href="/forum"
              className="inline-flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-3.5 w-3.5" />
              フォーラムトップに戻る
            </Link>
          </div>
        </div>
      </ForumLayout>
    );
  }

  return (
    <ForumLayout showHeader={false}>
      <div className="mb-6">
        <Link
          href="/forum"
          className="inline-flex items-center text-sm text-gray-600 hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1 h-3 w-3" />
          フォーラムトップに戻る
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-800">{category.title}</h1>
        {category.description && (
          <p className="mt-1 text-gray-600">{category.description}</p>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">スレッド一覧</h2>
        {me && !isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center gap-2 self-start rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 mt-2 md:mt-0"
          >
            <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
            <span>新規スレッド</span>
          </button>
        )}
      </div>

      {isCreating && (
        <div className="mb-8 rounded-md border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">新規スレッド作成</h3>
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleCreateThread}>
            <div className="mb-4">
              <label
                htmlFor="thread-title"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                タイトル
              </label>
              <input
                id="thread-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="スレッドのタイトルを入力"
                required
                maxLength={100}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="thread-content"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                内容
              </label>
              <textarea
                id="thread-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-40 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="最初の投稿内容を入力"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="mr-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "作成中..." : "スレッドを作成"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoadingThreads ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-500">読み込み中...</div>
        </div>
      ) : threads.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">スレッドがありません</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    スレッド
                  </th>
                  <th className="hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:table-cell">
                    作成者
                  </th>
                  <th className="hidden px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sm:table-cell">
                    <FontAwesomeIcon icon={faComments} className="h-3.5 w-3.5" title="投稿数" />
                  </th>
                  <th className="hidden px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sm:table-cell">
                    <FontAwesomeIcon icon={faEye} className="h-3.5 w-3.5" title="閲覧数" />
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最終更新
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {threads.map((thread) => (
                  <tr key={thread.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/forum/threads/${thread.id}`}
                        className="flex items-start"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {thread.isLocked && (
                              <FontAwesomeIcon
                                icon={faLock}
                                className="mr-1 h-3.5 w-3.5 text-gray-500"
                                title="ロック済み"
                              />
                            )}
                            {thread.title}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500 md:hidden">
                            <span>
                              作成者: {thread.user.name || "匿名ユーザー"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="hidden px-6 py-4 md:table-cell">
                      <div className="flex items-center">
                        {thread.user.iconUrl ? (
                          <div className="h-8 w-8 flex-shrink-0 mr-2">
                            <Image
                              src={thread.user.iconUrl}
                              alt="User avatar"
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full"
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 flex-shrink-0 bg-gray-200 rounded-full mr-2" />
                        )}
                        <div className="text-sm text-gray-900">
                          {thread.user.name || "匿名ユーザー"}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 text-center text-sm text-gray-500 sm:table-cell">
                      {thread.postsCount}
                    </td>
                    <td className="hidden px-6 py-4 text-center text-sm text-gray-500 sm:table-cell">
                      {thread.views}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">
                      {thread.latestPost ? (
                        <div>
                          <div>{formatDate(thread.latestPost.createdAt)}</div>
                          <div className="text-xs text-gray-400">
                            {thread.latestPost.user.name || "匿名ユーザー"}
                          </div>
                        </div>
                      ) : (
                        formatDate(thread.createdAt)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={changePage}
              />
            </div>
          )}
        </>
      )}
    </ForumLayout>
  );
}