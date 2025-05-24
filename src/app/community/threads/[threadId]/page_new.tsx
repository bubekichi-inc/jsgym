"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { useFetch } from "@/app/_hooks/useFetch";
import { usePostsWithReplies } from "../../_hooks/usePostsWithReplies";
import { PostCard } from "../../_components/PostCard";
import { Pagination } from "../../_components/Pagination";
import { CreatePostForm } from "../../_components/CreatePostForm";
import { api } from "@/app/_utils/api";
import { UpdateThreadRequest } from "@/app/api/community/threads/route";

export default function ThreadPage() {
  const params = useParams();
  const threadId = params.threadId as string;

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [collapsedReplies, setCollapsedReplies] = useState<Set<string>>(new Set());

  // Fetch thread details
  const { data: thread, isLoading: isThreadLoading, mutate: mutateThread } = useFetch<{
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
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
  }>(`/api/community/threads/${threadId}`);

  // Fetch current user
  const { data: currentUser } = useFetch<{
    id: string;
    role: string;
  }>("/api/me");

  // Fetch posts with replies
  const {
    posts: postsWithReplies,
    isLoading: isPostsLoading,
    pagination,
    setPage,
    mutate: mutatePosts,
  } = usePostsWithReplies({ threadId });

  // Handle post creation success
  const handlePostCreated = () => {
    setReplyingTo(null);
    mutatePosts();
  };

  // Handle reply button click
  const handleReply = (postId: string) => {
    setReplyingTo(postId);
  };

  // Handle collapse/expand replies
  const handleToggleReplies = (postId: string) => {
    setCollapsedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Toggle thread lock status
  const toggleLockThread = async () => {
    if (!thread) return;

    try {
      await api.put<UpdateThreadRequest, any>(
        `/api/community/threads/${threadId}`,
        { isLocked: !thread.isLocked }
      );
      mutateThread();
    } catch (error) {
      console.error("Error toggling thread lock:", error);
    }
  };

  const isAdmin = currentUser?.role === "ADMIN";
  const canCreatePost = currentUser && (!thread?.isLocked || isAdmin);

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button and thread title */}
        <div className="mb-6">
          {thread?.category && (
            <Link
              href={`/community/categories/${thread.category.slug}`}
              className="inline-flex items-center text-sm text-blue-600 hover:underline mb-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
              {thread.category.title}カテゴリに戻る
            </Link>
          )}

          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">
              {isThreadLoading ? (
                <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
              ) : (
                thread?.title
              )}
            </h1>

            {thread && isAdmin && (
              <button
                onClick={toggleLockThread}
                className={`ml-2 px-3 py-1 rounded-md text-sm ${
                  thread.isLocked
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <FontAwesomeIcon
                  icon={thread.isLocked ? faLock : faUnlock}
                  className="mr-1"
                />
                {thread.isLocked ? "ロック中" : "ロック解除"}
              </button>
            )}
          </div>

          {thread?.isLocked && (
            <div className="mt-2 p-2 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-700">
                このスレッドはロックされています。新しい投稿はできません。
              </p>
            </div>
          )}
        </div>

        {/* Posts with replies */}
        {isPostsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-32 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : postsWithReplies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              このスレッドにはまだ投稿がありません
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {postsWithReplies.map((post) => (
              <div key={post.id}>
                {/* Main post */}
                <PostCard
                  id={post.id}
                  content={post.content}
                  createdAt={new Date(post.createdAt)}
                  updatedAt={new Date(post.updatedAt)}
                  user={post.user}
                  reactions={post.reactions}
                  replyCount={post.replyCount}
                  currentUserId={currentUser?.id}
                  isAdmin={isAdmin}
                  isThreadLocked={thread?.isLocked}
                  onReply={() => handleReply(post.id)}
                  onRefresh={mutatePosts}
                  isParent={true}
                />

                {/* Reply form for main post */}
                {replyingTo === post.id && (
                  <div className="mt-2">
                    <CreatePostForm
                      threadId={threadId}
                      parentId={post.id}
                      onCancel={() => setReplyingTo(null)}
                      onSuccess={handlePostCreated}
                    />
                  </div>
                )}

                {/* Replies section */}
                {post.replies && post.replies.length > 0 && (
                  <div className="ml-8 mt-4">
                    {/* Toggle replies button */}
                    <button
                      onClick={() => handleToggleReplies(post.id)}
                      className="mb-2 text-sm text-blue-600 hover:underline"
                    >
                      {collapsedReplies.has(post.id)
                        ? `${post.replies.length}件の返信を表示`
                        : `${post.replies.length}件の返信を隠す`
                      }
                    </button>

                    {/* Replies list */}
                    {!collapsedReplies.has(post.id) && (
                      <div className="space-y-3">
                        {post.replies.map((reply) => (
                          <div key={reply.id}>
                            <PostCard
                              id={reply.id}
                              content={reply.content}
                              createdAt={new Date(reply.createdAt)}
                              updatedAt={new Date(reply.updatedAt)}
                              user={reply.user}
                              reactions={reply.reactions}
                              replyCount={reply.replyCount}
                              currentUserId={currentUser?.id}
                              isAdmin={isAdmin}
                              isThreadLocked={thread?.isLocked}
                              onReply={() => handleReply(reply.id)}
                              onRefresh={mutatePosts}
                            />

                            {/* Reply form for reply */}
                            {replyingTo === reply.id && (
                              <div className="mt-2">
                                <CreatePostForm
                                  threadId={threadId}
                                  parentId={reply.id}
                                  onCancel={() => setReplyingTo(null)}
                                  onSuccess={handlePostCreated}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}

        {/* Create new post form */}
        {canCreatePost && (
          <div className="mt-8">
            <CreatePostForm
              threadId={threadId}
              onSuccess={handlePostCreated}
            />
          </div>
        )}
      </div>
    </div>
  );
}
