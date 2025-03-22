"use client";

import { EditorTheme, FileExtension } from "@prisma/client";
import Image from "next/image";
import React, { useMemo } from "react";
import { EditorSettingsDropdown } from "./EditorSettingsDropdown";
import { useEditorSetting } from "@/app/(member)/_hooks/useEditorSetting";
import { useMe } from "@/app/(member)/_hooks/useMe";

interface TabProps {
  file: { id: string; name: string; ext: FileExtension };
  isSelected: boolean;
  onSelect: () => void;
}

const Tab: React.FC<TabProps> = ({ file, isSelected, onSelect }) => {
  const { data } = useEditorSetting();

  const textClass = useMemo(
    () =>
      data?.editorSetting.editorTheme === EditorTheme.LIGHT
        ? "textMain"
        : "text-white",
    [data?.editorSetting.editorTheme]
  );

  const tabClass = useMemo(() => {
    if (isSelected) {
      return data?.editorSetting.editorTheme === EditorTheme.LIGHT
        ? "bg-white border-gray-300/20"
        : "bg-editorDark border-gray-300/20";
    }
    return "bg-transparent border-gray-300/20";
  }, [data?.editorSetting.editorTheme, isSelected]);

  const icon = useMemo(() => {
    switch (file.ext) {
      case FileExtension.JS:
        return "/images/jsIcon.svg";
      case FileExtension.TS:
        return "/images/tsIcon.svg";
      case FileExtension.JSX:
        return "/images/jsxIcon.png";
      case FileExtension.TSX:
        return "/images/tsxIcon.svg";
      default:
        return "/images/jsIcon.svg";
    }
  }, [file.ext]);

  if (!data) return;

  return (
    <li
      className={`flex h-full w-[128px] cursor-pointer select-none items-center gap-2 border-r px-3 ${tabClass}`}
      onClick={onSelect}
    >
      <Image src={icon} height={80} width={80} alt="js-icon" className="w-4" />
      <span className={`text-sm font-semibold ${textClass}`}>
        {file.name}.{file.ext.toLowerCase()}
      </span>
    </li>
  );
};

interface Props {
  files: { id: string; name: string; ext: FileExtension }[];
  selectedFileId: string | null;
  setSelectedFileId: (fileId: string) => void;
  showCog?: boolean;
}

export const FileTabs: React.FC<Props> = ({
  selectedFileId,
  setSelectedFileId,
  files,
  showCog = true,
}) => {
  const { data } = useEditorSetting();
  const { data: me } = useMe();

  const headerClass = useMemo(
    () =>
      data?.editorSetting.editorTheme === EditorTheme.LIGHT
        ? "bg-transparent"
        : "bg-gray-600",
    [data?.editorSetting.editorTheme]
  );

  if (!data) return;

  return (
    <header
      className={`flex h-[36px] items-center justify-between ${headerClass}`}
    >
      <ul className="flex h-full">
        {files.map((file) => (
          <Tab
            key={file.id}
            file={file}
            isSelected={file.id === selectedFileId}
            onSelect={() => setSelectedFileId(file.id)}
          />
        ))}
      </ul>
      {me && showCog && <EditorSettingsDropdown />}
    </header>
  );
};
