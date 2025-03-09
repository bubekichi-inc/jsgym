import { useFetch } from "@/app/_hooks/useFetch";
import { NotificationRequest } from "@/app/api/notifications/_types/notification";

export const useNotifications= () => {
  return useFetch<NotificationRequest>("/api/notifications");
}