"use client";
import { useParams } from "next/navigation";
import { LessonsResponse } from "../../api/courses/[courseId]/lessons/_types/LessonsResponse";
import { LessonList } from "./lessons/_components/LessonList";
import { useFetch } from "@/app/_hooks/useFetch";

export default function Page() {
  const { courseId } = useParams();
  const { data, error, isLoading } = useFetch<LessonsResponse>(
    `/api/courses/${courseId}`
  );
  if (isLoading) return <div>読込み中</div>;
  if (error) return <div>JS問題の取得中にエラーが発生しました</div>;
  if (!data) return <div>JSの問題がありません</div>;
  return <LessonList lessons={data} />;
}
