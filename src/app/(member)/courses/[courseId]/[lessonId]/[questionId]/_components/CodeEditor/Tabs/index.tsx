import Image from "next/image";
import React from "react";
import { EditorSettingsDropdown } from "./EditorSettingsDropdown";

const Tab: React.FC = () => {
  return (
    <li className="flex h-full w-[128px] cursor-pointer select-none items-center gap-2 bg-editorDark px-3">
      <Image
        src="/images/jsIcon.svg"
        height={80}
        width={80}
        alt="js-icon"
        className="size-4"
      />
      <span className="text-sm font-semibold text-white">index.js</span>
    </li>
  );
};

export const Tabs: React.FC = () => {
  return (
    <header className="flex h-[36px] items-center justify-between bg-gray-600">
      <ul className="h-full">
        <Tab />
      </ul>
      <EditorSettingsDropdown />
    </header>
  );
};
