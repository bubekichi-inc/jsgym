"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReply,
  faEdit,
  faTrash,
  faThumbsUp,
  faHeart,
  faLaughSquint,
  faLightbulb,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { ReactionKind } from "@prisma/client";
import { useReactions } from "../_hooks/useReactions";
import { api } from "@/app/_utils/api";
import { UpdatePostRequest } from "@/app/api/community/posts/route";

interface PostCardProps {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    iconUrl: string | null;
  };
  reactions: {
    kind: string;
    count: number;
    userReacted: boolean;
  }[];
  replyCount: number;
  currentUserId?: string;
  isAdmin?: boolean;
  isThreadLocked?: boolean;
  onReply?: (postId: string) => void;
  onEdit?: (postId: string, content: string) => void;
  onDelete?: (postId: string) => void;
  onRefresh?: () => void;
  isParent?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  id,
  content,
  createdAt,
  updatedAt,
  user,
  reactions,
  replyCount,
  currentUserId,
  isAdmin = false,
  isThreadLocked = false,
  onReply,
  onEdit,
  onDelete,
  onRefresh,
  isParent = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [localReactions, setLocalReactions] = useState(reactions);

  const { toggleReaction } = useReactions();

  // Sync local reactions with props when they change
  useEffect(() => {
    setLocalReactions(reactions);
  }, [reactions]);

  // Handle optimistic reaction toggle
  const handleReactionToggle = async (kind: ReactionKind) => {
    if (!currentUserId || isThreadLocked) return;

    // Optimistic update - immediately update local state
    setLocalReactions(prev => {
      const existingReaction = prev.find(r => r.kind === kind);

      if (existingReaction) {
        // Toggle existing reaction
        return prev.map(r =>
          r.kind === kind
            ? {
                ...r,
                count: r.userReacted ? r.count - 1 : r.count + 1,
                userReacted: !r.userReacted
              }
            : r
        );
      } else {
        // Add new reaction
        return [
          ...prev,
          {
            kind,
            count: 1,
            userReacted: true
          }
        ];
      }
    });

    try {
      // Make API request
      await toggleReaction(id, kind);
    } catch (error) {
      console.error("Error toggling reaction:", error);
      // Revert optimistic update on error
      setLocalReactions(reactions);
    }
  };

  // Handle edit submission
  const handleEditSubmit = async () => {
    if (editContent.trim() === "") return;

    try {
      await api.put<UpdatePostRequest, any>(
        `/api/community/posts/${id}`,
        { content: editContent }
      );

      setIsEditing(false);
      if (onEdit) onEdit(id, editContent);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await api.del<any>(`/api/community/posts/${id}`);

      if (onDelete) onDelete(id);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Map reaction kind to icon
  const getReactionIcon = (kind: string) => {
    switch (kind) {
      case "LIKE":
        return faThumbsUp;
      case "LOVE":
        return faHeart;
      case "LAUGH":
        return faLaughSquint;
      case "THINK":
        return faLightbulb;
      default:
        return faThumbsUp;
    }
  };

  const canModify = currentUserId && (currentUserId === user.id || isAdmin) && (!isThreadLocked || isAdmin);

  return (
    <div className={`p-4 bg-white rounded-lg shadow ${isParent ? "" : "ml-8 mt-2"}`}>
      {/* Post header with user info */}
      <div className="flex items-start space-x-3">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h4 className="font-medium text-gray-900">
                {user.name || "匿名ユーザー"}
              </h4>
              <span className="mx-2 text-xs text-gray-500">
                {formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                  locale: ja,
                })}
              </span>
              {createdAt.toString() !== updatedAt.toString() && (
                <span className="text-xs text-gray-500">
                  (編集済み)
                </span>
              )}
            </div>

            {/* Dropdown menu for edit/delete actions */}
            {canModify && !isEditing && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                  className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faEllipsisV} className="h-4 w-4 text-gray-500" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-8 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2 h-3 w-3" />
                        編集
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleting(true);
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2 h-3 w-3" />
                        削除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Post content */}
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={4}
              />
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={handleEditSubmit}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(content);
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 text-gray-800 whitespace-pre-wrap">
              {content}
            </div>
          )}

          {/* Actions row */}
          <div className="mt-4 flex flex-wrap items-center space-x-4">
            {/* Reactions */}
            <div className="flex items-center space-x-2">
              {Object.values(ReactionKind).map((kind) => {
                const reaction = localReactions.find((r) => r.kind === kind);
                const count = reaction?.count || 0;
                const userReacted = reaction?.userReacted || false;

                return (
                  <button
                    key={kind}
                    onClick={() => handleReactionToggle(kind as ReactionKind)}
                    disabled={!currentUserId || isThreadLocked}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                      userReacted
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <FontAwesomeIcon icon={getReactionIcon(kind)} />
                    {count > 0 && <span>{count}</span>}
                  </button>
                );
              })}
            </div>

            {/* Reply button */}
            {onReply && currentUserId && (!isThreadLocked || isAdmin) && (
              <button
                onClick={() => onReply(id)}
                className="flex items-center text-xs text-gray-600 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={faReply} className="mr-1" />
                {replyCount > 0 ? `返信 (${replyCount})` : "返信"}
              </button>
            )}
          </div>

          {/* Delete confirmation */}
          {isDeleting && (
            <div className="mt-2 p-3 bg-red-50 rounded-md">
              <p className="text-sm text-red-600">
                本当に削除しますか？この操作は元に戻せません。
              </p>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={handleDeleteConfirm}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  削除する
                </button>
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
