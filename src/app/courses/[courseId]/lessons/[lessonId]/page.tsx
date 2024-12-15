"use client";
import { useParams } from "next/navigation";
import { QuestionList } from "./_components/QuestionList";
import { useFetch } from "@/app/_hooks/useFetch";
import { QuestionsResponse } from "@/app/api/lessons/[lessonId]/_types/QuestionsResponse";

export default function Lesson() {
  const { lessonId } = useParams();
  const { data, error, isLoading } = useFetch<QuestionsResponse>(
    `/api/lessons/${lessonId}`
  );
  if (isLoading) return <div className="text-center">読込み中</div>;
  if (error)
    return (
      <div className="text-center">問題の取得中にエラーが発生しました</div>
    );
  if (!data) return <div className="text-center">問題がありません</div>;
  return <QuestionList questions={data} />;
}
