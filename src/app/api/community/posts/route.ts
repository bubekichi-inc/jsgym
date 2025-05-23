import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

// Define response type
export interface CommunityPostsResponse {
  posts: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    threadId: string;
    parentId: string | null;
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
  }[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Define query params type
export interface CommunityPostsQuery {
  threadId?: string;
  parentId?: string;
  page?: string;
  limit?: string;
}

// Schema for creating a post
const createPostSchema = z.object({
  threadId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
  content: z.string().min(5),
});

// Schema for updating a post
const updatePostSchema = z.object({
  content: z.string().min(5),
});

// Type definitions
export type CreatePostRequest = z.infer<typeof createPostSchema>;
export type UpdatePostRequest = z.infer<typeof updatePostSchema>;

// GET endpoint to fetch posts with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const url = new URL(request.url);
    const threadId = url.searchParams.get("threadId");
    const parentId = url.searchParams.get("parentId");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;
    
    // Get current user if available (for reaction status)
    let userId: string | undefined;
    try {
      const user = await getCurrentUser({ request });
      userId = user.id;
    } catch (error) {
      // No user authenticated, continue without user context
    }

    const prisma = await buildPrisma();
    
    // Prepare where conditions
    const whereConditions: any = {};

    if (threadId) {
      whereConditions.threadId = threadId;
    }

    if (parentId) {
      whereConditions.parentId = parentId;
    } else if (threadId) {
      // If we're fetching thread posts and no parentId specified, get top-level posts
      whereConditions.parentId = null;
    }

    // Count total posts matching criteria
    const total = await prisma.communityPost.count({
      where: whereConditions,
    });

    // Get posts with pagination
    const posts = await prisma.communityPost.findMany({
      where: whereConditions,
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
      orderBy: {
        createdAt: "asc",
      },
      skip: offset,
      take: limit,
    });

    // Process posts to include reaction info and reply count
    const processedPosts = await Promise.all(
      posts.map(async (post) => {
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

        // Return formatted post
        return {
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
      })
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json<CommunityPostsResponse>({
      posts: processedPosts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new post
export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await getCurrentUser({ request });

    // Validate request body
    const body = await request.json();
    const validationResult = createPostSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const prisma = await buildPrisma();

    // Check if thread exists
    const thread = await prisma.communityThread.findUnique({
      where: {
        id: data.threadId,
      },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Check if thread is locked
    if (thread.isLocked && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Thread is locked" },
        { status: 403 }
      );
    }

    // If it's a reply, check if parent post exists
    if (data.parentId) {
      const parentPost = await prisma.communityPost.findUnique({
        where: {
          id: data.parentId,
        },
      });

      if (!parentPost) {
        return NextResponse.json(
          { error: "Parent post not found" },
          { status: 404 }
        );
      }

      // Ensure parent post belongs to the same thread
      if (parentPost.threadId !== data.threadId) {
        return NextResponse.json(
          { error: "Parent post doesn't belong to the specified thread" },
          { status: 400 }
        );
      }
    }

    // Create the post
    const post = await prisma.communityPost.create({
      data: {
        threadId: data.threadId,
        userId: user.id,
        parentId: data.parentId || null,
        content: data.content,
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}