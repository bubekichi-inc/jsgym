import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { EditorFontSize, EditorTheme } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useEditorSetting } from "@/app/(member)/_hooks/useEditorSetting";
import { api } from "@/app/_utils/api";

const EDITOR_THEMES = [
  {
    label: "Light",
    value: EditorTheme.LIGHT,
  },
  {
    label: "Dark",
    value: EditorTheme.DARK,
  },
];

const EDITOR_FONT_SIZES = [
  {
    label: "小",
    value: EditorFontSize.SMALL,
  },
  {
    label: "中",
    value: EditorFontSize.MEDIUM,
  },
  {
    label: "大",
    value: EditorFontSize.LARGE,
  },
];

export const EditorSettingsDropdown: React.FC = () => {
  const { data, mutate, isValidating } = useEditorSetting();
  const { data: editorSettingData } = useEditorSetting();

  const [editorTheme, setEditorTheme] = useState<EditorTheme | null>(null);
  const [editorFontSize, setEditorFontSize] = useState<EditorFontSize | null>(
    null
  );
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!data) return;
    setEditorTheme(data.editorSetting.editorTheme);
    setEditorFontSize(data.editorSetting.editorFontSize);
  }, [data]);

  const cogClass = useMemo(
    () =>
      editorSettingData?.editorSetting.editorTheme === EditorTheme.LIGHT
        ? "textMain"
        : "text-white",
    [editorSettingData?.editorSetting.editorTheme]
  );

  if (!data) return null;
  if (!editorSettingData) return null;

  const updateTheme = async (theme: EditorTheme) => {
    if (isBusy || isValidating) return;
    try {
      setIsBusy(true);
      setEditorTheme(theme);
      await api.put(`/api/editor_setting`, {
        editorTheme: theme,
      });
      await mutate();
    } catch {
      toast.error("エディタのテーマの変更に失敗しました");
      await mutate();
    } finally {
      setIsBusy(false);
    }
  };

  const updateEditorFontSize = async (fontSize: EditorFontSize) => {
    if (isBusy || isValidating) return;
    try {
      setIsBusy(true);
      setEditorFontSize(fontSize);
      await api.put(`/api/editor_setting`, {
        editorFontSize: fontSize,
      });
      await mutate();
    } catch {
      toast.error("エディタのフォントサイズの変更に失敗しました");
      await mutate();
    } finally {
      setIsBusy(false);
    }
  };

  const tabClass = "cursor-pointer rounded px-4 py-2 text-sm font-bold";
  const selectedTabClass = "bg-blue-100 text-blue-800";

  return (
    <>
      <Menu as="div">
        <MenuButton className="h-full px-3">
          <FontAwesomeIcon icon={faCog} className={`size-4 ${cogClass}`} />
        </MenuButton>

        <MenuItems
          transition
          anchor={{ to: "bottom end", gap: "0px" }}
          className="w-[200px] origin-top-right rounded-lg border border-gray-100 bg-white p-4 text-sm shadow-lg transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-50 data-[closed]:opacity-0"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-bold">テーマ</p>
              <ul className="flex gap-1">
                {EDITOR_THEMES.map((theme) => (
                  <li
                    key={theme.value}
                    className={`${tabClass} ${
                      editorTheme === theme.value
                        ? selectedTabClass
                        : "text-gray-500"
                    }`}
                    onClick={() => updateTheme(theme.value)}
                  >
                    {theme.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold">文字サイズ</p>
              <ul className="flex gap-1">
                {EDITOR_FONT_SIZES.map((theme) => (
                  <li
                    key={theme.value}
                    className={`${tabClass} ${
                      editorFontSize === theme.value
                        ? selectedTabClass
                        : "text-gray-500"
                    }`}
                    onClick={() => updateEditorFontSize(theme.value)}
                  >
                    {theme.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </MenuItems>
      </Menu>
    </>
  );
};
