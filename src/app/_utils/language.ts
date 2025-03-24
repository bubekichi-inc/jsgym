import { FileExtension } from "@prisma/client";
import { EditorLanguage } from "../_types/EditorLanguage";

export const language = (type: FileExtension | undefined): EditorLanguage => {
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
