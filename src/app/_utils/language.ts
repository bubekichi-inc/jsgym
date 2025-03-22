import { FileExtension } from "@prisma/client";
import { Language } from "../_types/Language";
export const language = (type: FileExtension | undefined): Language => {
  if (!type) return "javascript";
  switch (type) {
    case FileExtension.JS:
      return "javascript";
    case FileExtension.TS:
      return "typescript";
    default:
      return "javascript";
  }
};
