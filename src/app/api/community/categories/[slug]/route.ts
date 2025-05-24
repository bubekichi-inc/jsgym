import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";
import { UpdateCategoryRequest } from "../route";

// GET endpoint to fetch a specific category by slug
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const prisma = await buildPrisma();

    // Find the category
    const category = await prisma.communityCategory.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Get thread count
    const threadCount = await prisma.communityThread.count({
      where: {
        categoryId: category.id,
      },
    });

    return NextResponse.json({
      ...category,
      threadCount,
    });
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a category
export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  try {
    // Verify admin permission
    const user = await getCurrentUser({ request });
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin permission required" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const prisma = await buildPrisma();

    // Check if category exists
    const existingCategory = await prisma.communityCategory.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body: UpdateCategoryRequest = await request.json();

    // If updating slug, check if new slug already exists
    if (body.slug && body.slug !== slug) {
      const slugExists = await prisma.communityCategory.findUnique({
        where: {
          slug: body.slug,
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Category with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update the category
    const updatedCategory = await prisma.communityCategory.update({
      where: {
        slug: slug,
      },
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Failed to update category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a category
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  try {
    // Verify admin permission
    const user = await getCurrentUser({ request });
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin permission required" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const prisma = await buildPrisma();

    // Check if category exists
    const existingCategory = await prisma.communityCategory.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Delete the category (cascades to threads and posts)
    await prisma.communityCategory.delete({
      where: {
        slug: slug,
      },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}