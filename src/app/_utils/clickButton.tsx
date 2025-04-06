import { api } from "./api";

export const clickButton = async ({ type }: { type: string }) => {
  await api.post("/api/clicks", { type });
};
