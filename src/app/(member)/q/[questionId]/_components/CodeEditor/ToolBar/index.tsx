import { faPaperPlane, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CodeReviewResult, Sender, UserQuestionStatus } from "@prisma/client";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import { useMessages } from "../../../_hooks/useMessages";
import { useRewardApprove } from "../../../_hooks/useRewardApprove";
import { DropdownMenu } from "./DropdownMenu";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { api } from "@/app/_utils/api";
import { CodeReviewRequest } from "@/app/api/questions/[questionId]/code_review/_types/CodeReview";
import { Draft } from "@/app/api/questions/_types/Draft";

interface Props {
  answer: string;
  onExecuteCode: () => void;
  reviewBusy: boolean;
  setReviewBusy: (busy: boolean) => void;
  touched: boolean;
  onReset: () => void;
}

export const ToolBar: React.FC<Props> = ({
  answer,
  onExecuteCode,
  reviewBusy,
  setReviewBusy,
  touched,
  onReset,
}) => {
  const { reward } = useRewardApprove();
  const params = useParams();
  const questionId = params.questionId as string;
  const {
    data: messagesData,
    mutate: mutateMessages,
    isValidating: isValidatingMessages,
  } = useMessages({
    questionId,
  });
  const { data: questionData, mutate: mutateQuestion } = useQuestion({
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
      await mutateQuestion();
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
      const { result } = await api.post<
        CodeReviewRequest,
        { result: CodeReviewResult }
      >(`/api/questions/${questionId}/code_review`, {
        answer,
      });

      await Promise.all([mutateQuestion(), mutateMessages()]);

      if (result === CodeReviewResult.APPROVED) reward();
    } catch {
      toast.error("提出に失敗しました");
    } finally {
      setReviewBusy(false);
    }
  };

  const isPassed =
    questionData?.userQuestion?.status === UserQuestionStatus.PASSED;
  const submitButtonDisabled =
    reviewBusy || isValidatingMessages || !touched || isPassed;

  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-4 rounded-full border border-gray-700 bg-black px-4 py-3 text-white">
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
        className={`flex items-center gap-2 rounded-full px-4 py-[10px] text-sm font-bold duration-300 ${
          submitButtonDisabled
            ? "cursor-not-allowed bg-blue-300"
            : "bg-blue-500"
        }`}
        disabled={submitButtonDisabled}
      >
        <span>提出してレビューを受ける</span>
        <FontAwesomeIcon icon={faPaperPlane} className="size-3" />
      </button>
      <DropdownMenu
        onSaveDraft={saveDraft}
        onReset={onReset}
        reviewBusy={reviewBusy}
      />
    </div>
  );
};
