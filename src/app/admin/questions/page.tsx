"use client";

import React from "react";

export default function QuestionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">問題一覧</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          新規作成
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">ここに問題一覧が表示されます。</p>
      </div>
    </div>
  );
}
