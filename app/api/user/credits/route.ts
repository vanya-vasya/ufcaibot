import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ available: 0, used: 0, remaining: 0 }, { status: 401 });
    }

    // Primary lookup by clerkId
    let user = await prismadb.user.findUnique({
      where: { clerkId: userId },
      select: { availableGenerations: true, usedGenerations: true, clerkId: true },
    });

    // Fallback: lookup by email (handles manually-created users with fake clerkIds)
    if (!user) {
      const clerkUser = await currentUser();
      const primaryEmail = clerkUser?.emailAddresses?.[0]?.emailAddress;

      if (primaryEmail) {
        const userByEmail = await prismadb.user.findUnique({
          where: { email: primaryEmail },
          select: { availableGenerations: true, usedGenerations: true, clerkId: true, id: true },
        });

        if (userByEmail) {
          // Sync the clerkId in the DB so future lookups work directly
          await prismadb.user.update({
            where: { email: primaryEmail },
            data: { clerkId: userId },
          });
          user = userByEmail;
        }
      }
    }

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
