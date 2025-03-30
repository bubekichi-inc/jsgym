import { CourseResponse } from "../api/courses/[courseId]/route";
import { useFetch } from "./useFetch";

export const useCourse = (courseId: string) => {
  const { data, error, isLoading, mutate } = useFetch<CourseResponse>(
    `/api/courses/${courseId}`
  );

  return {
    course: data?.course,
    lessons: data?.lessons || [],
    isLoading,
    error,
    mutate,
  };
};
