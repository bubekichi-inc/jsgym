import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";
import { UpdatePostRequest } from "../route";

// GET endpoint to fetch a specific post
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      postId: string;
    }>;
  }
) {
  try {
    const resolvedParams = await params;
    const { postId } = resolvedParams;
    const prisma = await buildPrisma();

    // Try to get user for reaction info
    let userId: string | undefined;
    try {
      const user = await getCurrentUser({ request });
      userId = user.id;
    } catch (error) {
      // No user authenticated, continue without user context
    }

    // Find the post
    const post = await prisma.communityPost.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            iconUrl: true,
          },
        },
        reactions: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Count replies
    const replyCount = await prisma.communityPost.count({
      where: {
        parentId: post.id,
      },
    });

    // Group reactions by type and count them
    const reactionGroups = post.reactions.reduce(
      (acc: Record<string, { count: number; userIds: string[] }>, reaction) => {
        if (!acc[reaction.kind]) {
          acc[reaction.kind] = { count: 0, userIds: [] };
        }
        acc[reaction.kind].count++;
        acc[reaction.kind].userIds.push(reaction.userId);
        return acc;
      },
      {}
    );

    // Format reactions for response
    const reactions = Object.entries(reactionGroups).map(([kind, data]) => ({
      kind,
      count: data.count,
      userReacted: userId ? data.userIds.includes(userId) : false,
    }));

    // Format response
    const response = {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      threadId: post.threadId,
      parentId: post.parentId,
      user: post.user,
      reactions,
      replyCount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a post
export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      postId: string;
    }>;
  }
) {
  try {
    const user = await getCurrentUser({ request });
    const resolvedParams = await params;
    const { postId } = resolvedParams;
    const prisma = await buildPrisma();

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: {
        id: postId,
      },
      include: {
        thread: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if thread is locked
    if (post.thread.isLocked && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Thread is locked" },
        { status: 403 }
      );
    }

    // Check if user has permission to update
    if (post.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You don't have permission to update this post" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body: UpdatePostRequest = await request.json();

    // Update the post
    const updatedPost = await prisma.communityPost.update({
      where: {
        id: postId,
      },
      data: {
        content: body.content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            iconUrl: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a post
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      postId: string;
    }>;
  }
) {
  try {
    const user = await getCurrentUser({ request });
    const resolvedParams = await params;
    const { postId } = resolvedParams;
    const prisma = await buildPrisma();

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: {
        id: postId,
      },
      include: {
        thread: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if thread is locked
    if (post.thread.isLocked && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Thread is locked" },
        { status: 403 }
      );
    }

    // Check if user has permission to delete
    if (post.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You don't have permission to delete this post" },
        { status: 403 }
      );
    }

    // Check if it's the first post in the thread
    const isFirstPost = await prisma.communityPost.findFirst({
      where: {
        threadId: post.threadId,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
      },
    });

    // If it's the first post, delete the entire thread
    if (isFirstPost?.id === post.id) {
      await prisma.communityThread.delete({
        where: {
          id: post.threadId,
        },
      });
      return NextResponse.json({ message: "Thread deleted successfully" });
    }

    // Otherwise, just delete the post
    await prisma.communityPost.delete({
      where: {
        id: postId,
      },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}