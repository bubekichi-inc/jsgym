"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faTimes,
  faReply,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsUp,
  faHeart,
  faLaughBeam,
  faLightbulb,
} from "@fortawesome/free-regular-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useMe } from "@/app/(member)/_hooks/useMe";
import { MarkdownWrapper } from "@/app/_components/MarkdownWrapper";

// リアクションアイコンのマッピング
const reactionIcons = {
  LIKE: faThumbsUp,
  LOVE: faHeart,
  LAUGH: faLaughBeam,
  THINK: faLightbulb,
};

const reactionLabels = {
  LIKE: "いいね",
  LOVE: "すごい",
  LAUGH: "おもしろい",
  THINK: "考えさせられる",
};

interface ForumPostProps {
  post: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string | null;
      iconUrl: string | null;
    };
    reactions: {
      kind: string;
      count: number;
      reacted: boolean;
    }[];
  };
  isThreadLocked?: boolean;
  onEdit?: (postId: string, content: string) => Promise<void>;
  onDelete?: (postId: string) => Promise<void>;
  onReply?: (postId: string, content: string) => Promise<void>;
  onReaction?: (postId: string, kind: string, add: boolean) => Promise<void>;
}

export const ForumPost: React.FC<ForumPostProps> = ({
  post,
  isThreadLocked = false,
  onEdit,
  onDelete,
  onReply,
  onReaction,
}) => {
  const { data: me } = useMe();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [replyContent, setReplyContent] = useState("");
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

  const isOwner = me?.id === post.user.id;
  const isAdmin = me?.role === "ADMIN";
  const canEdit = (isOwner || isAdmin) && !isThreadLocked;
  const canDelete = (isOwner || isAdmin) && !isThreadLocked;

  // 編集保存
  const handleSaveEdit = async () => {
    if (!onEdit) return;
    setIsSubmitting(true);
    
    try {
      await onEdit(post.id, editContent);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 返信送信
  const handleSubmitReply = async () => {
    if (!onReply) return;
    setIsSubmitting(true);
    
    try {
      await onReply(post.id, replyContent);
      setReplyContent("");
      setIsReplying(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    if (!onDelete) return;
    if (confirm("この投稿を削除してもよろしいですか？")) {
      await onDelete(post.id);
    }
  };

  // リアクション処理
  const handleReaction = async (kind: string) => {
    if (!onReaction || !me) return;
    
    // 既に自分がリアクションしているかを確認
    const existingReaction = post.reactions.find(r => r.kind === kind);
    
    await onReaction(post.id, kind, !(existingReaction?.reacted));
  };

  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        {/* アバターと名前 */}
        <div className="flex-shrink-0">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full overflow-hidden bg-gray-200">
            {post.user.iconUrl ? (
              <Image
                src={post.user.iconUrl}
                alt="User avatar"
                width={40}
                height={40}
                className="h-10 w-10 object-cover"
              />
            ) : (
              <FontAwesomeIcon icon={faPen} className="text-gray-500" />
            )}
          </div>
          <div className="text-center text-xs text-gray-600">
            {post.user.name || "匿名ユーザー"}
          </div>
        </div>

        {/* 投稿内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">
              {formatDate(post.createdAt)}
              {post.createdAt !== post.updatedAt && " (編集済み)"}
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
                    <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="text-gray-500 hover:text-red-500"
                    title="削除"
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
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
                className="h-40 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1 h-3 w-3" />
                  キャンセル
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={isSubmitting || !editContent.trim()}
                >
                  <FontAwesomeIcon icon={faSave} className="mr-1 h-3 w-3" />
                  保存
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none break-words">
              <MarkdownWrapper>{post.content}</MarkdownWrapper>
            </div>
          )}

          {/* リアクションと返信ボタン */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(reactionIcons).map(([kind, icon]) => {
              const reaction = post.reactions.find(r => r.kind === kind);
              const count = reaction?.count || 0;
              const reacted = reaction?.reacted || false;
              
              return (
                <button
                  key={kind}
                  onClick={() => handleReaction(kind)}
                  className={`flex items-center rounded-full border px-2 py-1 text-xs ${
                    reacted
                      ? "border-blue-300 bg-blue-50 text-blue-600"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                  disabled={!me || isThreadLocked}
                  title={reactionLabels[kind as keyof typeof reactionLabels]}
                >
                  <FontAwesomeIcon icon={icon} className="mr-1 h-3 w-3" />
                  <span>{count > 0 ? count : ""}</span>
                </button>
              );
            })}

            {me && !isThreadLocked && onReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
              >
                <FontAwesomeIcon icon={faReply} className="mr-1 h-3 w-3" />
                <span>返信</span>
              </button>
            )}
          </div>

          {/* 返信フォーム */}
          {isReplying && (
            <div className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="h-32 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="返信を入力..."
                disabled={isSubmitting}
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setIsReplying(false)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1 h-3 w-3" />
                  キャンセル
                </button>
                <button
                  onClick={handleSubmitReply}
                  className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={isSubmitting || !replyContent.trim()}
                >
                  <FontAwesomeIcon icon={faSave} className="mr-1 h-3 w-3" />
                  返信する
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};