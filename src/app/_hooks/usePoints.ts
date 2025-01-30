import { PointsResponse } from "../api/points/_types/PointsResponse";
import { useFetch } from "@/app/_hooks/useFetch";
export const usePoints = () => {
  return useFetch<PointsResponse>(`/api/points`);
};
