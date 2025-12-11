import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export const maxDuration = 60;

// Pagination defaults
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

interface CreatePredictionBody {
  event?: string;
  fight: string;
  fighterA: string;
  fighterB: string;
  content: string;
  imageUrl?: string;
}

interface PaginatedResponse {
  predictions: Array<{
    id: string;
    userId: string;
    event: string | null;
    fight: string;
    fighterA: string;
    fighterB: string;
    content: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * GET /api/predictions
 * Fetch predictions for the authenticated user with pagination
 * Query params:
 *   - page: number (default: 1)
 *   - pageSize: number (default: 10, max: 50)
 */
export async function GET(req: Request): Promise<NextResponse<PaginatedResponse | { error: string }>> {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || String(DEFAULT_PAGE)));
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(url.searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE)))
    );

    const skip = (page - 1) * pageSize;

    // Get total count for pagination metadata
    const totalCount = await prismadb.prediction.count({
      where: { userId },
    });

    // Fetch predictions with pagination, sorted by createdAt desc
    const predictions = await prismadb.prediction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      predictions,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("[PREDICTIONS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/predictions
 * Save a new prediction for the authenticated user
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreatePredictionBody = await req.json();

    // Validate required fields
    if (!body.fight || !body.fighterA || !body.fighterB || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: fight, fighterA, fighterB, content" },
        { status: 400 }
      );
    }

    // Create the prediction
    const prediction = await prismadb.prediction.create({
      data: {
        userId,
        event: body.event || null,
        fight: body.fight,
        fighterA: body.fighterA,
        fighterB: body.fighterB,
        content: body.content,
        imageUrl: body.imageUrl || null,
      },
    });

    return NextResponse.json({ prediction }, { status: 201 });
  } catch (error) {
    console.error("[PREDICTIONS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/predictions?id=xxx
 * Delete a prediction by ID (only if owned by the user)
 */
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const predictionId = url.searchParams.get("id");

    if (!predictionId) {
      return NextResponse.json({ error: "Missing prediction id" }, { status: 400 });
    }

    // Verify ownership before deleting
    const prediction = await prismadb.prediction.findFirst({
      where: {
        id: predictionId,
        userId,
      },
    });

    if (!prediction) {
      return NextResponse.json({ error: "Prediction not found" }, { status: 404 });
    }

    await prismadb.prediction.delete({
      where: { id: predictionId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[PREDICTIONS_DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
