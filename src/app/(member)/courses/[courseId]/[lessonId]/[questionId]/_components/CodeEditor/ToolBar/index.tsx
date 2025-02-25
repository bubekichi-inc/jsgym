import { faPaperPlane, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Sender } from "@prisma/client";
import { useParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useMessages } from "../../../_hooks/useMessages";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { api } from "@/app/_utils/api";
import { CodeReviewRequest } from "@/app/api/questions/[questionId]/code_review/_types/CodeReview";
import { Draft } from "@/app/api/questions/_types/Draft";

interface Props {
  answer: string;
  onExecuteCode: () => void;
  reviewBusy: boolean;
  setReviewBusy: (busy: boolean) => void;
}

export const ToolBar: React.FC<Props> = ({
  answer,
  onExecuteCode,
  reviewBusy,
  setReviewBusy,
}) => {
  const params = useParams();
  const questionId = params.questionId as string;
  const {
    data: messagesData,
    mutate: mutateMessages,
    isValidating: isValidatingMessages,
  } = useMessages({
    questionId,
  });
  const { mutate: mutateQuestion } = useQuestion({
    questionId,
  });

  const optimisticPushMessage = async () => {
    if (!messagesData) return;
    await mutateMessages(
      {
        messages: [
          ...messagesData.messages,
          {
            id: Math.random().toString(),
            message: "",
            sender: Sender.USER,
            codeReview: null,
            createdAt: new Date(),
            answer: {
              id: Math.random().toString(),
              answer: "",
              createdAt: new Date(),
            },
          },
        ],
      },
      false
    );
  };

  const saveDraft = async () => {
    try {
      await api.post<Draft, { message: string }>(
        `/api/questions/${questionId}/draft`,
        {
          answer,
        }
      );
      mutateQuestion();
      toast.success("下書き保存しました");
    } catch (e) {
      console.error(e);
      toast.error("下書き保存に失敗しました");
    }
  };

  const review = async () => {
    try {
      await optimisticPushMessage();
      setReviewBusy(true);
      await api.post<CodeReviewRequest>(
        `/api/questions/${questionId}/code_review`,
        {
          answer,
        }
      );
      // setIsSubmitting(false);
      mutateMessages();
      mutateQuestion();
    } catch (e) {
      console.error(e);
      toast.error("提出に失敗しました");
    } finally {
      setReviewBusy(false);
    }
  };

  const submitButtonBusy = reviewBusy || isValidatingMessages;

  return (
    <div className="absolute bottom-4 right-4 flex gap-4 rounded-full border border-gray-700 bg-black px-6 py-4 text-white">
      <button
        type="button"
        onClick={onExecuteCode}
        className="flex items-center gap-2 rounded-full bg-gray-400 px-4 py-[10px] text-sm font-bold text-textMain"
      >
        <span>コードを実行</span>
        <FontAwesomeIcon icon={faPlay} className="size-3" />
      </button>
      <button
        type="button"
        onClick={review}
        className={`flex items-center gap-2 rounded-full px-4 py-[10px] text-sm font-bold ${
          submitButtonBusy ? "cursor-not-allowed bg-blue-400" : "bg-blue-500"
        }`}
        disabled={submitButtonBusy}
      >
        <span>提出してレビューを受ける</span>
        <FontAwesomeIcon icon={faPaperPlane} className="size-3" />
      </button>
      <button
        type="button"
        onClick={saveDraft}
        className="text-sm"
        disabled={submitButtonBusy}
      >
        下書き保存
      </button>
      {/* <EllipsisButton /> */}
    </div>
  );
};
