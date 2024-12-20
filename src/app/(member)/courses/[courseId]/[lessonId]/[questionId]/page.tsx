"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonArea } from "./_components/ButtonArea";
import { ContentArea } from "./_components/ContetArea";
import { LogType } from "./_types/LogType";
import { useQuestion } from "@/app/_hooks/useQuestion";

type LogObj = { type: LogType; message: string };

export default function Question() {
  const { questionId } = useParams();
  const [answerId, setAnswerId] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<LogObj[]>([]);
  const [answerCode, setAnswerCode] = useState("");
  const { data, error, mutate } = useQuestion({
    questionId: questionId as string,
  });

  useEffect(() => {
    if (!data) return;
    if (!data.answer) return;
    setAnswerCode(data.answer.answer);
    setAnswerId(data.answer.id);
  }, [data]);

  const addLog = (type: LogType, message: string) => {
    setExecutionResult(prevLogs => [...prevLogs, { type, message }]);
  };

  const resetLogs = () => {
    setExecutionResult([]);
  };

  if (!data) {
    return <div className="text-center">読込み中</div>;
  }

  if (error) {
    return (
      <div className="text-center">問題の取得中にエラーが発生しました</div>
    );
  }

  return (
    <div className="h-full">
      <ContentArea
        answerCode={answerCode}
        setAnswerCode={setAnswerCode}
        addLog={addLog}
        resetLogs={resetLogs}
        executionResult={executionResult}
      />
      <ButtonArea
        question={data.question.content}
        answer={answerCode}
        answerId={answerId}
        setAnswerId={setAnswerId}
        setAnswerCode={setAnswerCode}
        status={data.answer?.status}
        onResetSuccess={resetLogs}
        mutate={mutate}
      />
    </div>
  );
}
