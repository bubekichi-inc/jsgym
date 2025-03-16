"use client";

import React, { useState } from "react";
import { Chat } from "./Chat";
import { CodeEditor } from "./CodeEditor";
import { MemoDrawer } from "./MemoDrawer";
import { PcTab } from "./PcTab";
import { Question } from "./Question";
import { SpTab } from "./SpTab";
import { TitleSection } from "./TitleSection";
import { Preview } from "@/app/_components/ReactPreview";
import { useDevice } from "@/app/_hooks/useDevice";

export type TabType = "question" | "editor" | "preview";

export const QuestionDetailPage: React.FC = () => {
  const [reviewBusy, setReviewBusy] = useState(false);
  const [chatBusy, setChatBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("question");
  const { isSp } = useDevice();
  const [files, setFiles] = useState<Record<string, string>>({
    "/App.tsx": "",
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  if (isSp) {
    return (
      <div className="">
        <SpTab activeTab={activeTab} handleTabChange={handleTabChange} />
        <div className="flex w-full flex-col md:flex-row">
          <div
            className={`w-full ${
              activeTab === "question" ? "block" : "hidden"
            } relative max-h-[calc(100vh-96px)] space-y-6 p-4`}
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
              setFiles={setFiles}
            />
          </div>
        </div>

        <MemoDrawer />
      </div>
    );
  }

  return (
    <div className="">
      <PcTab activeTab={activeTab} handleTabChange={handleTabChange} />

      <div className="flex w-full justify-center">
        <div className="mt-8 max-h-[calc(100vh-48px)] w-1/2 overflow-auto p-6">
          {activeTab === "question" && (
            <div className="relative space-y-6">
              <TitleSection />
              <Question />
              <Chat
                reviewBusy={reviewBusy}
                chatBusy={chatBusy}
                setChatBusy={setChatBusy}
              />
            </div>
          )}

          {activeTab === "preview" && (
            <div className="">
              <Preview files={files} />
            </div>
          )}
        </div>

        <div className="w-1/2">
          <CodeEditor
            reviewBusy={reviewBusy}
            setReviewBusy={setReviewBusy}
            onReviewComplete={() => handleTabChange("question")}
            setFiles={setFiles}
          />
        </div>
      </div>

      <MemoDrawer />
    </div>
  );
};
