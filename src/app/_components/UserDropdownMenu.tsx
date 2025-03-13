import {
  faCog,
  faDashboard,
  faPerson,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { UserRole } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useMe } from "../(member)/_hooks/useMe";
import { supabase } from "../_utils/supabase";

export const UserDropdownMenu: React.FC = () => {
  const { data, mutate } = useMe();
  const { replace, push } = useRouter();

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      await mutate();
      replace("/");
    } catch (e) {
      alert(`ログアウトに失敗しました:${e}`);
      console.error(e);
    }
  };

  if (!data) return null;

  return (
    <Menu>
      <MenuButton className="relative size-8 select-none overflow-hidden rounded-full border">
        {data.iconUrl ? (
          <Image
            src={data.iconUrl}
            alt="ユーザー"
            width={80}
            height={80}
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full bg-gray-300">{data.name?.slice(0, 1)}</div>
        )}
      </MenuButton>

      <MenuItems
        transition
        anchor={{ to: "bottom end", gap: "4px" }}
        className="z-[999] w-[170px] origin-top-right rounded-xl border border-gray-100 bg-white p-1 text-sm shadow-md transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-50 data-[closed]:opacity-0"
      >
        <MenuItem>
          <button
            className="group flex w-full items-center gap-3 rounded-lg p-3 font-bold data-[focus]:bg-gray-100"
            type="button"
            onClick={() => push("/dashboard")}
          >
            <FontAwesomeIcon icon={faDashboard} />
            ダッシュボード
          </button>
        </MenuItem>
        <MenuItem>
          <button
            className="group flex w-full items-center gap-3 rounded-lg p-3 font-bold data-[focus]:bg-gray-100"
            type="button"
            onClick={() => push("/settings/profile")}
          >
            <FontAwesomeIcon icon={faCog} />
            設定
          </button>
        </MenuItem>
        <MenuItem>
          <button
            className="group flex w-full items-center gap-3 rounded-lg p-3 font-bold text-gray-500 data-[focus]:bg-gray-100"
            type="button"
            onClick={logout}
          >
            <FontAwesomeIcon icon={faSignOut} />
            ログアウト
          </button>
        </MenuItem>
        {data.role === UserRole.ADMIN && (
          <MenuItem>
            <button
              className="group flex w-full items-center gap-3 rounded-lg p-3 font-bold data-[focus]:bg-gray-100"
              type="button"
              onClick={() => push("/admin/dashboard")}
            >
              <FontAwesomeIcon icon={faPerson} />
              管理者
            </button>
          </MenuItem>
        )}
      </MenuItems>
    </Menu>
  );
};
