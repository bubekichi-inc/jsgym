import { useFetch } from "@/app/_hooks/useFetch";
import { FetchNotificationRequest } from "@/app/api/notifications/_types/notification";

export const useNotifications= () => {
  return useFetch<FetchNotificationRequest>("/api/notifications");
}