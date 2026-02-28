import { auth, currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { Transaction } from "@prisma/client";

/** Finds user by clerkId; falls back to email lookup and syncs clerkId if found. */
const findUserByAuth = async () => {
  const { userId } = auth();
  if (!userId) return null;

  let user = await prismadb.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    const clerkUser = await currentUser();
    const primaryEmail = clerkUser?.emailAddresses?.[0]?.emailAddress;
    if (primaryEmail) {
      user = await prismadb.user.findUnique({ where: { email: primaryEmail } });
      if (user) {
        // Persist real clerkId so future lookups are direct
        await prismadb.user.update({
          where: { email: primaryEmail },
          data: { clerkId: userId },
        });
        user = { ...user, clerkId: userId };
      }
    }
  }

  return user;
};

export const incrementApiLimit = async (value: number) => {
  try {
    const { userId } = auth();
    if (!userId) return;

    const user = await findUserByAuth();
    if (user) {
      await prismadb.user.update({
        where: { clerkId: user.clerkId },
        data: { usedGenerations: user.usedGenerations + value },
      });
    }
  } catch (error) {
    console.error("[incrementApiLimit]", error);
  }
};

export const checkApiLimit = async (generationPrice: number) => {
  try {
    const user = await findUserByAuth();
    if (!user) return false;
    return user.availableGenerations - user.usedGenerations >= generationPrice;
  } catch (error) {
    console.error("[checkApiLimit]", error);
    return false;
  }
};

export const getApiAvailableGenerations = async () => {
  try {
    const user = await findUserByAuth();
    return user?.availableGenerations ?? 0;
  } catch (error) {
    console.error("[getApiAvailableGenerations]", error);
    return 0;
  }
};

export const getApiUsedGenerations = async () => {
  try {
    const user = await findUserByAuth();
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

    const user = await findUserByAuth();
    if (!user) return null;

    const transactions = await prismadb.transaction.findMany({
      where: { userId: user.clerkId },
      orderBy: { createdAt: "desc" },
    });
    return transactions;
  } catch (error) {
    console.error("[fetchPaymentHistory]", error);
    return null;
  }
}
