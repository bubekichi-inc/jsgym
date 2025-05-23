"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faEye, faLock } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface ThreadCardProps {
  id: string;
  title: string;
  createdAt: Date;
  views: number;
  isLocked: boolean;
  category: {
    id: string;
    slug: string;
    title: string;
  };
  user: {
    id: string;
    name: string | null;
    iconUrl: string | null;
  };
  postCount: number;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
  id,
  title,
  createdAt,
  views,
  isLocked,
  category,
  user,
  postCount,
}) => {
  return (
    <Link
      href={`/community/threads/${id}`}
      className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {user.iconUrl ? (
            <Image
              src={user.iconUrl}
              alt={user.name || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">
                {user.name?.charAt(0) || "U"}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
            {isLocked && (
              <FontAwesomeIcon
                icon={faLock}
                className="ml-2 text-gray-500"
              />
            )}
          </div>

          <div className="mt-1 flex items-center text-sm text-gray-500">
            <span>{user.name || "匿名ユーザー"}</span>
            <span className="mx-1">•</span>
            <span>
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
                locale: ja,
              })}
            </span>
          </div>

          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className="mr-4 flex items-center">
              <FontAwesomeIcon icon={faEye} className="mr-1" />
              {views}
            </span>
            <span className="flex items-center">
              <FontAwesomeIcon icon={faComments} className="mr-1" />
              {postCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};