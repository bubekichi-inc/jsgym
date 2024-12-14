import { useParams } from "next/navigation";
import { useFetch } from "@/app/_hooks/useFetch";
import { LessonsResponse } from "@/app/api/courses/[courseId]/_types/RessonsResponse";

export const useLessons = () => {
  const { courseId } = useParams();
  const { data, error, isLoading } = useFetch<LessonsResponse>(
    `/api/courses/${courseId}`
  );
  return {
    lessons: data?.lessons,
    lessonError: error,
    lessonIsLoading: isLoading,
  };
};
