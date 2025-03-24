import { Editor as MonacoEditor } from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import React from "react";
import { createHighlighter } from "shiki";

interface Props {
  fontSize: number;
  height: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  theme: string;
  language: string;
  fileName: string;
}

export const Editor: React.FC<Props> = ({
  fontSize,
  height,
  value,
  onChange,
  theme,
  language,
  fileName,
}) => {
  return (
    <MonacoEditor
      height={height}
      defaultLanguage={language}
      path={fileName}
      value={value}
      onChange={onChange}
      theme={theme}
      options={{
        fontSize,
        tabSize: 2,
      }}
      loading={
        <div className="text-sm font-bold text-gray-400">Loading...</div>
      }
      onMount={(_editor, monaco) => {
        (async () => {
          const highlighter = await createHighlighter({
            themes: ["slack-dark", "slack-ochin"],
            langs: ["jsx", "tsx", "vue", "svelte"],
          });

          monaco.languages.register({ id: "jsx" });
          monaco.languages.register({ id: "tsx" });
          monaco.languages.register({ id: "vue" });
          monaco.languages.register({ id: "svelte" });

          monaco.editor.defineTheme("slack-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {},
          });

          monaco.editor.defineTheme("slack-ochin", {
            base: "vs",
            inherit: true,
            rules: [],
            colors: {},
          });

          shikiToMonaco(highlighter, monaco);
        })();
      }}
    />
  );
};
