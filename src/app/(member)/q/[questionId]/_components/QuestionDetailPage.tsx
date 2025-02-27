"use client";

import React, { useState } from "react";
import { BreadCrumbs } from "./Breadcrumbs";
import { Chat } from "./Chat";
import { CodeEditor } from "./CodeEditor";
import { Question } from "./Question";
import { TitleSection } from "./TitleSection";

export const QuestionDetailPage: React.FC = () => {
  const [reviewBusy, setReviewBusy] = useState(false);
  const [chatBusy, setChatBusy] = useState(false);

  return (
    <div className="flex justify-center">
      <div className="relative max-h-[calc(100vh-48px)] w-1/2 space-y-6 overflow-y-auto p-6">
        <BreadCrumbs />
        <TitleSection />
        <Question />
        <Chat
          reviewBusy={reviewBusy}
          chatBusy={chatBusy}
          setChatBusy={setChatBusy}
        />
      </div>
      <div className="w-1/2">
        <CodeEditor reviewBusy={reviewBusy} setReviewBusy={setReviewBusy} />
      </div>
    </div>
  );
};
