"use client";
import {
  faTriangleExclamation,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { LogType } from "../_types/LogType";
import { BreadCrumbs } from "./Breadcrumbs";
import { CodeEditor } from "./CodeEditor";
import { ConsoleType } from "./ConsoleType";
import { PaginationControls } from "./PaginationControls";
import { StatusBadge } from "@/app/_components/StatusBadge";
import { useCodeExecutor } from "@/app/_hooks/useCodeExecutor";
import { useQuestion } from "@/app/_hooks/useQuestion";
import { useQuestions } from "@/app/_hooks/useQuestions";
import { Status } from "@/app/_types/Status";
import { answerStatus } from "@/app/_utils/answerStatus";
import { language } from "@/app/_utils/language";

type ContentAreaProps = {
  answerCode: string;
  setAnswerCode: (value: string) => void;
  addLog: (type: LogType, message: string) => void;
  resetLogs: () => void;
  executionResult: { type: string; message: string }[];
};
export const ContentArea: React.FC<ContentAreaProps> = ({
  answerCode,
  setAnswerCode,
  addLog,
  resetLogs,
  executionResult,
}) => {
  const { iframeRef, executeCode } = useCodeExecutor(addLog);
  const { lessonId, questionId } = useParams();
  const { data, error } = useQuestion({ questionId: questionId as string });
  const { data: questions, error: questionsError } = useQuestions({
    lessonId: lessonId as string,
  });

  useEffect(() => {
    if (!data?.answer) return;
    setAnswerCode(data.answer.answer);
  }, [data, setAnswerCode]);

  if (!questions) return <div>読込み中...</div>;
  if (!data) return <div>読込み中...</div>;
  if (error) return <div>問題情報取得中にエラーが発生しました</div>;
  if (questionsError)
    return <div>問題一覧情報取得中にエラーが発生しました</div>;
  if (questions.questions.length === 0)
    return <div className="text-center">問題がありません</div>;
  const currentQuestionNumber = questions.questions.findIndex(
    (q) => q.id === parseInt(questionId as string, 10)
  );
  const currentStatus: Status = data.answer
    ? answerStatus(data.answer.status)
    : "未提出";
  const example = data.question.example ? `例）${data.question.example}` : "";
  return (
    <div className="flex size-full gap-6 px-6 py-5">
      <div className="w-2/5">
        <div className="flex flex-col gap-14">
          <div className="flex items-center justify-between">
            <BreadCrumbs />
            <PaginationControls />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold ">{`問題${
                currentQuestionNumber + 1
              }`}</div>
              <StatusBadge status={currentStatus} />
            </div>
            <h2 className="text-4xl">{data.question.title}</h2>
            <div className="font-bold">{data.question.content}</div>
            <div className="font-bold">{example}</div>
          </div>
        </div>
      </div>
      <div className="h-full w-3/5">
        <div className="relative">
          <CodeEditor
            language={language(data.course.name)}
            value={answerCode}
            onChange={setAnswerCode}
            editerHeight="50vh"
          />
          <button
            type="button"
            className="absolute bottom-4 right-6 rounded-md bg-blue-400 px-6 py-2 text-white"
            onClick={() => {
              resetLogs();
              executeCode(answerCode);
            }}
          >
            実行
          </button>
        </div>
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts allow-modals"
          className="hidden"
        />
        <div className="mt-6 h-[20vh] overflow-y-scroll bg-[#333333]">
          <ConsoleType text="ログ" />
          <div className="px-4 text-white">
            {executionResult.map((item, index) => (
              <div
                key={index}
                className={`${
                  item.type === "warn"
                    ? "text-yellow-400"
                    : item.type === "error"
                    ? "text-red-500"
                    : ""
                }`}
              >
                {item.type === "warn" && (
                  <FontAwesomeIcon
                    className="mr-2 text-yellow-400"
                    icon={faTriangleExclamation}
                  />
                )}
                {item.type === "error" && (
                  <FontAwesomeIcon
                    className="mr-2 text-red-500"
                    icon={faCircleExclamation}
                  />
                )}
                {item.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
