import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ available: 0, used: 0, remaining: 0 }, { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: { clerkId: userId },
      select: { availableGenerations: true, usedGenerations: true },
    });

    if (!user) {
      return NextResponse.json({ available: 0, used: 0, remaining: 0 });
    }

    const remaining = Math.max(0, user.availableGenerations - user.usedGenerations);

    return NextResponse.json({
      available: user.availableGenerations,
      used: user.usedGenerations,
      remaining,
    });
  } catch (error) {
    console.error("[GET /api/user/credits]", error);
    return NextResponse.json({ available: 0, used: 0, remaining: 0 }, { status: 500 });
  }
}
