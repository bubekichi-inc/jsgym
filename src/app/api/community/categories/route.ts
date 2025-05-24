import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "../../_utils/getCurrentUser";
import { buildPrisma } from "@/app/_utils/prisma";

// Define response type
export interface CommunityCategoriesResponse {
  categories: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    threadCount: number;
  }[];
}

// Define query params type
export interface CommunityCategoriesQuery {
  search?: string;
}

// Schema for creating a category
const createCategorySchema = z.object({
  slug: z.string().min(3).max(50),
  title: z.string().min(3).max(100),
  description: z.string().optional(),
});

// Schema for updating a category
const updateCategorySchema = z.object({
  slug: z.string().min(3).max(50).optional(),
  title: z.string().min(3).max(100).optional(),
  description: z.string().optional(),
});

// Type definitions
export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>;

// GET endpoint to fetch all categories
export async function GET(request: NextRequest) {
  try {
    const prisma = await buildPrisma();
    
    // Extract search query if present
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    
    // Get all categories with thread count
    const categories = await prisma.communityCategory.findMany({
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get thread count for each category
    const categoriesWithThreadCount = await Promise.all(
      categories.map(async (category) => {
        const threadCount = await prisma.communityThread.count({
          where: {
            categoryId: category.id,
          },
        });
        return {
          ...category,
          threadCount,
        };
      })
    );

    return NextResponse.json<CommunityCategoriesResponse>({
      categories: categoriesWithThreadCount,
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new category
export async function POST(request: NextRequest) {
  try {
    // Verify admin permission
    const user = await getCurrentUser({ request });
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin permission required" },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validationResult = createCategorySchema.safeParse(body);

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

    // Check if slug already exists
    const existingCategory = await prisma.communityCategory.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    // Create the category
    const newCategory = await prisma.communityCategory.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}