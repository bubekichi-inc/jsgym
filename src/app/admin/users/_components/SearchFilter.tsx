"use client";

import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback } from "react";
import { AdminUsersQuery } from "../../../api/admin/users/route";

interface SearchFilterProps {
  queryParams: AdminUsersQuery;
  changeSearch: (search: string) => void;
  clearFilters: () => void;
}

export function SearchFilter({
  queryParams,
  changeSearch,
  clearFilters,
}: SearchFilterProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      changeSearch(e.target.value);
    },
    [changeSearch]
  );

  const hasActiveFilters = !!queryParams.search;

  return (
    <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="relative flex-1 md:max-w-md">
        <input
          type="text"
          placeholder="ユーザーを検索..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={queryParams.search}
          onChange={handleSearchChange}
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="mt-3 flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 md:mt-0"
        >
          <FontAwesomeIcon icon={faTimes} className="mr-2" />
          フィルターをクリア
        </button>
      )}
    </div>
  );
}
