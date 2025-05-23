"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faTimes,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useMe } from "@/app/(member)/_hooks/useMe";
import { MarkdownWrapper } from "@/app/_components/MarkdownWrapper";

interface ForumReplyProps {
  reply: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string | null;
      iconUrl: string | null;
    };
  };
  isThreadLocked?: boolean;
  onEdit?: (postId: string, content: string) => Promise<void>;
  onDelete?: (postId: string) => Promise<void>;
}

export const ForumReply: React.FC<ForumReplyProps> = ({
  reply,
  isThreadLocked = false,
  onEdit,
  onDelete,
}) => {
  const { data: me } = useMe();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOwner = me?.id === reply.user.id;
  const isAdmin = me?.role === "ADMIN";
  const canEdit = (isOwner || isAdmin) && !isThreadLocked;
  const canDelete = (isOwner || isAdmin) && !isThreadLocked;

  // 編集保存
  const handleSaveEdit = async () => {
    if (!onEdit) return;
    setIsSubmitting(true);
    
    try {
      await onEdit(reply.id, editContent);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    if (!onDelete) return;
    if (confirm("この返信を削除してもよろしいですか？")) {
      await onDelete(reply.id);
    }
  };

  return (
    <div className="border-t border-gray-100 py-3 pl-4">
      <div className="flex gap-3">
        {/* アバターと名前 */}
        <div className="flex-shrink-0">
          <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-gray-200">
            {reply.user.iconUrl ? (
              <Image
                src={reply.user.iconUrl}
                alt="User avatar"
                width={32}
                height={32}
                className="h-8 w-8 object-cover"
              />
            ) : (
              <FontAwesomeIcon icon={faPen} className="text-gray-500 h-3 w-3" />
            )}
          </div>
          <div className="text-center text-xs text-gray-600">
            {reply.user.name || "匿名ユーザー"}
          </div>
        </div>

        {/* 返信内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">
              {formatDate(reply.createdAt)}
              {reply.createdAt !== reply.updatedAt && " (編集済み)"}
            </span>

            {/* 編集/削除ボタン */}
            {(canEdit || canDelete) && (
              <div className="flex space-x-2">
                {canEdit && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-500 hover:text-blue-500"
                    title="編集"
                  >
                    <FontAwesomeIcon icon={faEdit} className="h-3.5 w-3.5" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="text-gray-500 hover:text-red-500"
                    title="削除"
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 編集モード */}
          {isEditing ? (
            <div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="h-28 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1 h-3 w-3" />
                  キャンセル
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="rounded-md bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={isSubmitting || !editContent.trim()}
                >
                  <FontAwesomeIcon icon={faSave} className="mr-1 h-3 w-3" />
                  保存
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none break-words">
              <MarkdownWrapper>{reply.content}</MarkdownWrapper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};