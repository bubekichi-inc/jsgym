import React from "react";
import { TabType } from "./QuestionDetailPage";

interface Props {
  activeTab: TabType;
  handleTabChange: (tab: TabType) => void;
}

export const SpTab: React.FC<Props> = ({ activeTab, handleTabChange }) => {
  const getTabButtonClass = (tabType: TabType) => {
    return `w-1/2 py-3 text-center duration-150 relative font-bold ${
      activeTab === tabType ? "text-textMain" : "text-gray-400"
    }`;
  };

  return (
    <div className="fixed top-[48px] z-50 flex w-full bg-white text-sm md:hidden">
      <div className="relative w-full">
        <div
          className="absolute bottom-0 h-[3px] w-1/2 rounded-full bg-textMain transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(${activeTab === "editor" ? "100%" : "0"})`,
          }}
        />
        <div className="flex">
          <button
            className={getTabButtonClass("question")}
            onClick={() => handleTabChange("question")}
          >
            問題・レビュー
          </button>
          <button
            className={getTabButtonClass("editor")}
            onClick={() => handleTabChange("editor")}
          >
            エディタ
          </button>
        </div>
      </div>
    </div>
  );
};
