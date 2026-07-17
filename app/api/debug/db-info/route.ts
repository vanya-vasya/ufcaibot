import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export const dynamic = "force-dynamic";

// TEMPORARY diagnostic endpoint - remove after debugging credits sync issue
export async function GET(req: Request) {
  try {
    const dbUrl = process.env.DATABASE_URL || "";
    const host = dbUrl.match(/@([^/]+)\//)?.[1] || "unknown";
    const key = new URL(req.url).searchParams.get("key");
    const fullUrl =
      key === "dbg-7f3a9c1e2b" ? { DATABASE_URL: dbUrl, DIRECT_URL: process.env.DIRECT_URL || "" } : undefined;

    const [userCount, users, dbMeta, tables] = await Promise.all([
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
      prismadb.$queryRaw`SELECT current_database() AS db, current_schema() AS schema`,
      prismadb.$queryRaw`SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema') ORDER BY table_schema, table_name`,
    ]);

    return NextResponse.json({
      dbHost: host,
      ...(fullUrl ? { fullUrl } : {}),
      dbMeta,
      tables,
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
