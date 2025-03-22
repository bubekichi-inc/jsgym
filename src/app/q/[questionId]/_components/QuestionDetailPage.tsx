"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useCodeEditor } from "../_hooks/useCodeEditor";
import { Chat } from "./Chat";
import { CodeEditor } from "./CodeEditor";
import { PcTab } from "./PcTab";
import { Question } from "./Question";
import { SpTab } from "./SpTab";
import { TitleSection } from "./TitleSection";
import { BrowserPreview } from "@/app/_components/BrowserPreview";
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
  const methods = useCodeEditor();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const pageType: PageType = React.useMemo(() => {
    switch (data?.question.type) {
      case "REACT_JS":
      case "REACT_TS":
        return "browser";
      default:
        return "code";
    }
  }, [data?.question.type]);

  if (isSp) {
    return (
      <FormProvider {...methods}>
        <SpTab activeTab={activeTab} handleTabChange={handleTabChange} />
        <div className="flex w-full flex-col md:flex-row">
          <div
            className={`w-full ${
              activeTab === "question" ? "block" : "hidden"
            } relative mt-12 max-h-[calc(100vh-96px)] space-y-6 p-2`}
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
            className={`mt-11 w-full ${
              activeTab === "editor" ? "block" : "hidden"
            }`}
          >
            <CodeEditor
              reviewBusy={reviewBusy}
              setReviewBusy={setReviewBusy}
              onReviewComplete={() => handleTabChange("question")}
              showTerminal={pageType === "code"}
            />
          </div>
        </div>
      </FormProvider>
    );
  }

  return (
    <FormProvider {...methods}>
      {pageType === "browser" && (
        <PcTab
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          isBusy={chatBusy || reviewBusy}
        />
      )}

      <div className="flex w-full justify-center">
        <div
          className={`${
            pageType === "browser"
              ? "mt-10 max-h-[calc(100vh-48px-40px)]"
              : "max-h-[calc(100vh-48px)]"
          } w-1/2 overflow-auto`}
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

          {activeTab === "preview" && <BrowserPreview />}
        </div>

        <div className="w-1/2">
          <CodeEditor
            reviewBusy={reviewBusy}
            setReviewBusy={setReviewBusy}
            onReviewComplete={() => handleTabChange("question")}
            showTerminal={pageType === "code"}
          />
        </div>
      </div>
    </FormProvider>
  );
};
