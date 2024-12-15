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
import { QuestionResponse } from "@/app/api/questions/_types/QuestionResponse";
import { useCodeExecutor } from "@/app/_hooks/useCodeExecutor";
type ContentAreaProps = {
  data: QuestionResponse;
  value: string;
  setValue: (value: string) => void;
  addLog: (type: string, message: string) => void;
  resetLogs: () => void;
  executionResult: { type: string; message: string }[];
};

export const ContentArea: React.FC<ContentAreaProps> = ({
  data,
  value,
  setValue,
  addLog,
  resetLogs,
  executionResult,
}) => {
  const { iframeRef, executeCode } = useCodeExecutor();

  useEffect(() => {
    if (!data?.answer) return;
    setValue(data.answer.code);
  }, [data, setValue]);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, messages } = event.data;
      if (type === "log" || type === "warn" || type === "error") {
        addLog(type, messages);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [addLog]);

  return (
    <div className="flex w-full px-6 py-5 h-full">
      <div className="flex gap-5 flex-col w-2/5 pr-10">
        <div className="flex justify-between">
          <BreadCrumbs />
          <PaginationControls questions={data.questions} />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold ">{`問題${data.question.questionNumber}`}</div>
          <div className="text-lg text-[#4B4B4B]">
            {data.answer ? status(data.answer?.status) : "未提出"}
          </div>
        </div>
        <h2 className="text-4xl">{data.question.title}</h2>
        <div className="font-bold">{data.question.content}</div>
      </div>
      <div className="w-3/5 h-full">
        <div className="relative">
          <CodeEditor
            language={language(data.course.name)}
            value={value}
            onChange={setValue}
          />
          <button
            type="button"
            className="bg-blue-400 text-white rounded-md absolute bottom-4 right-6 px-6 py-2"
            onClick={() => {
              resetLogs();
              executeCode(value);
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
