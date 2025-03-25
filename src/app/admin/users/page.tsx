"use client";

import React from "react";
import { Pagination } from "./_components/Pagination";
import { SearchFilter } from "./_components/SearchFilter";
import { UserTable } from "./_components/UserTable";
import { useAdminUsers } from "./_hooks/useAdminUsers";

export default function UsersPage() {
  const {
    users,
    total,
    isLoading,
    queryParams,
    currentPage,
    maxPage,
    changePage,
    changeSearch,
    changeSort,
    changeLimit,
    clearFilters,
  } = useAdminUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">ユーザー一覧</h1>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <SearchFilter
          queryParams={queryParams}
          changeSearch={changeSearch}
          clearFilters={clearFilters}
        />
        <UserTable
          users={users}
          queryParams={queryParams}
          changeSort={changeSort}
          isLoading={isLoading}
        />
        <Pagination
          currentPage={currentPage}
          maxPage={maxPage}
          changePage={changePage}
          changeLimit={changeLimit}
          total={total}
          queryParams={queryParams}
        />
      </div>
    </div>
  );
}
