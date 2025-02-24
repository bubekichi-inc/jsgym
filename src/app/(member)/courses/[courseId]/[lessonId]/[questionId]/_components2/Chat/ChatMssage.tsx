import React, { useMemo } from "react";
import { SenderIcon } from "./SenderIcon";
import { SubmitPreview } from "./SubmitPreview";
import { Message } from "@/app/api/questions/[questionId]/messages/route";
import { CodeReviewPreview } from "./CodeReviewPreview";

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
      <SenderIcon sender={message.sender} />
      <div className="w-full text-sm">
        {messageType === "SUBMIT" && <SubmitPreview answer={message.answer!} />}
        {messageType === "CODE_REVIEW" && (
          <CodeReviewPreview codeReview={message.codeReview!} />
        )}
        {messageType === "CHAT" && (
          <div className="rounded bg-white p-4">{message.message}</div>
        )}
      </div>
    </div>
  );
};
