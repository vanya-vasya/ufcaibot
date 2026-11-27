import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { requireAdmin, TEST_DATA_REASON } from "@/lib/admin-guard";
import { generatePdfReceipt } from "@/lib/receiptGeneration";

const formatReceiptDate = (date: Date): string =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

export async function GET(req: Request) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const id = new URL(req.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const transaction = await prismadb.transaction.findUnique({
      where: { id },
      include: { user: { select: { email: true } } },
    });

    const isReceiptAvailable =
      transaction &&
      transaction.reason === TEST_DATA_REASON &&
      transaction.type === "payment" &&
      transaction.status === "successful";

    if (!isReceiptAvailable) {
      return NextResponse.json(
        { error: "Test payment not found" },
        { status: 404 }
      );
    }

    const tokens = Number(
      transaction.description?.match(/\((\d+)\sTokens?\)/)?.[1] ?? 0
    );

    const pdfBuffer = await generatePdfReceipt(
      transaction.tracking_id,
      transaction.user.email,
      formatReceiptDate(transaction.paid_at ?? transaction.createdAt),
      tokens,
      transaction.description ?? "ufcaibot Tokens Purchase",
      transaction.amount ?? 0,
      transaction.currency ?? "EUR",
      true
    );

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="receipt-${transaction.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/test-data/receipt]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
