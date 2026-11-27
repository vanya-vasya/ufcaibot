import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import prismadb from "@/lib/prismadb";
import {
  requireAdmin,
  TEST_DATA_REASON,
  TEST_TRACKING_PREFIX,
  TEST_USER_PREFIX,
} from "@/lib/admin-guard";
import { currencies } from "@/constants/index";

const MAX_PAYMENTS = 500;
const MAX_ACTIVITY = 10000;
const PAYMENT_HOUR_UTC = 12;

const paymentSchema = z.object({
  id: z.string().regex(/^cmp[a-z0-9]{22}$/),
  date: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/),
  amount: z.number().min(0).max(100000),
  currency: z.enum(currencies),
  tokens: z.number().int().min(0).max(1000000),
  status: z.enum(["successful", "failed", "pending"]),
});

const activitySchema = z.object({
  ts: z.number().int().positive(),
  tool: z.string().min(1).max(100),
  tokensUsed: z.number().int().min(1).max(100000),
});

const saveSchema = z.object({
  email: z.string().email().max(254),
  payments: z.array(paymentSchema).max(MAX_PAYMENTS),
  activity: z.array(activitySchema).max(MAX_ACTIVITY),
});

const parsePaymentDate = (value: string): Date | null => {
  const [day, month, year] = value.split(".").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, PAYMENT_HOUR_UTC));
  const isValid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
  return isValid ? date : null;
};

const isTestUser = (clerkId: string) => clerkId.startsWith(TEST_USER_PREFIX);

export async function POST(req: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const parsed = saveSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const { payments, activity } = parsed.data;

    const paymentDates = payments.map((payment) =>
      parsePaymentDate(payment.date)
    );
    if (paymentDates.some((date) => date === null)) {
      return NextResponse.json(
        { error: "Invalid payment date" },
        { status: 400 }
      );
    }

    const purchasedTokens = payments
      .filter((payment) => payment.status === "successful")
      .reduce((sum, payment) => sum + payment.tokens, 0);
    const spentTokens = activity.reduce((sum, row) => sum + row.tokensUsed, 0);

    if (spentTokens > purchasedTokens) {
      return NextResponse.json(
        {
          error: `Tokens spent (${spentTokens}) exceed tokens from successful payments (${purchasedTokens}).`,
        },
        { status: 400 }
      );
    }

    const existingUser = await prismadb.user.findUnique({ where: { email } });
    if (existingUser && !isTestUser(existingUser.clerkId)) {
      return NextResponse.json(
        { error: "This email belongs to a real user. Use a test email." },
        { status: 409 }
      );
    }

    const clerkId =
      existingUser?.clerkId ??
      `${TEST_USER_PREFIX}${randomUUID().replace(/-/g, "").slice(0, 16)}`;

    const paymentData = payments.map((payment, index) => {
      const paidAt = paymentDates[index] as Date;
      const isSuccessful = payment.status === "successful";
      return {
        id: payment.id,
        tracking_id: `${TEST_TRACKING_PREFIX}${payment.id}`,
        userId: clerkId,
        status: payment.status,
        amount: Math.round(payment.amount * 100),
        currency: payment.currency,
        description: `ufcaibot Tokens Purchase (${payment.tokens} Tokens)`,
        type: "payment",
        payment_method_type: "card",
        message: "Test transaction",
        paid_at: isSuccessful ? paidAt : null,
        createdAt: paidAt,
        reason: TEST_DATA_REASON,
        webhookEventId: `test-${payment.id}`,
      };
    });

    const activityData = activity.map((row, index) => ({
      tracking_id: `${TEST_TRACKING_PREFIX}act-${clerkId}-${index}`,
      userId: clerkId,
      status: "completed",
      amount: -row.tokensUsed,
      type: "debit",
      description: `${row.tool} (test data)`,
      reason: TEST_DATA_REASON,
      webhookEventId: `test-act-${clerkId}-${index}`,
      paid_at: new Date(row.ts),
      createdAt: new Date(row.ts),
    }));

    await prismadb.$transaction([
      prismadb.transaction.deleteMany({ where: { userId: clerkId } }),
      prismadb.user.upsert({
        where: { email },
        create: {
          clerkId,
          email,
          photo: "",
          firstName: "Test",
          lastName: "User",
          availableGenerations: purchasedTokens,
          usedGenerations: spentTokens,
        },
        update: {
          availableGenerations: purchasedTokens,
          usedGenerations: spentTokens,
        },
      }),
      prismadb.transaction.createMany({ data: paymentData }),
      prismadb.transaction.createMany({ data: activityData }),
    ]);

    return NextResponse.json({
      success: true,
      userId: clerkId,
      email,
      available: purchasedTokens,
      used: spentTokens,
      remaining: purchasedTokens - spentTokens,
      paymentsSaved: paymentData.length,
      activitySaved: activityData.length,
    });
  } catch (error) {
    console.error("[POST /api/admin/test-data]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const email = new URL(req.url).searchParams.get("email")?.toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const user = await prismadb.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!isTestUser(user.clerkId)) {
      return NextResponse.json(
        { error: "Only test users can be purged." },
        { status: 409 }
      );
    }

    const [deletedTransactions] = await prismadb.$transaction([
      prismadb.transaction.deleteMany({ where: { userId: user.clerkId } }),
      prismadb.user.delete({ where: { clerkId: user.clerkId } }),
    ]);

    return NextResponse.json({
      success: true,
      deletedTransactions: deletedTransactions.count,
    });
  } catch (error) {
    console.error("[DELETE /api/admin/test-data]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
