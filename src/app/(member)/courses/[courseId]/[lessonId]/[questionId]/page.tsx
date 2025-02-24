"use client";
import { BreadCrumbs } from "./_components2/Breadcrumbs";
import { Chat } from "./_components2/Chat";
import { Question } from "./_components2/Question";
import { TitleSection } from "./_components2/TitleSection";

// type LogObj = { type: LogType; message: string };

export default function Page() {
  // const addLog = (type: LogType, message: string) => {
  //   setExecutionResult((prevLogs) => [...prevLogs, { type, message }]);
  // };

  // const resetLogs = () => {
  //   setExecutionResult([]);
  // };

  return (
    <div className="flex justify-center">
      <div className="w-1/2 space-y-6 p-6">
        <BreadCrumbs />
        <TitleSection />
        <Question />
        <Chat />
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
