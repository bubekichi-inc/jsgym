"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useMessages } from "../../_hooks/useMessages";
import { ChatInput } from "./ChatInput";
import { ChatMssage } from "./ChatMssage";
import { AIBusy } from "./AIBusy";
import { Skeleton } from "@/app/_components/Skeleton";
import { FormProvider, useForm } from "react-hook-form";

export type FormData = {
  message: string;
};

interface Props {
  reviewBusy: boolean;
}

export const Chat: React.FC<Props> = ({ reviewBusy }) => {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data } = useMessages({
    questionId,
  });

  const methods = useForm<FormData>({
    defaultValues: {
      message: "",
    },
  });

  const {
    formState: { isSubmitting: chatBusy },
  } = methods;

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [chatBusy, reviewBusy]);

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
      {/* <div ref={bottomRef} /> */}
      <FormProvider {...methods}>
        <ChatInput />
      </FormProvider>
    </div>
  );
};
