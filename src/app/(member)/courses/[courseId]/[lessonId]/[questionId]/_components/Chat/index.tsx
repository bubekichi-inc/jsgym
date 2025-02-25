"use client";

import { useParams } from "next/navigation";
import React from "react";
import { useMessages } from "../../_hooks/useMessages";
import { ChatInput } from "./ChatInput";
import { ChatMssage } from "./ChatMssage";
import { Skeleton } from "@/app/_components/Skeleton";

export const Chat: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useMessages({
    questionId,
  });

  if (!data) return <Skeleton height={300} />;

  if (!data.messages.length) return null;

  return (
    <div className="relative space-y-6">
      <div className="relative space-y-3">
        {data.messages.map((message) => {
          return <ChatMssage key={message.id} message={message} />;
        })}
      </div>
      <ChatInput />
    </div>
  );
};
