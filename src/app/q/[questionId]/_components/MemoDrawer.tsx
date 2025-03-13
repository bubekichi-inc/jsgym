"use client";

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import React, { useState, useRef, useEffect } from "react";
import { useUserMemo } from "@/app/_hooks/useUserMemo";

export const MemoDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { memo, updateMemo, isSaving, lastSaved } = useUserMemo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 引き出しを開閉する
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // メモの内容を更新する
  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateMemo(e.target.value);
  };

  // 引き出しが開いたらテキストエリアにフォーカスする
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      {/* 引き出しボタン */}
      <button
        onClick={toggleDrawer}
        className="absolute -top-8 left-[80%] flex h-8 w-20 -translate-x-1/2 items-center justify-center rounded-t-lg border-t border-gray-300 bg-white transition-all hover:bg-gray-200 md:left-1/2"
        aria-label={isOpen ? "メモを閉じる" : "メモを開く"}
      >
        <span className="text-sm">メモ帳</span>
        <svg
          className={`ml-1 size-4 transition-transform duration-150${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      {/* メモ引き出し */}
      <div
        className={`border-t border-gray-300 bg-white px-4 shadow-lg transition-transform duration-300 ease-in-out${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: isOpen ? "300px" : "0" }}
      >
        <div className="flex h-full flex-col pb-2">
          <div className="mb-2 flex items-center justify-between pt-2">
            <h3 className="font-medium text-gray-900">メモ帳</h3>
            <div className="text-xs text-gray-500">
              {isSaving ? (
                <span>保存中...</span>
              ) : lastSaved ? (
                <span>
                  最終保存:{" "}
                  {format(lastSaved, "yyyy/MM/dd HH:mm:ss", { locale: ja })}
                </span>
              ) : null}
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={memo}
            onChange={handleMemoChange}
            className="flex-1 resize-none rounded border border-gray-300 p-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            placeholder="ここにメモを入力してください..."
          />
        </div>
      </div>
    </div>
  );
};
