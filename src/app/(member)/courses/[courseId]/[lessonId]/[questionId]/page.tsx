"use client";
import { useParams } from "next/navigation";
import { BreadCrumbs } from "./_components2/Breadcrumbs";
import { useMessages } from "./_hooks/useChat";
import { LogType } from "./_types/LogType";
import { useQuestion } from "@/app/_hooks/useQuestion";

type LogObj = { type: LogType; message: string };

export default function Page() {
  const params = useParams();
  const questionId = params.questionId as string;
  const { data, error, mutate } = useQuestion({
    questionId,
  });
  const { data: messagesData } = useMessages({
    questionId,
  });
  console.log(messagesData);

  // const addLog = (type: LogType, message: string) => {
  //   setExecutionResult((prevLogs) => [...prevLogs, { type, message }]);
  // };

  // const resetLogs = () => {
  //   setExecutionResult([]);
  // };

  if (!data) {
    return <div className="text-center">読込み中</div>;
  }

  if (error) {
    return (
      <div className="text-center">問題の取得中にエラーが発生しました</div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 space-y-6 p-6">
        <BreadCrumbs />
      </div>
      <div className="w-1/2">codeEditor</div>
      {/* <ContentArea
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
      /> */}
    </div>
  );
}
