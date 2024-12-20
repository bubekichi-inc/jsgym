"use client";
import Link from "next/link";
import { useCourses } from "@/app/_hooks/useCourses";
import { language } from "@/app/_utils/language";
export const CoursesList: React.FC = () => {
  const { data, error } = useCourses();
  if (!data) return <div className="text-center">読込み中...</div>;
  if (error)
    return (
      <div className="text-center">コースの取得中にエラーが発生しました</div>
    );
  if (data.courses.length === 0)
    return <div className="text-center">コースがありません</div>;

  return (
    <div className="flex flex-col gap-10 p-10">
      {data.courses.map((course) => (
        <Link
          href={`/courses/${course.id}`}
          key={course.id}
          className="border border-gray-500 p-4 shadow-md"
        >
          <div className="">{language(course.name)}</div>
        </Link>
      ))}
    </div>
  );
};
