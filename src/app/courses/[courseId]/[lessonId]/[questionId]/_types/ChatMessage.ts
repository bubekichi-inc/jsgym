import { Sender } from "@prisma/client";

export type ChatMessage = {
  answerId: string;
  message: string;
  sender: Sender;
};
