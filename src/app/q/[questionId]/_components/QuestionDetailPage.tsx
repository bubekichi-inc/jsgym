"use client";

import React, { useState } from "react";
import { Chat } from "./Chat";
import { CodeEditor } from "./CodeEditor";
import { Question } from "./Question";
import { SpTab } from "./SpTab";
import { TitleSection } from "./TitleSection";

type TabType = "question" | "editor";

export const QuestionDetailPage: React.FC = () => {
  const [reviewBusy, setReviewBusy] = useState(false);
  const [chatBusy, setChatBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("question");

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col pt-[44px] md:pt-0">
      <SpTab activeTab={activeTab} handleTabChange={handleTabChange} />

      <div className="flex w-full flex-col md:flex-row md:justify-center">
        <div
          className={`w-full ${
            activeTab === "question" ? "block" : "hidden"
          } relative max-h-[calc(100vh-96px)] space-y-6 p-4 md:block md:max-h-[calc(100vh-48px)] md:w-1/2 md:overflow-y-auto md:p-6`}
        >
          <TitleSection />
          <Question />
          <Chat
            reviewBusy={reviewBusy}
            chatBusy={chatBusy}
            setChatBusy={setChatBusy}
          />
        </div>

        <div
          className={`w-full ${
            activeTab === "editor" ? "block" : "hidden"
          } md:block md:w-1/2`}
        >
          <CodeEditor
            reviewBusy={reviewBusy}
            setReviewBusy={setReviewBusy}
            onReviewComplete={() => handleTabChange("question")}
          />
        </div>
      </div>
    </div>
  );
};
