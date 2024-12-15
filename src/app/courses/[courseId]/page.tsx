"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLessons } from "@/app/_hooks/useLessons";
export default function Course() {
  const { courseId } = useParams();
  const { lessons, lessonError, lessonIsLoading } = useLessons();
  if (lessonIsLoading) return <div className="text-center">読込み中</div>;
  if (lessonError)
    return (
      <div className="text-center">問題の取得中にエラーが発生しました</div>
    );
  if (!lessons) return <div className="text-center">問題がありません</div>;
  return (
    <>
      <h2 className="p-10 text-5xl">Lesson一覧</h2>
      <div className="flex flex-col gap-10 p-10">
        {lessons.map(lesson => (
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
