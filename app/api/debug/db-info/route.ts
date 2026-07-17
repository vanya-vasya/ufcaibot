import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export const dynamic = "force-dynamic";

// TEMPORARY diagnostic endpoint - remove after debugging credits sync issue
export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL || "";
    const host = dbUrl.match(/@([^/]+)\//)?.[1] || "unknown";

    const testUser = await prismadb.user.findUnique({
      where: { email: "testfortests2025@gmail.com" },
      select: {
        clerkId: true,
        email: true,
        usedGenerations: true,
        availableGenerations: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      dbHost: host,
      testUser,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
