"use client";
import { useEffect, useState } from "react";
import { ButtonArea } from "./_components/ButtonArea";
import { ContentArea } from "./_components/ContetArea";
import { useQuestions } from "@/app/_hooks/useQuestions";

type LogObj = { type: string; message: string };
export default function Question() {
  const [answerId, setAnswerId] = useState("");
  const [executionResult, setExecutionResult] = useState<LogObj[]>([]);
  const [value, setValue] = useState("");
  const { data, error, isLoading, mutate } = useQuestions();

  useEffect(() => {
    if (!data?.answer) return;
    setValue(data.answer.code);
    setAnswerId(data.answer.id);
  }, [data]);

  const addLog = (type: string, message: string) => {
    setExecutionResult(prevLogs => [...prevLogs, { type, message }]);
  };

  const resetLogs = () => {
    setExecutionResult([]);
  };

  if (isLoading) return <div>読込み中</div>;
  if (error) return <div>JS問題の取得中にエラーが発生しました</div>;
  if (!data) return <div>JSの問題がありません</div>;

  return (
    <div className="h-full">
      <ContentArea
        data={data}
        value={value}
        setValue={setValue}
        addLog={addLog}
        resetLogs={resetLogs}
        executionResult={executionResult}
      />
      <ButtonArea
        question={data.question.content}
        answer={value}
        answerId={answerId}
        setAnswerId={setAnswerId}
        mutate={mutate}
        setValue={setValue}
        status={data.answer?.status}
        resetLogs={resetLogs}
      />
    </div>
  );
}
