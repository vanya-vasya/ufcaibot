import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const TEST_USER_PREFIX = "test_";
export const TEST_TRACKING_PREFIX = "TEST-";
export const TEST_DATA_REASON = "TEST_DATA";

type AdminGuardResult =
  | { ok: true; adminEmail: string }
  | { ok: false; response: NextResponse };

const getAdminEmails = (): string[] =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

/**
 * Allows only signed-in Clerk users whose email is listed in ADMIN_EMAILS
 * (comma separated). With ADMIN_EMAILS unset every request is rejected.
 */
export const requireAdmin = async (): Promise<AdminGuardResult> => {
  const { userId } = auth();
  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const adminEmails = getAdminEmails();
  const clerkUser = await currentUser();
  const matchedEmail = clerkUser?.emailAddresses
    .map((address) => address.emailAddress.toLowerCase())
    .find((email) => adminEmails.includes(email));

  if (!matchedEmail) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, adminEmail: matchedEmail };
};
