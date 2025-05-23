"use client";

import { useEffect, useState } from "react";
import { useCategories } from "./_hooks/useCategories";
import { CategoryCard } from "./_components/CategoryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function CommunityPage() {
  const { categories, isLoading, search, setSearch } = useCategories();
  const [inputSearch, setInputSearch] = useState(search);

  useEffect(() => {
    setInputSearch(search);
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputSearch || "");
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          コミュニティ
        </h1>

        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-gray-400"
                />
              </div>
              <input
                type="text"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                placeholder="カテゴリを検索..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              検索
            </button>
          </form>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-24 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              カテゴリが見つかりませんでした
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                slug={category.slug}
                title={category.title}
                description={category.description}
                threadCount={category.threadCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
