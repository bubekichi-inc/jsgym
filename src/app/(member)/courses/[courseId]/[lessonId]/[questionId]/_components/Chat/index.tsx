"use client";

import { useParams } from "next/navigation";
import React from "react";
import { useMessages } from "../../_hooks/useMessages";
import { ChatMssage } from "./ChatMssage";
import { Skeleton } from "@/app/_components/Skeleton";
import { ChatInput } from "./ChatInput";

export const Chat: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useMessages({
    questionId,
  });

  if (!data) return <Skeleton height={300} />;

  if (!data.messages.length) return null;

  return (
    <div className="space-y-6 relative">
      <div className="space-y-3 relative">
        {data.messages.map((message) => {
          return <ChatMssage key={message.id} message={message} />;
        })}
      </div>
      <ChatInput />
    </div>
  );
};
