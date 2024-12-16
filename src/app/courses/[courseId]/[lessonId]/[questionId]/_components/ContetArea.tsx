"use client";
import {
  faTriangleExclamation,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { BreadCrumbs } from "./Breadcrumbs";
import { CodeEditor } from "./CodeEditor";
import { ConsoleType } from "./ConsoleType";
import { PaginationControls } from "./PaginationControls";
import { language } from "@/app/_utils/language";
import { status } from "@/app/_utils/status";
import { LogType } from "../_types/LogType";
import { useCodeExecutor } from "@/app/_hooks/useCodeExecutor";
import { useParams } from "next/navigation";
import { useQuestions } from "@/app/_hooks/useQuestions";
import { useQuestion } from "@/app/_hooks/useQuestion";
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
  const { data } = useQuestion(questionId as string);
  const { data: questions } = useQuestions(lessonId as string);

  useEffect(() => {
    if (!data?.answer) return;
    setAnswerCode(data.answer.answer);
  }, [data, setAnswerCode]);

  if (!questions) return <div>問題の取得に失敗しました</div>;
  if (!data) return <div>問題の取得に失敗しました</div>;

  const currentQuestionNumber = questions.questions.findIndex(
    q => q.id === parseInt(questionId as string, 10)
  );
  const statusMap = {
    合格済み: "text-blue-500",
    再提出: "text-red-500",
    未提出: "text-black",
  };

  const answerStatus = data.answer ? status(data.answer?.status) : "未提出";
  const statusColor = statusMap[answerStatus] || "text-black";
  const example = data.question.example ? `例）${data.question.example}` : "";
  return (
    <div className="flex w-full px-6 py-5 h-full">
      <div className="flex gap-5 flex-col w-2/5 pr-10">
        <div className="flex justify-between">
          <BreadCrumbs />
          <PaginationControls />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold ">{`問題${
            currentQuestionNumber + 1
          }`}</div>
          <div className={`text-lg text-[#4B4B4B] ${statusColor}`}>
            {answerStatus}
          </div>
        </div>
        <h2 className="text-4xl">{data.question.title}</h2>
        <div className="font-bold">{data.question.content}</div>
        <div className="font-bold">{example}</div>
      </div>
      <div className="w-3/5 h-full">
        <div className="relative">
          <CodeEditor
            language={language(data.course.name)}
            value={answerCode}
            onChange={setAnswerCode}
            editerHeight="50vh"
          />
          <button
            type="button"
            className="bg-blue-400 text-white rounded-md absolute bottom-4 right-6 px-6 py-2"
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
        <div className="bg-[#333333] h-[20vh] mt-6 overflow-y-scroll">
          <ConsoleType text="ログ" />
          <div className="text-white px-4">
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
                    className="text-yellow-400 mr-2"
                    icon={faTriangleExclamation}
                  />
                )}
                {item.type === "error" && (
                  <FontAwesomeIcon
                    className="text-red-500 mr-2"
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
