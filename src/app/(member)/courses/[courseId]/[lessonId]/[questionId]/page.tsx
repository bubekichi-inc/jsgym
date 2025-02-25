"use client";
import { BreadCrumbs } from "./_components2/Breadcrumbs";
import { Chat } from "./_components2/Chat";
import { CodeEditor } from "./_components2/CodeEditor";
import { Question } from "./_components2/Question";
import { TitleSection } from "./_components2/TitleSection";

// type LogObj = { type: LogType; message: string };

export default function Page() {


  return (
    <div className="flex justify-center">
      <div className="relative max-h-[calc(100vh-48px)] w-1/2 space-y-6 overflow-y-auto p-6">
        <BreadCrumbs />
        <TitleSection />
        <Question />
        <Chat />
      </div>
      <div className="w-1/2">
        <CodeEditor />
      </div>
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
