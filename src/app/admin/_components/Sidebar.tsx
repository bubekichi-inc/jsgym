"use client";

import {
  faChartLine,
  faClipboardList,
  faUsers,
  faUserGroup,
  faTags,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useDevice } from "../../_hooks/useDevice";

const menuItems = [
  {
    title: "ダッシュボード",
    href: "/admin/dashboard",
    icon: faChartLine,
  },
  {
    title: "KPI",
    href: "/admin/kpi",
    icon: faChartLine,
  },
  {
    title: "問題一覧",
    href: "/admin/questions",
    icon: faClipboardList,
  },
  {
    title: "問題タグ管理",
    href: "/admin/question_tags",
    icon: faTags,
  },
  {
    title: "回答ファイル一覧",
    href: "/admin/answer_files",
    icon: faClipboardList,
  },
  {
    title: "ユーザー一覧",
    href: "/admin/users",
    icon: faUsers,
  },
  {
    title: "レビュワー一覧",
    href: "/admin/reviewers",
    icon: faUserGroup,
  },
  {
    title: "イベント集計",
    href: "/admin/events",
    icon: faChartLine,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSp } = useDevice();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // スマホ表示ではない場合は常に表示
    if (isSp === false) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isSp]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    if (isSp) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* スマホ表示時のトグルボタン */}
      {isSp && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-50 rounded-full bg-blue-600 p-3 text-white shadow-lg"
        >
          <FontAwesomeIcon
            icon={isOpen ? faXmark : faBars}
            className="size-5"
          />
        </button>
      )}

      {/* サイドバー */}
      <div
        className={`fixed z-40 min-h-screen w-[200px] border-r border-gray-200 bg-white shadow-sm transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold text-gray-800">管理者ページ</h1>
        </div>
        <nav className="space-y-1 p-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                } transition-colors duration-150`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`mr-3 size-5 ${
                    isActive ? "text-blue-700" : "text-gray-500"
                  }`}
                />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* サイドバーオープン時の背景オーバーレイ（スマホ表示時のみ） */}
      {isSp && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
