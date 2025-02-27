import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import React from "react";
import { useMe } from "@/app/(member)/_hooks/useMe";

export const EditorSettingsDropdown: React.FC = () => {
  const { data } = useMe();

  if (!data) return null;

  return (
    <>
      <Menu>
        <MenuButton className="h-full px-3">
          <FontAwesomeIcon icon={faCog} className="size-4 text-white" />
        </MenuButton>

        <MenuItems
          transition
          anchor={{ to: "bottom end", gap: "4px" }}
          className="w-52 origin-top-right rounded-lg border border-gray-100 bg-white p-1 text-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        ></MenuItems>
      </Menu>
    </>
  );
};
