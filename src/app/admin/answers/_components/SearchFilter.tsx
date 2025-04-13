"use client";

import { faSearch, faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { AdminAnswersQuery } from "@/app/api/admin/answers/route";

interface SearchFilterProps {
  queryParams: AdminAnswersQuery;
  changeSearch: (search: string) => void;
  changeResult: (result: string) => void;
  clearFilters: () => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  queryParams,
  changeSearch,
  changeResult,
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
            placeholder="問題タイトルで検索..."
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                ステータス
              </label>
              <select
                value={queryParams.result || ""}
                onChange={(e) => changeResult(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">すべて</option>
                <option value="APPROVED">合格</option>
                <option value="REJECTED">不合格</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
