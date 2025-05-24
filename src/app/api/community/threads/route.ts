import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

// Define response type
export interface CommunityThreadsResponse {
  threads: {
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
    postCount: number;
  }[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Define query params type
export interface CommunityThreadsQuery {
  categoryId?: string;
  categorySlug?: string;
  page?: string;
  limit?: string;
  search?: string;
}

// Schema for creating a thread
const createThreadSchema = z.object({
  categoryId: z.string().uuid(),
  title: z.string().min(5).max(200),
  content: z.string().min(10),
});

// Schema for updating a thread
const updateThreadSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  isLocked: z.boolean().optional(),
});

// Type definitions
export type CreateThreadRequest = z.infer<typeof createThreadSchema>;
export type UpdateThreadRequest = z.infer<typeof updateThreadSchema>;

// GET endpoint to fetch threads with optional filtering
export async function GET(request: NextRequest) {
  try {
    const prisma = await buildPrisma();
    
    // Extract query parameters
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("categoryId") || undefined;
    const categorySlug = url.searchParams.get("categorySlug") || undefined;
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;
    
    // Prepare where conditions
    const whereConditions: any = {
      title: {
        contains: search,
        mode: "insensitive",
      },
    };

    // If category is provided, add to filter
    if (categoryId) {
      whereConditions.categoryId = categoryId;
    } else if (categorySlug) {
      const category = await prisma.communityCategory.findUnique({
        where: { slug: categorySlug },
        select: { id: true }
      });
      
      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
      
      whereConditions.categoryId = category.id;
    }

    // Count total threads matching criteria
    const total = await prisma.communityThread.count({
      where: whereConditions,
    });

    // Get threads with pagination
    const threads = await prisma.communityThread.findMany({
      where: whereConditions,
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            iconUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    // Get post count for each thread
    const threadsWithPostCount = await Promise.all(
      threads.map(async (thread) => {
        const postCount = await prisma.communityPost.count({
          where: {
            threadId: thread.id,
          },
        });
        return {
          ...thread,
          postCount,
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json<CommunityThreadsResponse>({
      threads: threadsWithPostCount,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Failed to fetch threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new thread
export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await getCurrentUser({ request });

    // Validate request body
    const body = await request.json();
    const validationResult = createThreadSchema.safeParse(body);

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

    // Check if category exists
    const category = await prisma.communityCategory.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Create thread and first post in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the thread
      const thread = await tx.communityThread.create({
        data: {
          categoryId: data.categoryId,
          userId: user.id,
          title: data.title,
        },
      });

      // Create the first post in the thread
      const post = await tx.communityPost.create({
        data: {
          threadId: thread.id,
          userId: user.id,
          content: data.content,
        },
      });

      return { thread, post };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Failed to create thread:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}