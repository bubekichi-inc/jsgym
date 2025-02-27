"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { StatusBadge } from "../../q/[questionId]/_components/StatusBadge";
import { useQuestions } from "@/app/_hooks/useQuestions";

export default function Lesson() {
  const { lessonId } = useParams();
  const { data, error } = useQuestions({ lessonId: lessonId as string });
  if (!data) return <div className="text-center">読込み中...</div>;
  if (error)
    return (
      <div className="text-center">問題の取得中にエラーが発生しました</div>
    );
  if (data.questions.length === 0)
    return <div className="text-center">問題がありません</div>;
  return (
    <div className="flex flex-col gap-4 p-10">
      {data.questions.map((question, index) => (
        <Link
          href={`/q/${question.id}`}
          key={question.id}
          className="flex flex-col gap-2 bg-white p-6 font-bold shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="font-bold">問題{index + 1}</div>
            {question.userQuestions.length > 0 && (
              <StatusBadge status={question.userQuestions[0].status} />
            )}
          </div>
          <div className="">{question.title}</div>
        </Link>
      ))}
    </div>
  );
}
