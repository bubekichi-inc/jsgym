import React from "react";
import { TabType } from "./QuestionDetailPage";

interface Props {
  activeTab: TabType;
  handleTabChange: (tab: TabType) => void;
  showPreview: boolean;
}

export const SpTab: React.FC<Props> = ({
  activeTab,
  handleTabChange,
  showPreview,
}) => {
  const getTabButtonClass = (tabType: TabType) => {
    return `py-3 text-center duration-150 relative font-bold ${
      activeTab === tabType ? "text-textMain" : "text-gray-400"
    } ${showPreview ? "w-1/3" : "w-1/2"}`;
  };

  const getIndicatorStyle = () => {
    if (showPreview) {
      // 3つのタブがある場合
      if (activeTab === "question") return { transform: "translateX(0)" };
      if (activeTab === "preview") return { transform: "translateX(100%)" };
      return { transform: "translateX(200%)" };
    } else {
      // 2つのタブの場合
      return {
        transform: `translateX(${activeTab === "editor" ? "100%" : "0"})`,
      };
    }
  };

  return (
    <div className="fixed top-[48px] z-50 flex w-full bg-white text-sm">
      <div className="relative w-full">
        <div
          className={`absolute bottom-0 h-[3px] rounded-full bg-textMain transition-transform duration-300 ease-in-out ${
            showPreview ? "w-1/3" : "w-1/2"
          }`}
          style={getIndicatorStyle()}
        />
        <div className="flex">
          <button
            className={getTabButtonClass("question")}
            onClick={() => handleTabChange("question")}
          >
            問題・レビュー
          </button>
          {showPreview && (
            <button
              className={getTabButtonClass("preview")}
              onClick={() => handleTabChange("preview")}
            >
              プレビュー
            </button>
          )}
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
