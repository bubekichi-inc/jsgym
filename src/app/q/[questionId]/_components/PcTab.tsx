import React from "react";
import { TabType } from "./QuestionDetailPage";

interface Props {
  activeTab: TabType;
  handleTabChange: (tab: TabType) => void;
  isBusy: boolean;
}

export const PcTab: React.FC<Props> = ({
  activeTab,
  handleTabChange,
  isBusy,
}) => {
  const baseButtonClass =
    "w-full py-2 text-sm select-none cursor-pointer font-bold text-center duration-150";
  const activeButtonClass = "bg-blue-100 text-blue-600";
  const inactiveButtonClass = "bg-white text-gray-600";
  return (
    <div className="sticky top-0 z-10 flex w-full items-center border-b border-gray-300 bg-white shadow-card">
      <div
        className={`${baseButtonClass} ${
          activeTab === "question" ? activeButtonClass : inactiveButtonClass
        }`}
        onClick={() => handleTabChange("question")}
      >
        <span className="relative">
          問題文・チャット
          {isBusy && activeTab !== "question" && (
            <div className="absolute -right-4 top-1/2 ml-2 size-2 -translate-y-1/2 animate-pulse rounded-full bg-blue-600" />
          )}
        </span>
      </div>
      <div
        className={`${baseButtonClass} ${
          activeTab === "preview" ? activeButtonClass : inactiveButtonClass
        }`}
        onClick={() => handleTabChange("preview")}
      >
        プレビュー
      </div>
    </div>
  );
};
