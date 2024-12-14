import { CoursesResponse } from "../api/courses/_types/CoursesResponse";
import { useFetch } from "@/app/_hooks/useFetch";
export const useCourses = () => {
  const { data, error, isLoading } = useFetch<CoursesResponse>(`/api/courses`);
  return {
    courses: data?.courses,
    coursesError: error,
    coursesIsLoading: isLoading,
  };
};
