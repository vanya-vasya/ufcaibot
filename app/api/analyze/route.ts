import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { findUserByAuth } from "@/lib/api-limit";
import { chargeForAnalysis, InsufficientCreditsError } from "@/lib/analysis/credits";
import { ANALYSIS_PRODUCTS } from "@/lib/analysis/products";
import { runAnalysis } from "@/lib/analysis/run";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  product: z.enum(["odds", "stats", "news", "ultimate"]),
  fighterA: z.string().trim().min(1).max(80),
  fighterB: z.string().trim().min(1).max(80),
});

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { product, fighterA, fighterB } = parsed.data;
  const { cost } = ANALYSIS_PRODUCTS[product];

  const user = await findUserByAuth();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const remainingBefore = user.availableGenerations - user.usedGenerations;
  if (remainingBefore < cost) {
    return NextResponse.json(
      { error: "Insufficient credits", remaining: remainingBefore, required: cost },
      { status: 402 }
    );
  }

  try {
    const result = await runAnalysis(product, fighterA, fighterB);

    let remaining = remainingBefore;
    if (result.charge) {
      ({ remaining } = await chargeForAnalysis({
        clerkId: user.clerkId,
        product,
        fighterA,
        fighterB,
      }));
    }

    return NextResponse.json({
      content: result.content,
      product,
      sections: result.sections,
      sourcesAvailable: result.sourcesAvailable,
      charged: result.charge,
      cost: result.charge ? cost : 0,
      remaining,
    });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: "Insufficient credits", required: cost }, { status: 402 });
    }
    console.error("[POST /api/analyze]", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 502 });
  }
}
