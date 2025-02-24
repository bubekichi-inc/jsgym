"use client";

import { useParams } from "next/navigation";
import React from "react";
import { useMessages } from "../../_hooks/useChat";
import { ChatMssage } from "./ChatMssage";
import { Skeleton } from "@/app/_components/Skeleton";

export const Chat: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useMessages({
    questionId,
  });

  if (!data) return <Skeleton height={300} />;

  return (
    <div className="space-y-3">
      {data.messages.map((message) => {
        return <ChatMssage key={message.id} message={message} />;
      })}
    </div>
  );
};
