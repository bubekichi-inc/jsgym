"use client";
import { BreadCrumbs } from "./_components/Breadcrumbs";
import { Chat } from "./_components/Chat";
import { CodeEditor } from "./_components/CodeEditor";
import { Question } from "./_components/Question";
import { TitleSection } from "./_components/TitleSection";

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
    </div>
  );
}
