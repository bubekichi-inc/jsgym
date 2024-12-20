"use client";
import { useParams } from "next/navigation";
import { useQuestions } from "@/app/_hooks/useQuestions";
import { answerStatus } from "@/app/_utils/answerStatus";
import { StatusBadge } from "@/app/_components/StatusBadge";
import Link from "next/link";
export default function Lesson() {
  const { courseId, lessonId } = useParams();
  const { data, error } = useQuestions({ lessonId: lessonId as string });
  if (!data) return <div className="text-center">読込み中...</div>;
  if (error)
    return (
      <div className="text-center">問題の取得中にエラーが発生しました</div>
    );
  if (data.questions.length === 0)
    return <div className="text-center">問題がありません</div>;
  return (
    <div className="flex flex-col gap-10 p-10">
      {data.questions.map((question, index) => (
        <Link
          href={`/courses/${courseId}/${lessonId}/${question.id}`}
          key={question.id}
          className=" shadow-md"
        >
          <div className="pl-2 px-3 flex justify-between">
            <div>問題{index + 1}</div>
            <StatusBadge status={answerStatus(question.status)} />
          </div>
          <div className="p-5">{question.content}</div>
        </Link>
      ))}
    </div>
  );
}
