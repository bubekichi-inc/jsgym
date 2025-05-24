import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";
import { UpdateThreadRequest } from "../route";

// GET endpoint to fetch a specific thread
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      threadId: string;
    }>;
  }
) {
  try {
    const resolvedParams = await params;
    const { threadId } = resolvedParams;
    const prisma = await buildPrisma();

    // Find the thread with category and user info
    const thread = await prisma.communityThread.findUnique({
      where: {
        id: threadId,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            iconUrl: true,
          },
        },
      },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.communityThread.update({
      where: {
        id: threadId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // Get post count
    const postCount = await prisma.communityPost.count({
      where: {
        threadId: thread.id,
      },
    });

    return NextResponse.json({
      ...thread,
      postCount,
    });
  } catch (error) {
    console.error("Failed to fetch thread:", error);
    return NextResponse.json(
      { error: "Failed to fetch thread" },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a thread
export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      threadId: string;
    }>;
  }
) {
  try {
    const user = await getCurrentUser({ request });
    const resolvedParams = await params;
    const { threadId } = resolvedParams;
    const prisma = await buildPrisma();

    // Check if thread exists
    const thread = await prisma.communityThread.findUnique({
      where: {
        id: threadId,
      },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to update
    if (thread.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You don't have permission to update this thread" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body: UpdateThreadRequest = await request.json();

    // Update the thread
    const updatedThread = await prisma.communityThread.update({
      where: {
        id: threadId,
      },
      data: {
        title: body.title,
        isLocked: body.isLocked,
      },
    });

    return NextResponse.json(updatedThread);
  } catch (error) {
    console.error("Failed to update thread:", error);
    return NextResponse.json(
      { error: "Failed to update thread" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a thread
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      threadId: string;
    }>;
  }
) {
  try {
    const user = await getCurrentUser({ request });
    const resolvedParams = await params;
    const { threadId } = resolvedParams;
    const prisma = await buildPrisma();

    // Check if thread exists
    const thread = await prisma.communityThread.findUnique({
      where: {
        id: threadId,
      },
    });

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to delete
    if (thread.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You don't have permission to delete this thread" },
        { status: 403 }
      );
    }

    // Delete the thread (cascades to posts)
    await prisma.communityThread.delete({
      where: {
        id: threadId,
      },
    });

    return NextResponse.json({ message: "Thread deleted successfully" });
  } catch (error) {
    console.error("Failed to delete thread:", error);
    return NextResponse.json(
      { error: "Failed to delete thread" },
      { status: 500 }
    );
  }
}