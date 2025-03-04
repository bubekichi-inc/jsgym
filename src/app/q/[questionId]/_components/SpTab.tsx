import React from "react";

interface Props {
  activeTab: "question" | "editor";
  handleTabChange: (tab: "question" | "editor") => void;
}

export const SpTab: React.FC<Props> = ({ activeTab, handleTabChange }) => {
  const getTabButtonClass = (tabType: "question" | "editor") => {
    return `w-1/2 border-b-2 py-3 text-center duration-150 ${
      activeTab === tabType
        ? "border-blue-500 font-bold text-blue-500"
        : "border-transparent text-gray-500"
    }`;
  };

  return (
    <div className="fixed top-[48px] z-[99] flex w-full bg-white text-sm md:hidden">
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
  );
};
