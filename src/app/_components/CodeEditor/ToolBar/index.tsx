import { faPaperPlane, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CodeReviewResult, Sender, UserQuestionStatus } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { CodeEditorFilesForm } from "../../../q/[questionId]/_hooks/useCodeEditor";
import { useMessages } from "../../../q/[questionId]/_hooks/useMessages";
import { useRewardApprove } from "../../../q/[questionId]/_hooks/useRewardApprove";
import { DropdownMenu } from "./DropdownMenu";
import { useMe } from "@/app/(member)/_hooks/useMe";
import { SinginModal } from "@/app/_components/SinginModal";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { useQuestionDetailRedirect } from "@/app/_hooks/useQuestionDetailRedirect";
import { api } from "@/app/_utils/api";
import { CodeReviewRequest } from "@/app/api/questions/[questionId]/code_review/route";
import { Draft } from "@/app/api/questions/[questionId]/draft/route";

interface Props {
  onExecuteCode: () => void;
  reviewBusy: boolean;
  setReviewBusy: (busy: boolean) => void;
  touched: boolean;
  onReset: () => void;
  onReviewComplete: () => void;
  showExecuteButton: boolean;
}

export const ToolBar: React.FC<Props> = ({
  onExecuteCode,
  reviewBusy,
  setReviewBusy,
  touched,
  onReset,
  onReviewComplete,
  showExecuteButton,
}) => {
  const { watch } = useFormContext<CodeEditorFilesForm>();
  const { setRedirectQid } = useQuestionDetailRedirect();
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
              createdAt: new Date(),
              answerFiles: [],
            },
            reviewer: null,
          },
        ],
      },
      false
    );
  };

  const saveDraft = async () => {
    try {
      await api.post<Draft>(`/api/questions/${questionId}/draft`, {
        files: watch("files"),
      });
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
        files: watch("files"),
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
      <div className="flex items-center gap-4 rounded-full border border-gray-700 bg-black px-4 py-2 text-white md:py-3">
        {showExecuteButton && (
          <button
            type="button"
            onClick={onExecuteCode}
            className="flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-400 px-4 py-[10px] text-xs font-bold text-textMain md:text-sm"
          >
            <span className="hidden md:block">コードを実行</span>
            <FontAwesomeIcon icon={faPlay} className="size-3" />
          </button>
        )}
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
