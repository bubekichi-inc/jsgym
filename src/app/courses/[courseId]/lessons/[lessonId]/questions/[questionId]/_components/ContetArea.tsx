"use client";
import {
  faCircleExclamation,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DOMPurify from "dompurify";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";
import { CodeEditor } from "./CodeEditor";
import { ConsoleType } from "./ConsoleType";
import { useFetch } from "@/app/_hooks/useFetch";
import { language } from "@/app/_utils/language";
import { QuestionResponse } from "@/app/api/questions/_types/QuestionResponse";

type LogType = "log" | "warn" | "error";
type Log = { type: LogType; message: string };
export const ContentArea: React.FC = () => {
  const { questionId } = useParams();
  const [value, setValue] = useState<string>("");
  const [executionResult, setExecutionResult] = useState<Log[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { data, error, isLoading } = useFetch<QuestionResponse>(
    `/api/questions/${questionId}`
  );

  const addLog = (type: LogType, message: string) => {
    setExecutionResult(prevLogs => [...prevLogs, { type, message }]);
  };

  const reset = () => {
    // ログをリセットしてから実行
    setExecutionResult([]);
    executeCode();
  };

  const executeCode = () => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;

    // サニタイズしておく(xxs対策)
    const sanitizedCode = DOMPurify.sanitize(value);
    iframe.srcdoc = `
        <!DOCTYPE html>
        <html>
          <body>
             <script>
            (function() {
              const originalLog = console.log;

              console.log = function(...args) {
                originalLog.apply(console, args);
                window.parent.postMessage({ type: 'log', messages: args }, '*');
              };
              console.error = function(...args) {
                originalLog.apply(console, args);
                window.parent.postMessage({ type: 'error', messages: args }, '*');
              };
              console.warn = function(...args) {
                originalLog.apply(console, args);
                window.parent.postMessage({ type: 'warn', messages: args }, '*');
              };

              try {
                (function() {
      ${sanitizedCode}
    })();
                
              } catch (error) {
                console.log('Error:', error.toString());
                window.parent.postMessage({ type: 'error', error: error.toString() }, '*');
              }
            })();
          </script>
          </body>
        </html>
      `;
    const handleMessage = (event: MessageEvent) => {
      //sandbox="allow-scripts allow-modals"指定しているためオリジンチェックは省略
      // if (event.origin !== window.location.origin) return;

      // if (event.data.type === "log") {
      //   setExecutionResult(event.data.messages);
      //   return;
      // }
      const { type, messages } = event.data;
      if (type === "log" || type === "warn" || type === "error") {
        addLog(type, messages.join(" "));
      }
    };

    // イベントリスナーを追加
    window.addEventListener("message", handleMessage);

    // クリーンアップ関数でリスナーを削除
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  };

  if (isLoading) return <div>読込み中</div>;
  if (error) return <div>JS問題の取得中にエラーが発生しました</div>;
  if (!data) return <div>JSの問題がありません</div>;

  return (
    <div className="flex w-full p-10">
      <div className="w-2/5 flex flex-col gap-5">
        <div className="font-bold text-2xl">{`問題${
          data.questions.findIndex(
            question => question.id === data.question.id
          ) + 1
        }`}</div>
        <div className="font-bold">{data.question.content}</div>
      </div>
      <div className="w-3/5">
        <div className="relative">
          <CodeEditor
            language={language(data.course.name)}
            value={value}
            onChange={setValue}
          />
          <button
            type="button"
            className="bg-blue-400 text-white rounded-md absolute bottom-4 right-6 px-6 py-2"
            onClick={reset}
          >
            実行
          </button>
        </div>
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts allow-modals"
          style={{ display: "none" }}
        />
        <div className="bg-[#333333] h-3/5 mt-6">
          <div className="flex gap-2">
            <ConsoleType text="ログ" />
          </div>
          <div className="text-white p-4">
            {executionResult.map((item, index) => (
              <div
                key={index}
                className={`
                ${item.type === "warn" ? "text-yellow-400" : ""}
                ${item.type === "error" ? "text-red-500" : ""}
              `}
              >
                <span>
                  {item.type === "warn" ? (
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className="text-yellow"
                    />
                  ) : (
                    ""
                  )}

                  {item.type === "error" ? (
                    <FontAwesomeIcon
                      icon={faCircleExclamation}
                      className="text-red"
                    />
                  ) : (
                    ""
                  )}
                </span>
                {item.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
