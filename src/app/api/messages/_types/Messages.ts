import { Message } from "@prisma/client";
import { StatusType } from "@prisma/client";
export type MessagesReasponse = {
  status: StatusType;
  answer: string;
  messages: Message[];
};

export type MessageRequest = {
  message: string;
};
