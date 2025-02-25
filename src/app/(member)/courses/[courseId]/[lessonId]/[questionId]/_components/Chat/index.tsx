"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMessages } from "../../_hooks/useMessages";
import { AIBusy } from "./AIBusy";
import { ChatInput } from "./ChatInput";
import { ChatMssage } from "./ChatMssage";
import { Skeleton } from "@/app/_components/Skeleton";

export type ChatForm = {
  message: string;
};

interface Props {
  reviewBusy: boolean;
  chatBusy: boolean;
  setChatBusy: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Chat: React.FC<Props> = ({
  reviewBusy,
  chatBusy,
  setChatBusy,
}) => {
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useMessages({
    questionId,
  });

  const methods = useForm<ChatForm>({
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatBusy, reviewBusy, data?.messages]);

  if (!data) return <Skeleton height={300} />;

  if (!data.messages.length) return null;

  return (
    <div className="relative space-y-6">
      <div className="relative space-y-3">
        {data.messages.map((message) => {
          return <ChatMssage key={message.id} message={message} />;
        })}
      </div>
      {reviewBusy && <AIBusy mode="CODE_REVIEW" />}
      {chatBusy && <AIBusy mode="CHAT" />}
      <div ref={bottomRef} />
      <FormProvider {...methods}>
        <ChatInput setChatBusy={setChatBusy} />
      </FormProvider>
    </div>
  );
};
