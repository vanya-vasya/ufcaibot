"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * News item from the MMA News API
 */
export interface NewsItem {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  thumbnail?: string;
}

interface NewsResponse {
  items: NewsItem[];
  cached: boolean;
  cachedAt: string;
  expiresAt: string;
  stale?: boolean;
  error?: string;
}

interface UseNewsFeedOptions {
  /** Number of items to fetch (5-20) */
  limit?: number;
  /** Auto-refresh interval in ms (0 to disable) */
  refreshInterval?: number;
  /** Refetch on tab/window visibility change */
  refetchOnFocus?: boolean;
  /** Enable client-side caching */
  enableCache?: boolean;
  /** Client cache TTL in ms */
  cacheTTL?: number;
}

interface UseNewsFeedResult {
  /** News items */
  items: NewsItem[];
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether data is from cache */
  isFromCache: boolean;
  /** Whether cached data is stale */
  isStale: boolean;
  /** Manually trigger a refresh */
  refresh: () => Promise<void>;
  /** Last successful fetch timestamp */
  lastUpdated: Date | null;
}

// Client-side cache
interface ClientCache {
  data: NewsItem[];
  timestamp: number;
  expiresAt: string;
}

let clientCache: ClientCache | null = null;

/**
 * Custom hook for fetching MMA news feed
 * Features: caching, visibility-based refetch, error handling, retry logic
 */
export const useNewsFeed = (options: UseNewsFeedOptions = {}): UseNewsFeedResult => {
  const {
    limit = 10,
    refreshInterval = 0,
    refetchOnFocus = true,
    enableCache = true,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  /**
   * Fetch news from API
   */
  const fetchNews = useCallback(
    async (forceRefresh = false): Promise<void> => {
      // Check client cache first (unless forcing refresh)
      if (!forceRefresh && enableCache && clientCache) {
        const now = Date.now();
        if (now - clientCache.timestamp < cacheTTL) {
          setItems(clientCache.data.slice(0, limit));
          setIsFromCache(true);
          setIsStale(false);
          setIsLoading(false);
          setError(null);
          return;
        }
      }

      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);

      try {
        const url = `/api/mma-news?limit=${limit}${forceRefresh ? "&refresh=true" : ""}`;
        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
          headers: {
            "Cache-Control": forceRefresh ? "no-cache" : "max-age=300",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: NewsResponse = await response.json();

        // Update state
        setItems(data.items);
        setIsFromCache(data.cached);
        setIsStale(data.stale || false);
        setError(data.error || null);
        setLastUpdated(new Date());
        retryCountRef.current = 0;

        // Update client cache
        if (enableCache) {
          clientCache = {
            data: data.items,
            timestamp: Date.now(),
            expiresAt: data.expiresAt,
          };
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // Request was cancelled, don't update state
          return;
        }

        console.error("[useNewsFeed] Fetch error:", err);

        // Retry logic
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          const delay = Math.pow(2, retryCountRef.current) * 1000; // Exponential backoff
          console.log(`[useNewsFeed] Retrying in ${delay}ms (attempt ${retryCountRef.current}/${MAX_RETRIES})`);
          
          setTimeout(() => fetchNews(forceRefresh), delay);
          return;
        }

        // Use cached data if available
        if (clientCache) {
          setItems(clientCache.data.slice(0, limit));
          setIsFromCache(true);
          setIsStale(true);
          setError("Failed to fetch fresh news. Showing cached content.");
        } else {
          setError(err instanceof Error ? err.message : "Failed to fetch news");
          setItems([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [limit, enableCache, cacheTTL]
  );

  /**
   * Manual refresh (always fetches fresh data)
   */
  const refresh = useCallback(async (): Promise<void> => {
    retryCountRef.current = 0;
    await fetchNews(true);
  }, [fetchNews]);

  // Initial fetch
  useEffect(() => {
    fetchNews();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [fetchNews]);

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const intervalId = setInterval(() => {
      fetchNews();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval, fetchNews]);

  // Refetch on visibility change
  useEffect(() => {
    if (!refetchOnFocus) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Check if cache is expired before refetching
        if (clientCache) {
          const now = Date.now();
          if (now - clientCache.timestamp >= cacheTTL) {
            console.log("[useNewsFeed] Tab visible, cache expired, refetching...");
            fetchNews();
          }
        } else {
          fetchNews();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetchOnFocus, cacheTTL, fetchNews]);

  return {
    items,
    isLoading,
    error,
    isFromCache,
    isStale,
    refresh,
    lastUpdated,
  };
};

/**
 * Calculate responsive item count based on viewport
 */
export const useResponsiveItemCount = (): number => {
  const [count, setCount] = useState(7);

  useEffect(() => {
    const calculateCount = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        // Mobile: Show 5 items (horizontal scroll)
        setCount(5);
      } else if (width < 1024) {
        // Tablet: Show 6 items
        setCount(6);
      } else if (width < 1280) {
        // Small desktop: Show 8 items
        setCount(8);
      } else {
        // Large desktop: Show 10 items
        setCount(10);
      }
    };

    calculateCount();
    window.addEventListener("resize", calculateCount);
    return () => window.removeEventListener("resize", calculateCount);
  }, []);

  return count;
};

/**
 * Format relative time (e.g., "2h ago", "3d ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  } catch {
    return "";
  }
};
