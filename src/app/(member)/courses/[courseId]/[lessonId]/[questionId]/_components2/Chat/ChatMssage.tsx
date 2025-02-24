import React from "react";
import { SenderIcon } from "./SenderIcon";
import { Message } from "@/app/api/questions/[questionId]/messages/route";

interface Props {
  message: Message;
}

export const ChatMssage: React.FC<Props> = ({ message }) => {
  return (
    <div className="flex gap-3">
      <SenderIcon sender={message.sender} />
      <div className="w-full rounded bg-white p-4">a</div>
    </div>
  );
};
