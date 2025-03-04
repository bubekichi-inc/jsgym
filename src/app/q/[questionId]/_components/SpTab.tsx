import React from "react";

interface Props {
  activeTab: "question" | "editor";
  handleTabChange: (tab: "question" | "editor") => void;
}

export const SpTab: React.FC<Props> = ({ activeTab, handleTabChange }) => {
  return (
    <div className="fixed top-[48px] z-[99] flex w-full border-b bg-white text-sm md:hidden">
      <button
        className={`w-1/2 border-b-2 py-3 text-center duration-150 ${
          activeTab === "question"
            ? "border-blue-500 font-bold text-blue-500"
            : "border-transparent text-gray-500"
        }`}
        onClick={() => handleTabChange("question")}
      >
        問題・レビュー
      </button>
      <button
        className={`w-1/2 border-b-2 py-3 text-center duration-150 ${
          activeTab === "editor"
            ? "border-blue-500 font-bold text-blue-500"
            : "border-transparent text-gray-500"
        }`}
        onClick={() => handleTabChange("editor")}
      >
        エディタ
      </button>
    </div>
  );
};
