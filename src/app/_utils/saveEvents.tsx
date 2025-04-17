import { EventType } from "@prisma/client";
import { api } from "./api";

export const saveEvents = async ({
  type,
  name,
}: {
  type: EventType;
  name: string;
}) => {
  await api.post("/api/events", { type, name });
};
