"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Panel, PanelGroup } from "react-resizable-panels";
import { CodeEditor } from "../../../_components/CodeEditor";
import { useCodeEditor } from "../_hooks/useCodeEditor";
import { Chat } from "./Chat";
import { PcTab } from "./PcTab";
import { Question } from "./Question";
import { ResizeHandle } from "./ResizeHandle";
import { SpTab } from "./SpTab";
import { TitleSection } from "./TitleSection";
import { BrowserPreview } from "@/app/_components/BrowserPreview";
import { useDevice } from "@/app/_hooks/useDevice";
import { useLocalStorage } from "@/app/_hooks/useLocalStorage";
import { useQuestion } from "@/app/_hooks/useQuestion";

export type PageType = "browser" | "code";

export type TabType = "question" | "editor" | "preview";

export const QuestionDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [reviewBusy, setReviewBusy] = useState(false);
  const [chatBusy, setChatBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("question");
  const { isSp } = useDevice();
  const questionId = params.questionId as string;
  const { data, error } = useQuestion({
    questionId,
  });
  const methods = useCodeEditor();

  // パネルのレイアウトをuseLocalStorageで管理
  const [panelLayout, setPanelLayout] = useLocalStorage<number[]>(
    "question-panel-layout",
    [50, 50]
  );

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

  if (error) {
    router.replace("/not-found");
  }

  if (isSp === undefined) return null;

  if (isSp) {
    return (
      <FormProvider {...methods}>
        <SpTab
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          showPreview={pageType === "browser"}
          isBusy={chatBusy || reviewBusy}
        />
        <div className="flex w-full flex-col md:flex-row">
          {activeTab === "question" && (
            <div
              className={`relative mt-12 max-h-[calc(100vh-96px)] w-full space-y-6 p-2`}
            >
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
            <div className={`mt-11 w-full`}>
              <BrowserPreview />
            </div>
          )}

          <div
            className={`mt-11 w-full ${activeTab === "editor" ? "" : "hidden"}`}
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
      <PanelGroup
        direction="horizontal"
        className="w-full"
        id="question-detail-panels"
        onLayout={(sizes) => {
          setPanelLayout(sizes);
        }}
      >
        <Panel defaultSize={panelLayout[0]} minSize={10} id="question-panel">
          {pageType === "browser" && (
            <PcTab
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              isBusy={chatBusy || reviewBusy}
            />
          )}
          <div
            className={`${
              pageType === "browser"
                ? "max-h-[calc(100vh-48px-40px)]"
                : "max-h-[calc(100vh-48px)]"
            } w-full overflow-auto`}
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
        </Panel>

        <ResizeHandle />

        <Panel defaultSize={panelLayout[1]} minSize={10} id="editor-panel">
          <div className="w-full">
            <CodeEditor
              reviewBusy={reviewBusy}
              setReviewBusy={setReviewBusy}
              onReviewComplete={() => handleTabChange("question")}
              showTerminal={pageType === "code"}
            />
          </div>
        </Panel>
      </PanelGroup>
    </FormProvider>
  );
};
