import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const FIGHT_ANALYSIS_COST = 100;

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { fight = "Fight Analysis", fighterA = "", fighterB = "" } = body;

    // Primary lookup by clerkId; fallback to email
    let user = await prismadb.user.findUnique({ where: { clerkId: userId } });

    if (!user) {
      const clerkUser = await currentUser();
      const primaryEmail = clerkUser?.emailAddresses?.[0]?.emailAddress;
      if (primaryEmail) {
        user = await prismadb.user.findUnique({ where: { email: primaryEmail } });
        if (user) {
          await prismadb.user.update({
            where: { email: primaryEmail },
            data: { clerkId: userId },
          });
          user = { ...user, clerkId: userId };
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const remaining = user.availableGenerations - user.usedGenerations;

    if (remaining < FIGHT_ANALYSIS_COST) {
      return NextResponse.json(
        { error: "Insufficient credits", remaining },
        { status: 402 }
      );
    }

    // Deduct credits and record transaction atomically
    const [updatedUser, transaction] = await prismadb.$transaction([
      prismadb.user.update({
        where: { clerkId: user.clerkId },
        data: { usedGenerations: { increment: FIGHT_ANALYSIS_COST } },
        select: { availableGenerations: true, usedGenerations: true },
      }),
      prismadb.transaction.create({
        data: {
          tracking_id: `fight_${Date.now()}_${userId.slice(-8)}`,
          userId: user.clerkId,
          status: "completed",
          amount: -FIGHT_ANALYSIS_COST,
          type: "debit",
          description: fight
            ? `Fight Analysis: ${fighterA} vs ${fighterB}`
            : "Fight Analysis",
          reason: "fight_analysis",
          webhookEventId: `fight_${Date.now()}`,
          paid_at: new Date(),
        },
      }),
    ]);

    const newRemaining = Math.max(
      0,
      updatedUser.availableGenerations - updatedUser.usedGenerations
    );

    return NextResponse.json({
      success: true,
      deducted: FIGHT_ANALYSIS_COST,
      remaining: newRemaining,
      available: updatedUser.availableGenerations,
      used: updatedUser.usedGenerations,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("[POST /api/user/deduct-credits]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
