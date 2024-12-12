import { Message } from "@prisma/client";

export type MessagesReasponse = {
  answer: string;
  messages: Message[];
};
