import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export const dynamic = "force-dynamic";

// TEMPORARY diagnostic endpoint - remove after debugging credits sync issue
export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL || "";
    const host = dbUrl.match(/@([^/]+)\//)?.[1] || "unknown";

    const [userCount, users] = await Promise.all([
      prismadb.user.count(),
      prismadb.user.findMany({
        select: {
          email: true,
          clerkId: true,
          usedGenerations: true,
          availableGenerations: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 20,
      }),
    ]);

    return NextResponse.json({
      dbHost: host,
      userCount,
      users,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
