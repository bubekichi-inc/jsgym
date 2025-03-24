"use client";

import React from "react";

export default function ReviewersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">レビュワー一覧</h1>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
          レビュワー追加
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-gray-600">ここにレビュワー一覧が表示されます。</p>
      </div>
    </div>
  );
}
