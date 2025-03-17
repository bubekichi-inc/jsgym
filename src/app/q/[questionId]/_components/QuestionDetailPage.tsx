"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Chat } from "./Chat";
import { CodeEditor } from "./CodeEditor";
import { MemoDrawer } from "./MemoDrawer";
import { PcTab } from "./PcTab";
import { Question } from "./Question";
import { SpTab } from "./SpTab";
import { TitleSection } from "./TitleSection";
import { ReactPreview } from "@/app/_components/ReactPreview";
import { useDevice } from "@/app/_hooks/useDevice";
import { useQuestion } from "@/app/_hooks/useQuestion";

export type PageType = "browser" | "code";

export type TabType = "question" | "editor" | "preview";

export const QuestionDetailPage: React.FC = () => {
  const params = useParams();
  const [reviewBusy, setReviewBusy] = useState(false);
  const [chatBusy, setChatBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("question");
  const { isSp } = useDevice();
  const questionId = params.questionId as string;
  const { data } = useQuestion({
    questionId,
  });
  const [files, setFiles] = useState<Record<string, string>>({
    "/App.tsx": "",
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const pageType: PageType = React.useMemo(() => {
    switch (data?.question.type) {
      case "REACT_JS":
      case "REACT_TS":
        return "browser";
      default:
        return "browser";
    }
  }, [data?.question.type]);

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
              showTerminal={pageType === "browser"}
            />
          </div>
        </div>

        <MemoDrawer />
      </div>
    );
  }

  return (
    <div className="">
      {pageType === "browser" && (
        <PcTab activeTab={activeTab} handleTabChange={handleTabChange} />
      )}

      <div className="flex w-full justify-center">
        <div
          className={`${
            pageType === "browser" ? "mt-10" : ""
          } max-h-[calc(100vh-48px)] w-1/2 overflow-auto`}
        >
          {activeTab === "question" && (
            <div className="relative space-y-6 p-6">
              <TitleSection />
              <Question />
              <Chat
                reviewBusy={reviewBusy}
                chatBusy={chatBusy}
                setChatBusy={setChatBusy}
              />
            </div>
          )}

          {activeTab === "preview" && <ReactPreview files={files} />}
        </div>

        <div className="w-1/2">
          <CodeEditor
            reviewBusy={reviewBusy}
            setReviewBusy={setReviewBusy}
            onReviewComplete={() => handleTabChange("question")}
            setFiles={setFiles}
            showTerminal={pageType === "code"}
          />
        </div>
      </div>

      <MemoDrawer />
    </div>
  );
};
