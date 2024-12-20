"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLessons } from "@/app/_hooks/useLessons";
export default function Course() {
  const { courseId } = useParams();
  const { data, error } = useLessons({
    courseId: courseId as string,
  });
  if (!data) return <div className="text-center">読込み中...</div>;
  if (error)
    return (
      <div className="text-center">レッスンの取得中にエラーが発生しました</div>
    );
  if (data.lessons.length === 0)
    return <div className="text-center">レッスンがありません</div>;

  return (
    <>
      <h2 className="p-10 text-5xl">Lesson一覧</h2>
      <div className="flex flex-col gap-10 p-10">
        {data.lessons.map((lesson) => (
          <Link
            href={`/courses/${courseId}/${lesson.id}`}
            key={lesson.id}
            className="border border-gray-500 p-4 shadow-md"
          >
            <div className="">{lesson.name}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
