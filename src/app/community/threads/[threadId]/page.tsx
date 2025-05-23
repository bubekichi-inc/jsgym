"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { useFetch } from "@/app/_hooks/useFetch";
import { usePosts } from "../../_hooks/usePosts";
import { PostCard } from "../../_components/PostCard";
import { Pagination } from "../../_components/Pagination";
import { CreatePostForm } from "../../_components/CreatePostForm";
import { api } from "@/app/_utils/api";
import { UpdateThreadRequest } from "@/app/api/community/threads/route";

export default function ThreadPage() {
  const params = useParams();
  const threadId = params.threadId as string;
  
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [viewingReplies, setViewingReplies] = useState<string | null>(null);
  
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
  
  // Fetch posts for this thread
  const {
    posts: mainPosts,
    isLoading: isMainPostsLoading,
    pagination: mainPagination,
    setPage: setMainPage,
    mutate: mutateMainPosts,
  } = usePosts({ threadId, parentId: null });
  
  // Fetch replies if viewing replies to a specific post
  const {
    posts: replyPosts,
    isLoading: isReplyPostsLoading,
    pagination: replyPagination,
    setPage: setReplyPage,
    mutate: mutateReplyPosts,
  } = usePosts({ threadId, parentId: viewingReplies || undefined });
  
  // Handle post creation success
  const handlePostCreated = () => {
    if (replyingTo) {
      setReplyingTo(null);
      if (viewingReplies === replyingTo) {
        mutateReplyPosts();
      } else {
        mutateMainPosts();
      }
    } else {
      mutateMainPosts();
    }
  };
  
  // Handle reply button click
  const handleReply = (postId: string) => {
    setReplyingTo(postId);
  };
  
  // Handle view replies button click
  const handleViewReplies = (postId: string) => {
    setViewingReplies(postId === viewingReplies ? null : postId);
    setReplyingTo(null);
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
        
        {/* Main posts list */}
        {viewingReplies === null && (
          <>
            {isMainPostsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="h-32 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : mainPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">
                  このスレッドにはまだ投稿がありません
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {mainPosts.map((post) => (
                  <div key={post.id}>
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
                      onRefresh={mutateMainPosts}
                      isParent={true}
                    />
                    
                    {/* Reply form */}
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
                    
                    {/* View replies button */}
                    {post.replyCount > 0 && (
                      <button
                        onClick={() => handleViewReplies(post.id)}
                        className="ml-8 mt-2 text-sm text-blue-600 hover:underline"
                      >
                        {post.replyCount}件の返信を表示
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination for main posts */}
            {mainPagination && mainPagination.totalPages > 1 && (
              <Pagination
                currentPage={mainPagination.page}
                totalPages={mainPagination.totalPages}
                onPageChange={setMainPage}
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
          </>
        )}
        
        {/* Viewing replies to a specific post */}
        {viewingReplies !== null && (
          <div>
            <button
              onClick={() => setViewingReplies(null)}
              className="mb-4 text-sm text-blue-600 hover:underline"
            >
              ← メインスレッドに戻る
            </button>
            
            {mainPosts.find(post => post.id === viewingReplies) && (
              <div className="mb-4">
                <PostCard
                  id={mainPosts.find(post => post.id === viewingReplies)!.id}
                  content={mainPosts.find(post => post.id === viewingReplies)!.content}
                  createdAt={new Date(mainPosts.find(post => post.id === viewingReplies)!.createdAt)}
                  updatedAt={new Date(mainPosts.find(post => post.id === viewingReplies)!.updatedAt)}
                  user={mainPosts.find(post => post.id === viewingReplies)!.user}
                  reactions={mainPosts.find(post => post.id === viewingReplies)!.reactions}
                  replyCount={mainPosts.find(post => post.id === viewingReplies)!.replyCount}
                  currentUserId={currentUser?.id}
                  isAdmin={isAdmin}
                  isThreadLocked={thread?.isLocked}
                  onReply={() => handleReply(viewingReplies)}
                  onRefresh={() => {
                    mutateMainPosts();
                    mutateReplyPosts();
                  }}
                  isParent={true}
                />
              </div>
            )}
            
            {replyingTo === viewingReplies && (
              <div className="mb-4">
                <CreatePostForm
                  threadId={threadId}
                  parentId={viewingReplies}
                  onCancel={() => setReplyingTo(null)}
                  onSuccess={handlePostCreated}
                />
              </div>
            )}
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              返信
            </h2>
            
            {isReplyPostsLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, index) => (
                  <div
                    key={index}
                    className="h-24 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : replyPosts.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">
                  まだ返信がありません
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {replyPosts.map((post) => (
                  <div key={post.id}>
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
                      onRefresh={mutateReplyPosts}
                    />
                    
                    {/* Nested reply form */}
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
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination for replies */}
            {replyPagination && replyPagination.totalPages > 1 && (
              <Pagination
                currentPage={replyPagination.page}
                totalPages={replyPagination.totalPages}
                onPageChange={setReplyPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}