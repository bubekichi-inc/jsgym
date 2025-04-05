import { CourseResponse } from "../api/courses/[slug]/route";
import { useFetch } from "./useFetch";

export const useCourse = (slug: string) => {
  const { data, error, isLoading, mutate } = useFetch<CourseResponse>(
    `/api/courses/${slug}`
  );

  return {
    course: data?.course,
    lessons: data?.lessons || [],
    isLoading,
    error,
    mutate,
  };
};
