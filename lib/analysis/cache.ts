import prismadb from "@/lib/prismadb";

export const ONE_HOUR_MS = 60 * 60 * 1000;

/**
 * Returns a cached JSON payload, or loads and stores a fresh one.
 * A cache failure never breaks an analysis: the loader result is returned anyway.
 */
export const getOrSetCache = async <T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>
): Promise<T> => {
  try {
    const hit = await prismadb.analysisCache.findUnique({ where: { key } });
    if (hit && hit.expiresAt.getTime() > Date.now()) return hit.payload as T;
  } catch (error) {
    console.error("[analysis cache] read failed", error);
  }

  const fresh = await loader();

  try {
    const expiresAt = new Date(Date.now() + ttlMs);
    await prismadb.analysisCache.upsert({
      where: { key },
      create: { key, payload: fresh as object, expiresAt },
      update: { payload: fresh as object, expiresAt },
    });
  } catch (error) {
    console.error("[analysis cache] write failed", error);
  }

  return fresh;
};
