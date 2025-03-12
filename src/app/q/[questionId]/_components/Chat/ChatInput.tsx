import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Sender } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { useMessages } from "../../_hooks/useMessages";
import { ChatForm } from ".";
import { api } from "@/app/_utils/api";

interface Props {
  chatBusy: boolean;
  setChatBusy: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatInput: React.FC<Props> = ({ chatBusy, setChatBusy }) => {
  const { register, watch, handleSubmit, reset, setValue } =
    useFormContext<ChatForm>();
  const params = useParams();
  const questionId = params.questionId as string;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data, mutate } = useMessages({
    questionId,
  });

  const optimisticPushMessage = async (message: string) => {
    if (!data) return;
    await mutate(
      {
        messages: [
          ...data.messages,
          {
            id: Math.random().toString(),
            message,
            sender: Sender.USER,
            codeReview: null,
            createdAt: new Date(),
            answer: null,
            reviewer: null,
          },
        ],
      },
      false
    );
  };

  const submit = async (formData: ChatForm) => {
    try {
      setChatBusy(true);
      const submitText = formData.message.trim();
      if (!submitText) return;
      await optimisticPushMessage(submitText);
      reset({
        message: "",
      });
      await api.post(`/api/questions/${questionId}/messages`, {
        message: submitText,
        isWebSearch: formData.isWebSearch,
      });

      await mutate();
    } catch {
      toast.error("送信に失敗しました");
    } finally {
      setChatBusy(false);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("message")]);

  const { ref, ...rest } = register("message");

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="sticky bottom-0 flex items-end gap-2 pl-9"
    >
      <div className="relative size-full">
        <textarea
          className={`size-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-lg outline-none ${
            chatBusy && "cursor-not-allowed text-gray-600"
          }`}
          style={{ overflow: "hidden" }}
          rows={3}
          placeholder="追加の質問"
          {...rest}
          name="message"
          ref={(e) => {
            ref(e);
            textareaRef.current = e;
          }}
          disabled={chatBusy}
        />
        <div className="absolute bottom-2 right-2">
          <div className="flex select-none items-center gap-2 p-2">
            <input
              {...register("isWebSearch")}
              type="checkbox"
              id="isWebSearch"
              className="size-4 cursor-pointer"
              checked={watch("isWebSearch")}
              onChange={(e) => setValue("isWebSearch", e.target.checked)}
              disabled={chatBusy}
            />
            <label
              htmlFor="isWebSearch"
              className={`cursor-pointer text-xs ${
                chatBusy ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Web検索
            </label>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className={`flex size-8 min-w-8 items-center justify-center whitespace-nowrap rounded-full text-sm text-white shadow-lg ${
          chatBusy ? "cursor-not-allowed bg-gray-500" : "bg-buttonMain"
        }`}
        disabled={chatBusy}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
};
