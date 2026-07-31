import { transporter } from "@/config/nodemailer";
import { findUserForPayment } from "@/lib/payments";
import prismadb from "@/lib/prismadb";
import { generatePdfReceipt } from "@/lib/receiptGeneration";
import { PUBLIC_KEY } from "@/constants/index";
import { createPublicKey, verify } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const GATEWAY_URL =
  process.env.SECURE_PROCESSOR_GATEWAY_URL ??
  "https://gateway.secure-processor.com";

type ProcessorTransaction = {
  uid: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  tracking_id: string;
  type: string;
  payment_method_type: string | null;
  message: string | null;
  paid_at: string | null;
  receipt_url: string | null;
  customer?: { email?: string | null } | null;
};

const chunkSplit = (str: string, length: number): string => {
  const chunked = [];
  for (let i = 0; i < str.length; i += length) {
    chunked.push(str.slice(i, i + length));
  }
  return chunked.join("\n");
};

const verifySignature = (
  rawBody: string,
  signature: string | null
): boolean => {
  if (!signature) return false;

  const shopPublicKey = process.env.SECURE_PROCESSOR_PUBLIC_KEY || PUBLIC_KEY;

  try {
    const formattedPublicKey = `-----BEGIN PUBLIC KEY-----\n${chunkSplit(
      shopPublicKey,
      64
    )}\n-----END PUBLIC KEY-----`;
    const publicKey = createPublicKey(formattedPublicKey);

    return verify(
      "sha256",
      Buffer.from(rawBody),
      publicKey,
      Buffer.from(signature, "base64")
    );
  } catch (error) {
    console.error("[payment webhook] Signature verification threw:", error);
    return false;
  }
};

// The gateway is the source of truth: a notification we cannot verify by
// signature is only trusted after re-fetching the transaction by uid with
// our shop credentials.
const fetchTransactionFromGateway = async (
  uid: string
): Promise<ProcessorTransaction | null> => {
  const shopId = process.env.SECURE_PROCESSOR_SHOP_ID || "29959";
  const secretKey =
    process.env.SECURE_PROCESSOR_SECRET_KEY ||
    "dbfb6f4e977f49880a6ce3c939f1e7be645a5bb2596c04d9a3a7b32d52378950";

  try {
    const response = await fetch(`${GATEWAY_URL}/transactions/${uid}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString(
          "base64"
        )}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `[payment webhook] Gateway lookup for uid ${uid} failed with ${response.status}`
      );
      return null;
    }

    const data = await response.json();
    return data?.transaction ?? null;
  } catch (error) {
    console.error(
      `[payment webhook] Gateway lookup for uid ${uid} threw:`,
      error
    );
    return null;
  }
};

const sendReceiptEmail = async (
  transaction: ProcessorTransaction,
  tokens: number
): Promise<void> => {
  const customerEmail = transaction.customer?.email;
  if (!customerEmail) {
    console.error(
      `[payment webhook] No customer email on transaction ${transaction.uid}, skipping receipt`
    );
    return;
  }

  const receiptId = transaction.uid.split("-").pop() ?? transaction.uid;

  const pdfBuffer = await generatePdfReceipt(
    receiptId,
    customerEmail,
    new Date(Date.now()).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }),
    tokens,
    transaction.description,
    transaction.amount,
    transaction.currency
  );

  await transporter.sendMail({
    from: process.env.OUTBOX_EMAIL,
    to: customerEmail,
    subject: `Receipt #${receiptId} - ufcaibot Tokens Purchase`,
    text: `Hi there,

We're excited to welcome you to ufcaibot — thanks so much for your recent order

You'll find your transaction receipt attached to this message. Be sure to keep it in case you need it later.

If you run into any issues, have questions about your token usage, or need guidance, our support team is just an email away at support@ufcaibot.com. We're always ready to help.

We're honored to be part of your fight analysis journey.

With appreciation,
The ufcaibot Team`,
    attachments: [
      {
        filename: `receipt-${receiptId}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};

export async function handleSecureProcessorWebhook(req: Request) {
  try {
    const signature = headers().get("content-signature");
    const rawBody = await req.text();

    const body = JSON.parse(rawBody);
    const notifiedTransaction: ProcessorTransaction | undefined =
      body?.transaction;

    if (!notifiedTransaction?.uid) {
      console.error("[payment webhook] Notification without transaction.uid");
      return NextResponse.json(
        { success: false, error: "Malformed notification." },
        { status: 400 }
      );
    }

    let transaction: ProcessorTransaction;

    if (verifySignature(rawBody, signature)) {
      transaction = notifiedTransaction;
    } else {
      const gatewayTransaction = await fetchTransactionFromGateway(
        String(notifiedTransaction.uid)
      );

      if (!gatewayTransaction) {
        console.error(
          `[payment webhook] Rejected: signature ${
            signature ? "invalid" : "missing"
          } and gateway could not confirm uid ${notifiedTransaction.uid}`
        );
        return NextResponse.json(
          { success: false, message: "Unverified notification." },
          { status: 403 }
        );
      }

      transaction = gatewayTransaction;
    }

    if (transaction.status !== "successful") {
      console.log(
        `[payment webhook] Transaction ${transaction.uid} status is "${transaction.status}", nothing to do`
      );
      return NextResponse.json(
        { success: false, message: "Transaction was not successful" },
        { status: 200 }
      );
    }

    // The processor retries deliveries; never credit the same payment twice.
    const alreadyProcessed = await prismadb.transaction.findFirst({
      where: { tracking_id: transaction.tracking_id, type: "payment" },
    });

    if (alreadyProcessed) {
      console.log(
        `[payment webhook] Transaction ${transaction.uid} already processed, acknowledging`
      );
      return NextResponse.json(
        { success: true, message: "Already processed" },
        { status: 200 }
      );
    }

    const user = await findUserForPayment(
      transaction.tracking_id,
      transaction.customer?.email
    );

    if (!user) {
      console.error(
        `[payment webhook] User not found for tracking_id ${transaction.tracking_id} / email ${transaction.customer?.email}`
      );
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 403 }
      );
    }

    const match = String(transaction.description ?? "").match(
      /\((\d+)\sTokens\)/
    );

    if (!match) {
      console.error(
        `[payment webhook] Could not parse token count from description "${transaction.description}"`
      );
      return NextResponse.json(
        { success: false, message: "Generations not found." },
        { status: 403 }
      );
    }

    const tokens = parseInt(match[1]);

    await prismadb.user.update({
      where: { clerkId: user.clerkId },
      data: {
        availableGenerations:
          user.availableGenerations - user.usedGenerations + tokens,
        usedGenerations: 0,
      },
    });

    await prismadb.transaction.create({
      data: {
        tracking_id: transaction.tracking_id,
        userId: user.clerkId,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        type: transaction.type,
        payment_method_type: transaction.payment_method_type,
        message: transaction.message,
        paid_at: transaction.paid_at ? new Date(transaction.paid_at) : null,
        receipt_url: transaction.receipt_url,
        webhookEventId: transaction.uid,
      },
    });

    try {
      await sendReceiptEmail(transaction, tokens);
    } catch (emailError) {
      console.error(
        "[payment webhook] Failed to send receipt email:",
        emailError
      );
    }

    return NextResponse.json(
      { success: true, message: "Success Response" },
      { status: 200 }
    );
  } catch (e) {
    console.error("[payment webhook] Unhandled error:", e);
    return NextResponse.json(
      { success: false, error: "Internal Error." },
      { status: 500 }
    );
  }
}
