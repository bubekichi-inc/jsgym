"use client";
import { useParams } from "next/navigation";
import { QuestionList } from "./_components/QuestionList";
import { useFetch } from "@/app/_hooks/useFetch";
import { QuestionsResponse } from "@/app/api/courses/[courseId]/lessons/_types/QuestionsResponse";

export default function Lesson() {
  const { courseId, lessonId } = useParams();
  const { data, error, isLoading } = useFetch<QuestionsResponse>(
    `/api/courses/${courseId}/lessons/${lessonId}`
  );
  if (isLoading) return <div>読込み中</div>;
  if (error) return <div>JS問題の取得中にエラーが発生しました</div>;
  if (!data) return <div>JSの問題がありません</div>;
  return <QuestionList questions={data} />;
}
