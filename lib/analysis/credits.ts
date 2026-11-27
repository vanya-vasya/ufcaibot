import prismadb from "@/lib/prismadb";
import { ANALYSIS_PRODUCTS, type AnalysisProductId } from "./products";

export class InsufficientCreditsError extends Error {
  constructor() {
    super("Insufficient credits");
    this.name = "InsufficientCreditsError";
  }
}

interface ChargeParams {
  clerkId: string;
  product: AnalysisProductId;
  fighterA: string;
  fighterB: string;
}

/**
 * Debits the product price and records the transaction atomically.
 * The balance guard lives in the UPDATE itself, so concurrent requests cannot overspend.
 */
export const chargeForAnalysis = async ({
  clerkId,
  product,
  fighterA,
  fighterB,
}: ChargeParams): Promise<{ remaining: number; cost: number }> => {
  const { cost, label } = ANALYSIS_PRODUCTS[product];

  return prismadb.$transaction(async (tx) => {
    const updatedRows = await tx.$executeRaw`
      UPDATE "User"
      SET "usedGenerations" = "usedGenerations" + ${cost}
      WHERE "clerkId" = ${clerkId}
        AND "availableGenerations" - "usedGenerations" >= ${cost}
    `;
    if (updatedRows === 0) throw new InsufficientCreditsError();

    const user = await tx.user.findUniqueOrThrow({
      where: { clerkId },
      select: { availableGenerations: true, usedGenerations: true },
    });

    await tx.transaction.create({
      data: {
        tracking_id: `analysis_${product}_${Date.now()}_${clerkId.slice(-8)}`,
        userId: clerkId,
        status: "completed",
        amount: -cost,
        type: "debit",
        description: `${label} Analysis: ${fighterA} vs ${fighterB}`,
        reason: `analysis_${product}`,
        webhookEventId: `analysis_${product}_${Date.now()}`,
        paid_at: new Date(),
      },
    });

    return {
      cost,
      remaining: Math.max(0, user.availableGenerations - user.usedGenerations),
    };
  });
};
