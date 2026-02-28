import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { Transaction } from "@prisma/client";

export const incrementApiLimit = async (value: number) => {
  try {
    const { userId } = auth();
    if (!userId) return;

    const userApiLimit = await prismadb.user.findUnique({
      where: { clerkId: userId },
    });

    if (userApiLimit) {
      await prismadb.user.update({
        where: { clerkId: userId },
        data: { usedGenerations: userApiLimit.usedGenerations + value },
      });
    }
  } catch (error) {
    console.error("[incrementApiLimit]", error);
  }
};

export const checkApiLimit = async (generationPrice: number) => {
  try {
    const { userId } = auth();
    if (!userId) return false;

    const userApiLimit = await prismadb.user.findUnique({
      where: { clerkId: userId },
    });

    if (
      userApiLimit &&
      userApiLimit.availableGenerations - userApiLimit.usedGenerations >= generationPrice
    ) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("[checkApiLimit]", error);
    return false;
  }
};

export const getApiAvailableGenerations = async () => {
  try {
    const { userId } = auth();
    if (!userId) return 0;

    const user = await prismadb.user.findUnique({
      where: { clerkId: userId },
      select: { availableGenerations: true },
    });

    return user?.availableGenerations ?? 0;
  } catch (error) {
    console.error("[getApiAvailableGenerations]", error);
    return 0;
  }
};

export const getApiUsedGenerations = async () => {
  try {
    const { userId } = auth();
    if (!userId) return 0;

    const user = await prismadb.user.findUnique({
      where: { clerkId: userId },
      select: { usedGenerations: true },
    });

    return user?.usedGenerations ?? 0;
  } catch (error) {
    console.error("[getApiUsedGenerations]", error);
    return 0;
  }
};

export async function fetchPaymentHistory(): Promise<Transaction[] | null> {
  try {
    const { userId } = auth();
    if (!userId) return null;

    const transactions = await prismadb.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return transactions;
  } catch (error) {
    console.error("[fetchPaymentHistory]", error);
    return null;
  }
}
