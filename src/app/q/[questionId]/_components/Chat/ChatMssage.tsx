"use client";

import React, { useMemo } from "react";
import { ChatPreview } from "./ChatPreview";
import { CodeReviewPreview } from "./CodeReviewPreview";
import { SenderIcon } from "./SenderIcon";
import { SubmitPreview } from "./SubmitPreview";
import { Message } from "@/app/api/questions/[questionId]/messages/route";

interface Props {
  message: Message;
}

export const ChatMssage: React.FC<Props> = ({ message }) => {
  const messageType = useMemo(() => {
    if (message.answer) return "SUBMIT";
    if (message.codeReview) return "CODE_REVIEW";
    return "CHAT";
  }, [message]);

  return (
    <div className={`flex gap-3 ${messageType === "SUBMIT" && "pt-4"}`}>
      <SenderIcon sender={message.sender} reviewer={message.reviewer} />
      <div className="w-full text-sm">
        {messageType === "SUBMIT" && <SubmitPreview answer={message.answer!} />}
        {messageType === "CODE_REVIEW" && (
          <CodeReviewPreview codeReview={message.codeReview!} />
        )}
        {messageType === "CHAT" && <ChatPreview message={message.message} />}
      </div>
    </div>
  );
};
