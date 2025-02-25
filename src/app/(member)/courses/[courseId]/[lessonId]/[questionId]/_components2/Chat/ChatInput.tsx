import { api } from "@/app/_utils/api";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import React, { useRef, useEffect } from "react";
import { useMessages } from "../../_hooks/useChat";
import { useForm } from "react-hook-form";

export const ChatInput: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId as string;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate } = useMessages({
    questionId,
  });

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{ message: string }>({
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [watch("message")]);

  const submit = async (data: { message: string }) => {
    reset({
      message: "",
    });
    const submitText = data.message.trim();
    await api.post(`/api/questions/${questionId}/messages`, {
      message: submitText,
    });
    mutate();
  };

  const { ref, ...rest } = register("message");

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="pl-9 sticky bottom-0 flex gap-2 items-end"
    >
      <textarea
        className="w-full text-sm py-2 px-3 rounded-lg outline-none border border-gray-200 shadow-lg resize-none"
        style={{ overflow: "hidden" }}
        rows={2}
        placeholder="追加の質問"
        {...rest}
        name="message"
        ref={(e) => {
          ref(e);
          textareaRef.current = e;
        }}
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className="whitespace-nowrap text-sm text-white bg-buttonMain flex items-center justify-center rounded-full size-8 min-w-8 shadow-lg"
        disabled={isSubmitting}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
};
