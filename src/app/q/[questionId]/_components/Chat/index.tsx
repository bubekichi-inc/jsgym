"use client";

import { UserQuestionStatus } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMessages } from "../../_hooks/useMessages";
import { AIBusy } from "./AIBusy";
import { ChatInput } from "./ChatInput";
import { ChatMssage } from "./ChatMssage";
import { Rewards } from "./Rewards";
import { Skeleton } from "@/app/_components/Skeleton";
import { useQuestion } from "@/app/_hooks/useQuestion";

export type ChatForm = {
  message: string;
  isWebSearch: boolean;
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
  const { data: questionData } = useQuestion({
    questionId,
  });

  const methods = useForm<ChatForm>({
    defaultValues: {
      message: "",
      isWebSearch: false,
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatBusy, reviewBusy, data?.messages]);

  if (!data) return <Skeleton height={300} />;

  const isPassed =
    questionData?.userQuestion?.status === UserQuestionStatus.PASSED;
  const showChatInput = data.messages.length > 1 && !isPassed;

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

      <Rewards />

      {showChatInput && (
        <FormProvider {...methods}>
          <ChatInput chatBusy={chatBusy} setChatBusy={setChatBusy} />
        </FormProvider>
      )}
    </div>
  );
};
