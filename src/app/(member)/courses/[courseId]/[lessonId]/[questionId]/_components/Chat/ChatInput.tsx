import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMessages } from "../../_hooks/useMessages";
import { api } from "@/app/_utils/api";

type FormData = {
  message: string;
};

export const ChatInput: React.FC = () => {
  const params = useParams();
  const questionId = params.questionId as string;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate, isValidating } = useMessages({
    questionId,
  });

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("message")]);

  const submit = async (data: FormData) => {
    const submitText = data.message.trim();
    if (!submitText) return;
    await api.post(`/api/questions/${questionId}/messages`, {
      message: submitText,
    });
    reset({
      message: "",
    });
    mutate();
  };

  const { ref, ...rest } = register("message");

  const disabled = isSubmitting || isValidating;

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="sticky bottom-0 flex items-end gap-2 pl-9"
    >
      <textarea
        className={`w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-lg outline-none ${
          disabled && "cursor-not-allowed text-gray-600"
        }`}
        style={{ overflow: "hidden" }}
        rows={2}
        placeholder="追加の質問"
        {...rest}
        name="message"
        ref={(e) => {
          ref(e);
          textareaRef.current = e;
        }}
        disabled={disabled}
      />
      <button
        type="submit"
        className={`flex size-8 min-w-8 items-center justify-center whitespace-nowrap rounded-full text-sm text-white shadow-lg ${
          disabled ? "cursor-not-allowed bg-gray-500" : "bg-buttonMain"
        }`}
        disabled={disabled}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
};
