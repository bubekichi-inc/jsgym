import { api } from "./api";

export const saveButtonClick = async ({ type }: { type: string }) => {
  await api.post("/api/clicks", { type });
};
