import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";
import { ReactionKind } from "@prisma/client";

// Schema for creating a reaction
const reactionSchema = z.object({
  postId: z.string().uuid(),
  kind: z.nativeEnum(ReactionKind),
});

// Type definition
export type ReactionRequest = z.infer<typeof reactionSchema>;

// POST endpoint to add a reaction to a post
export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await getCurrentUser({ request });

    // Validate request body
    const body = await request.json();
    const validationResult = reactionSchema.safeParse(body);

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

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: {
        id: data.postId,
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

    // Check if user has already reacted with this kind
    const existingReaction = await prisma.communityReaction.findFirst({
      where: {
        postId: data.postId,
        userId: user.id,
        kind: data.kind,
      },
    });

    if (existingReaction) {
      // If reaction already exists, remove it (toggle behavior)
      await prisma.communityReaction.delete({
        where: {
          id: existingReaction.id,
        },
      });

      return NextResponse.json({
        message: "Reaction removed",
        added: false,
      });
    }

    // Create the reaction
    await prisma.communityReaction.create({
      data: {
        postId: data.postId,
        userId: user.id,
        kind: data.kind,
      },
    });

    return NextResponse.json(
      {
        message: "Reaction added",
        added: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to process reaction:", error);
    return NextResponse.json(
      { error: "Failed to process reaction" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a reaction
export async function DELETE(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await getCurrentUser({ request });

    // Extract query parameters
    const url = new URL(request.url);
    const postId = url.searchParams.get("postId");
    const kind = url.searchParams.get("kind") as ReactionKind | null;

    if (!postId || !kind || !Object.values(ReactionKind).includes(kind)) {
      return NextResponse.json(
        { error: "Invalid parameters, postId and valid kind required" },
        { status: 400 }
      );
    }

    const prisma = await buildPrisma();

    // Find the reaction
    const reaction = await prisma.communityReaction.findFirst({
      where: {
        postId,
        userId: user.id,
        kind,
      },
    });

    if (!reaction) {
      return NextResponse.json(
        { error: "Reaction not found" },
        { status: 404 }
      );
    }

    // Delete the reaction
    await prisma.communityReaction.delete({
      where: {
        id: reaction.id,
      },
    });

    return NextResponse.json({ message: "Reaction removed" });
  } catch (error) {
    console.error("Failed to remove reaction:", error);
    return NextResponse.json(
      { error: "Failed to remove reaction" },
      { status: 500 }
    );
  }
}