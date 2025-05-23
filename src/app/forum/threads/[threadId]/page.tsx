"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForumThreads, useForumPosts } from "@/app/_hooks/forum";
import { ForumLayout } from "../../_components/ForumLayout";
import { ForumPost } from "../../_components/Posts/ForumPost";
import { ForumReply } from "../../_components/Posts/ForumReply";
import { Pagination } from "@/app/q/_components/Pagination";
import {
  faArrowLeft,
  faLock,
  faUnlock,
  faEdit,
  faTrash,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMe } from "@/app/(member)/_hooks/useMe";
import { UpdateThreadRequest } from "@/app/api/forum/threads/[threadId]/route";
import { CreatePostRequest } from "@/app/api/forum/threads/[threadId]/posts/route";

export default function ThreadPage() {
  const router = useRouter();
  const params = useParams();
  const threadId = params.threadId as string;
  const { data: me } = useMe();
  
  const {
    thread,
    isLoadingThread,
    updateThread,
    deleteThread,
  } = useForumThreads({ initialThreadId: threadId });
  
  const {
    posts,
    pagination,
    isLoadingPosts,
    createPost,
    updatePost,
    deletePost,
    addReaction,
    removeReaction,
    changePage,
  } = useForumPosts({ threadId });

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newReplyContent, setNewReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = me?.id === thread?.user.id;
  const isAdmin = me?.role === "ADMIN";
  const canEdit = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;
  const canToggleLock = isAdmin;

  React.useEffect(() => {
    if (thread && !isEditing) {
      setNewTitle(thread.title);
    }
  }, [thread, isEditing]);

  if (isLoadingThread) {
    return (
      <ForumLayout>
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-500">読み込み中...</div>
        </div>
      </ForumLayout>
    );
  }

  if (!thread) {
    return (
      <ForumLayout>
        <div className="rounded-md bg-red-50 p-6">
          <p className="text-center text-red-500">スレッドが見つかりませんでした</p>
          <div className="mt-4 text-center">
            <Link
              href="/forum"
              className="inline-flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-3.5 w-3.5" />
              フォーラムトップに戻る
            </Link>
          </div>
        </div>
      </ForumLayout>
    );
  }

  // スレッドタイトル編集
  const handleUpdateThread = async () => {
    if (!thread) return;
    setIsSubmitting(true);
    
    try {
      const data: UpdateThreadRequest = {
        title: newTitle,
      };
      await updateThread(thread.id, data);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // スレッド削除
  const handleDeleteThread = async () => {
    if (!thread) return;
    const result = await deleteThread(thread.id);
    if (result) {
      router.push(`/forum/${thread.category.slug}`);
    }
  };

  // スレッドのロック状態切り替え
  const handleToggleLock = async () => {
    if (!thread) return;
    const data: UpdateThreadRequest = {
      title: thread.title,
      isLocked: !thread.isLocked,
    };
    await updateThread(thread.id, data);
  };

  // 新規投稿の作成
  const handleCreateReply = async () => {
    if (!thread) return;
    setIsSubmitting(true);
    
    try {
      const data: CreatePostRequest = {
        content: newReplyContent,
      };
      await createPost(data);
      setNewReplyContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 投稿の編集
  const handleEditPost = async (postId: string, content: string) => {
    await updatePost(postId, { content });
  };

  // 投稿の削除
  const handleDeletePost = async (postId: string) => {
    await deletePost(postId);
  };

  // 返信の作成
  const handleSubmitReply = async (parentId: string, content: string) => {
    const data: CreatePostRequest = {
      content,
      parentId,
    };
    await createPost(data);
  };

  // リアクション処理
  const handleReaction = async (postId: string, kind: string, add: boolean) => {
    if (add) {
      await addReaction(postId, { kind: kind as any });
    } else {
      await removeReaction(postId, kind);
    }
  };

  return (
    <ForumLayout showHeader={false}>
      <div className="mb-6">
        <Link
          href={`/forum/${thread.category.slug}`}
          className="inline-flex items-center text-sm text-gray-600 hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1 h-3 w-3" />
          {thread.category.title}カテゴリに戻る
        </Link>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
          {isEditing ? (
            <div className="w-full md:w-auto md:flex-1">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleUpdateThread}
                  className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={isSubmitting || !newTitle.trim()}
                >
                  保存
                </button>
              </div>
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-gray-800">
              {thread.isLocked && (
                <FontAwesomeIcon
                  icon={faLock}
                  className="mr-2 h-4 w-4 text-gray-500"
                  title="ロック済み"
                />
              )}
              {thread.title}
            </h1>
          )}

          {/* 管理ボタン */}
          {!isEditing && (
            <div className="flex flex-wrap gap-2">
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-1 h-3.5 w-3.5" />
                  編集
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDeleteThread}
                  className="inline-flex items-center rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1 h-3.5 w-3.5" />
                  削除
                </button>
              )}
              {canToggleLock && (
                <button
                  onClick={handleToggleLock}
                  className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium ${
                    thread.isLocked
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={thread.isLocked ? faUnlock : faLock}
                    className="mr-1 h-3.5 w-3.5"
                  />
                  {thread.isLocked ? "ロック解除" : "ロックする"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {isLoadingPosts ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-500">読み込み中...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">投稿がありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="space-y-3">
              <ForumPost
                post={post}
                isThreadLocked={thread.isLocked}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onReply={handleSubmitReply}
                onReaction={handleReaction}
              />
              
              {/* 返信一覧 */}
              {post.replies && post.replies.length > 0 && (
                <div className="ml-10 rounded-md border border-gray-100 bg-gray-50">
                  {post.replies.map((reply) => (
                    <ForumReply
                      key={reply.id}
                      reply={reply}
                      isThreadLocked={thread.isLocked}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ページネーション */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={changePage}
          />
        </div>
      )}

      {/* 新規投稿フォーム */}
      {me && !thread.isLocked && (
        <div className="mt-8 rounded-md border bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">新規投稿</h3>
          <textarea
            value={newReplyContent}
            onChange={(e) => setNewReplyContent(e.target.value)}
            className="h-40 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="投稿内容を入力..."
            disabled={isSubmitting}
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleCreateReply}
              className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isSubmitting || !newReplyContent.trim()}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2 h-3.5 w-3.5" />
              投稿する
            </button>
          </div>
        </div>
      )}

      {/* ログイン促進またはロック通知 */}
      {!me && (
        <div className="mt-8 rounded-md bg-blue-50 p-4 text-center">
          <p className="text-blue-700">
            投稿するには<Link href="/login" className="font-bold underline">ログイン</Link>が必要です
          </p>
        </div>
      )}

      {me && thread.isLocked && (
        <div className="mt-8 rounded-md bg-yellow-50 p-4 text-center">
          <p className="text-yellow-700">
            このスレッドはロックされているため、新しい投稿はできません
          </p>
        </div>
      )}
    </ForumLayout>
  );
}