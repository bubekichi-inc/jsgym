import CourseDetailPage from "./_components/CourseDetailPage";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return <CourseDetailPage courseId={courseId} />;
}
