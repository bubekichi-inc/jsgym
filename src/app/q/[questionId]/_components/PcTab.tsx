import React from "react";
import { TabType } from "./QuestionDetailPage";

interface Props {
  activeTab: TabType;
  handleTabChange: (tab: TabType) => void;
}

export const PcTab: React.FC<Props> = ({ activeTab, handleTabChange }) => {
  const baseButtonClass =
    "w-full py-2 text-sm select-none cursor-pointer font-bold text-center duration-150";
  const activeButtonClass = "bg-blue-100 text-blue-600";
  const inactiveButtonClass = "bg-white text-gray-600";
  return (
    <div className="fixed top-[48px] z-10 flex w-[50vw] items-center border-b border-gray-300 bg-white shadow-card">
      <div
        className={`${baseButtonClass} ${
          activeTab === "question" ? activeButtonClass : inactiveButtonClass
        }`}
        onClick={() => handleTabChange("question")}
      >
        問題文・チャット
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
