"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useFetch } from "@/app/_hooks/useFetch";
import { useThreads } from "../../_hooks/useThreads";
import { ThreadCard } from "../../_components/ThreadCard";
import { Pagination } from "../../_components/Pagination";
import { CreateThreadForm } from "../../_components/CreateThreadForm";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  
  // Fetch category details
  const { data: category, isLoading: isCategoryLoading } = useFetch<{
    id: string;
    slug: string;
    title: string;
    description: string | null;
    threadCount: number;
  }>(`/api/community/categories/${slug}`);
  
  // Fetch threads for this category
  const {
    threads,
    isLoading: isThreadsLoading,
    pagination,
    search,
    setSearch,
    setPage,
    mutate,
  } = useThreads({ categorySlug: slug });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputSearch);
  };
  
  const handleThreadCreated = () => {
    setShowCreateForm(false);
    mutate();
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button and category title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <Link
              href="/community"
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2 sm:mb-0"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
              カテゴリ一覧に戻る
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isCategoryLoading ? (
                <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ) : (
                category?.title
              )}
            </h1>
            
            {!isCategoryLoading && category?.description && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {category.description}
              </p>
            )}
          </div>
          
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              新規スレッド作成
            </button>
          )}
        </div>
        
        {/* Create thread form */}
        {showCreateForm && category && (
          <div className="mb-8">
            <CreateThreadForm
              categoryId={category.id}
              onCancel={() => setShowCreateForm(false)}
              onSuccess={handleThreadCreated}
            />
          </div>
        )}
        
        {/* Search bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-gray-400 dark:text-gray-500"
                />
              </div>
              <input
                type="text"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                placeholder="スレッドを検索..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              検索
            </button>
          </form>
        </div>
        
        {/* Threads list */}
        {isThreadsLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">
              {search
                ? "検索条件に一致するスレッドが見つかりませんでした"
                : "このカテゴリにはまだスレッドがありません"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {threads.map((thread) => (
              <ThreadCard
                key={thread.id}
                id={thread.id}
                title={thread.title}
                createdAt={new Date(thread.createdAt)}
                views={thread.views}
                isLocked={thread.isLocked}
                category={thread.category}
                user={thread.user}
                postCount={thread.postCount}
              />
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}