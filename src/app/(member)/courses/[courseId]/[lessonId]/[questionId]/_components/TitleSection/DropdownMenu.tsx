import {
  faEllipsis,
  faEye,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export const DropdownMenu: React.FC = () => {
  return (
    <div className="">
      <Menu>
        <MenuButton className="rounded-full px-2 py-1 duration-150 hover:bg-gray-200">
          <FontAwesomeIcon icon={faEllipsis} className="size-6 text-gray-600" />
        </MenuButton>

        <MenuItems
          transition
          anchor={{ to: "bottom end", gap: "4px" }}
          className="w-52 origin-top-right rounded-xl border border-gray-100 bg-white p-1 text-sm shadow-popup transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <button className="group flex w-full items-center gap-3 rounded-lg p-3 font-bold data-[focus]:bg-gray-100">
              <FontAwesomeIcon icon={faEye} />
              答えを見る
            </button>
          </MenuItem>
          <MenuItem>
            <button className="group flex w-full items-center gap-3 rounded-lg p-3 font-bold text-red-500 data-[focus]:bg-gray-100">
              <FontAwesomeIcon icon={faRefresh} />
              リセット
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};
