import prismadb from "@/lib/prismadb";

// The buy-tokens modal sends tracking_id as `gen_<clerkId>_<timestamp>`
// (see components/pro-modal.tsx); older flows sent the bare clerkId.
export const extractClerkIdFromTrackingId = (trackingId: string): string => {
  const match = trackingId.match(/^gen_(.+)_\d+$/);
  return match ? match[1] : trackingId;
};

// Resolve the paying user: first by clerkId extracted from tracking_id,
// then by the customer email as a fallback.
export const findUserForPayment = async (
  trackingId: string | null | undefined,
  customerEmail: string | null | undefined
) => {
  if (trackingId) {
    const user = await prismadb.user.findUnique({
      where: { clerkId: extractClerkIdFromTrackingId(trackingId) },
    });
    if (user) return user;
  }

  if (customerEmail) {
    return prismadb.user.findUnique({ where: { email: customerEmail } });
  }

  return null;
};
