import { faPaperPlane, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CodeReviewResult, Sender, UserQuestionStatus } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useMessages } from "../../../_hooks/useMessages";
import { useRewardApprove } from "../../../_hooks/useRewardApprove";
import { DropdownMenu } from "./DropdownMenu";
import { useMe } from "@/app/(member)/_hooks/useMe";
import { SinginModal } from "@/app/_components/SinginModal";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { api } from "@/app/_utils/api";
import { CodeReviewRequest } from "@/app/api/questions/[questionId]/code_review/_types/CodeReview";
import { Draft } from "@/app/api/questions/_types/Draft";
import { useLocalStorage } from "@/app/_hooks/useLocalStorage";

interface Props {
  answer: string;
  onExecuteCode: () => void;
  reviewBusy: boolean;
  setReviewBusy: (busy: boolean) => void;
  touched: boolean;
  onReset: () => void;
  onReviewComplete: () => void;
}

export const ToolBar: React.FC<Props> = ({
  answer,
  onExecuteCode,
  reviewBusy,
  setReviewBusy,
  touched,
  onReset,
  onReviewComplete,
}) => {
  const [_redirectQid, setRedirectQid] = useLocalStorage<string | null>(
    "redirectQid",
    null
  );
  const [showSinginModal, setShowSinginModal] = useState(false);
  const { data: me } = useMe();
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
    if (!me) {
      setRedirectQid(questionId);
      setShowSinginModal(true);
      return;
    }

    try {
      await optimisticPushMessage();
      onExecuteCode();
      setReviewBusy(true);
      const { result } = await api.post<
        CodeReviewRequest,
        { result: CodeReviewResult }
      >(`/api/questions/${questionId}/code_review`, {
        answer,
      });

      onReviewComplete();

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
    <>
      <div className="absolute bottom-2 right-2 flex items-center gap-4 rounded-full border border-gray-700 bg-black px-4 py-2 text-white md:bottom-4 md:right-4 md:py-3">
        <button
          type="button"
          onClick={onExecuteCode}
          className="flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-400 px-4 py-[10px] text-xs font-bold text-textMain md:text-sm"
        >
          <span className="hidden md:block">コードを実行</span>
          <FontAwesomeIcon icon={faPlay} className="size-3" />
        </button>
        <button
          type="button"
          onClick={review}
          className={`flex items-center gap-2 rounded-full px-4 py-[10px] text-xs font-bold duration-300 md:text-sm ${
            submitButtonDisabled
              ? "cursor-not-allowed bg-blue-300"
              : "bg-blue-500"
          }`}
          disabled={submitButtonDisabled}
        >
          <span className="hidden md:block">提出してレビューを受ける</span>
          <FontAwesomeIcon icon={faPaperPlane} className="size-3" />
        </button>
        <DropdownMenu
          onSaveDraft={saveDraft}
          onReset={onReset}
          reviewBusy={reviewBusy}
        />
      </div>

      <SinginModal
        open={showSinginModal}
        onClose={() => setShowSinginModal(false)}
      />
    </>
  );
};
