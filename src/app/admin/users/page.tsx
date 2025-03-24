"use client";

import React from "react";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">ユーザー一覧</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="ユーザーを検索..."
            className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            width="20"
            height="20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 14A5.5 5.5 0 108.5 3a5.5 5.5 0 000 11zM17 17l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">ここにユーザー一覧が表示されます。</p>
      </div>
    </div>
  );
}
