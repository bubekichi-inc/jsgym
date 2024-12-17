import { useFetch } from "@/app/_hooks/useFetch";
import { LessonsResponse } from "@/app/api/courses/[courseId]/_types/RessonsResponse";

export const useLessons = ({ courseId }: { courseId: string }) => {
  return useFetch<LessonsResponse>(`/api/courses/${courseId}/lessons`);
};
