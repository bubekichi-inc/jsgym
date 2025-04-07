"use client";

import React from "react";
import { useRanking } from "../_hooks/useRanking";

export default function TotalUsersCount() {
  const { totalUsers, isLoading } = useRanking("all");

  if (isLoading || totalUsers === 0) {
    return null;
  }

  return (
    <span className="ml-2 text-sm text-gray-500">
      {totalUsers.toLocaleString()}人中
    </span>
  );
}
