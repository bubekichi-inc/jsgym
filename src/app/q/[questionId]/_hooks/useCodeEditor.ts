import { FileExtension } from "@prisma/client";
import { useForm } from "react-hook-form";

export type CodeEditorFile = {
  id: string;
  name: string;
  content: string;
  ext: FileExtension;
  isRoot: boolean;
};

export type CodeEditorFilesForm = {
  files: CodeEditorFile[];
};

export const useCodeEditor = () =>
  useForm<CodeEditorFilesForm>({
    defaultValues: {
      files: [],
    },
  });
