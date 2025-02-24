import { useFetch } from "@/app/_hooks/useFetch";
import { UserProfileResponse } from "@/app/api/me/_types/UserProfile";

export const useMe = () => {
  return useFetch<UserProfileResponse>("/api/me");
};
