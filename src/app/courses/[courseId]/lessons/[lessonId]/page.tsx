"use client";
import { useParams } from "next/navigation";
import { LessonList } from "./_components/LessonList";
import { useFetch } from "@/app/_hooks/useFetch";
import { LessonsResponse } from "@/app/api/courses/[courseId]/lessons/_types/LessonsResponse";

export default function Question() {
  const { courseId, lessonId } = useParams();
  const { data, error, isLoading } = useFetch<LessonsResponse>(
    `/api/courses/${courseId}/lessons/${lessonId}`
  );
  if (isLoading) return <div>読込み中</div>;
  if (error) return <div>JS問題の取得中にエラーが発生しました</div>;
  if (!data) return <div>JSの問題がありません</div>;
  return <LessonList lessons={data} />;
}
