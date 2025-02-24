import { Message } from "@/app/api/questions/[questionId]/messages/route";
import React from "react";
import { SenderIcon } from "./SenderIcon";
import { Sender } from "@prisma/client";

interface Props {
  message: Message;
}

export const ChatMssage: React.FC<Props> = ({ message }) => {
  return (
    <div className="flex gap-3">
      <SenderIcon sender={message.sender} />
      <div className="bg-white p-4 rounded w-full">a</div>
    </div>
  );
};
