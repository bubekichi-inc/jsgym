import { useFetch } from "@/app/_hooks/useFetch";
import { EditorSetting } from "@/app/api/editor_setting/route";

export const useEditorSetting = () => {
  return useFetch<{ editorSetting: EditorSetting }>(`/api/editor_setting`);
};
