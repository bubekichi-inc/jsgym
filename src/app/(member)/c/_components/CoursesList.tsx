"use client";
import Link from "next/link";
import { useCourses } from "@/app/_hooks/useCourses";
import { courseName } from "@/app/_utils/courseName";
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
          href={`/c/${course.id}`}
          key={course.id}
          className="bg-white p-6 font-bold shadow-card"
        >
          <div className="">{courseName(course.name)}コース</div>
        </Link>
      ))}
    </div>
  );
};
