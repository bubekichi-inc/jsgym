import { useFetch } from "@/app/_hooks/useFetch";
import { LessonsResponse } from "@/app/api/courses/[courseId]/_types/RessonsResponse";

export const useLessons = (id: string) => {
  return useFetch<LessonsResponse>(`/api/courses/${id}/lessons`);
};
