"use client";

import {
  faEllipsis,
  faRefresh,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useMe } from "@/app/(member)/_hooks/useMe";

interface Props {
  onSaveDraft: () => void;
  onReset: () => void;
  reviewBusy: boolean;
}

export const DropdownMenu: React.FC<Props> = ({
  onSaveDraft,
  onReset,
  reviewBusy,
}) => {
  const { data: me } = useMe();

  return (
    <div className="">
      <Menu as="div">
        <MenuButton className="rounded-full px-2 py-1 duration-150 hover:bg-gray-100/20 active:bg-gray-100/20">
          <FontAwesomeIcon icon={faEllipsis} className="size-6 text-gray-400" />
        </MenuButton>

        <MenuItems
          transition
          anchor={{ to: "top end", gap: "8px" }}
          className="w-[180px] origin-bottom-right rounded-xl border border-gray-100 bg-white p-1 text-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-50 data-[closed]:opacity-0"
        >
          {me && (
            <MenuItem>
              <button
                className="group flex w-full items-center gap-3 rounded-lg p-3 font-bold data-[focus]:bg-gray-100"
                type="button"
                onClick={onSaveDraft}
                disabled={reviewBusy}
              >
                <FontAwesomeIcon icon={faSave} />
                下書き保存
              </button>
            </MenuItem>
          )}
          <MenuItem>
            <button
              className="group flex w-full items-center gap-3 rounded-lg p-3 font-bold text-red-500 data-[focus]:bg-gray-100"
              type="button"
              onClick={onReset}
              disabled={reviewBusy}
            >
              <FontAwesomeIcon icon={faRefresh} />
              コードをリセット
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
};
