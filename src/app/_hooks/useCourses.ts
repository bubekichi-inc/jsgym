import { CoursesResponse } from "../api/courses/_types/CoursesResponse";
import { useFetch } from "@/app/_hooks/useFetch";
export const useCourses = () => {
  return useFetch<CoursesResponse>(`/api/courses`);
};
