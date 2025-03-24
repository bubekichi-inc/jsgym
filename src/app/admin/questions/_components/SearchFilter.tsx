"use client";

import { faSearch, faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { AdminQuestionsQuery } from "@/app/api/admin/questions/route";

interface SearchFilterProps {
  queryParams: AdminQuestionsQuery;
  changeSearch: (search: string) => void;
  changeLevel: (level: string) => void;
  changeType: (type: string) => void;
  clearFilters: () => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  queryParams,
  changeSearch,
  changeLevel,
  changeType,
  clearFilters,
}) => {
  const [searchInput, setSearchInput] = useState(queryParams.search || "");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    changeSearch(searchInput);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    changeSearch("");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="タイトルまたは本文で検索..."
            className="w-full rounded-lg border border-gray-300 px-10 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-400 hover:text-gray-600"
              />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={toggleFilters}
          className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FontAwesomeIcon icon={faFilter} className="mr-2" />
          フィルター
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          検索
        </button>
      </form>

      {showFilters && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">フィルター</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              すべてクリア
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                レベル
              </label>
              <select
                value={queryParams.level || ""}
                onChange={(e) => changeLevel(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">すべて</option>
                <option value="BASIC">基本</option>
                <option value="ADVANCED">応用</option>
                <option value="REAL_WORLD">実践</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                タイプ
              </label>
              <select
                value={queryParams.type || ""}
                onChange={(e) => changeType(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">すべて</option>
                <option value="JAVA_SCRIPT">JavaScript</option>
                <option value="TYPE_SCRIPT">TypeScript</option>
                <option value="REACT_JS">React (JS)</option>
                <option value="REACT_TS">React (TS)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
