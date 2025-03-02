import { EditorTheme } from "@prisma/client";
import Image from "next/image";
import React, { useMemo } from "react";
import { EditorSettingsDropdown } from "./EditorSettingsDropdown";
import { useEditorSetting } from "@/app/(member)/_hooks/useEditorSetting";

const Tab: React.FC = () => {
  const { data } = useEditorSetting();

  const textClass = useMemo(
    () =>
      data?.editorSetting.editorTheme === EditorTheme.LIGHT
        ? "textMain"
        : "text-white",
    [data?.editorSetting.editorTheme]
  );

  const tabClass = useMemo(
    () =>
      data?.editorSetting.editorTheme === EditorTheme.LIGHT
        ? "bg-white"
        : "bg-editorDark",
    [data?.editorSetting.editorTheme]
  );

  if (!data) return;

  return (
    <li
      className={`flex h-full w-[128px] cursor-pointer select-none items-center gap-2 px-3 ${tabClass}`}
    >
      <Image
        src="/images/jsIcon.svg"
        height={80}
        width={80}
        alt="js-icon"
        className="size-4"
      />
      <span className={`text-sm font-semibold ${textClass}`}>index.js</span>
    </li>
  );
};

export const Tabs: React.FC = () => {
  const { data } = useEditorSetting();

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
      <ul className="h-full">
        <Tab />
      </ul>
      <EditorSettingsDropdown />
    </header>
  );
};
