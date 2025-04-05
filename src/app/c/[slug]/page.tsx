import CourseDetailPage from "./_components/CourseDetailPage";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CourseDetailPage slug={slug} />;
}
