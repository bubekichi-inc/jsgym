"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useFetch } from "@/app/_hooks/useFetch";
import { LessonsResponse } from "@/app/api/courses/[courseId]/_types/RessonsResponse";

export default function Course() {
  const { courseId } = useParams();
  const { data, error, isLoading } = useFetch<LessonsResponse>(
    `/api/courses/${courseId}`
  );
  if (isLoading) return <div>読込み中</div>;
  if (error) return <div>JS問題の取得中にエラーが発生しました</div>;
  if (!data) return <div>JSの問題がありません</div>;
  return (
    <>
      <h2 className="p-10 text-5xl">Lesson一覧</h2>
      <div className="flex flex-col gap-10 p-10">
        {data &&
          data.lessons.map(lesson => (
            <Link
              href={`/courses/${courseId}/lessons/${lesson.id}`}
              key={lesson.id}
              className=" shadow-md"
            >
              <div className="p-5">{lesson.name}</div>
            </Link>
          ))}
      </div>
    </>
  );
}
