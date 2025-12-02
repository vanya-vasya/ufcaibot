/**
 * Twitter/X API Service
 * Fetches latest tweets from @ufc with caching, error handling, and rate limiting
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Tweet {
  id: string;
  author: {
    username: string;
    name: string;
    profileImageUrl?: string;
  };
  text: string;
  timestamp: Date;
  link: string;
  metrics?: {
    likes?: number;
    retweets?: number;
    replies?: number;
  };
}

interface TwitterAPIResponse {
  data: {
    id: string;
    text: string;
    created_at: string;
    public_metrics?: {
      like_count: number;
      retweet_count: number;
      reply_count: number;
    };
  }[];
  includes?: {
    users: {
      id: string;
      username: string;
      name: string;
      profile_image_url?: string;
    }[];
  };
}

interface CacheEntry {
  data: Tweet[];
  timestamp: number;
  expiresAt: number;
}

// ============================================================================
// CACHE IMPLEMENTATION
// ============================================================================

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// In-memory cache (works for serverless, resets on cold start)
let tweetCache: CacheEntry | null = null;

/**
 * Check if cached data is still valid
 */
const isCacheValid = (): boolean => {
  if (!tweetCache) return false;
  return Date.now() < tweetCache.expiresAt;
};

/**
 * Get data from cache
 */
const getCachedTweets = (): Tweet[] | null => {
  if (isCacheValid() && tweetCache) {
    return tweetCache.data;
  }
  return null;
};

/**
 * Store data in cache
 */
const setCachedTweets = (tweets: Tweet[]): void => {
  tweetCache = {
    data: tweets,
    timestamp: Date.now(),
    expiresAt: Date.now() + CACHE_DURATION_MS,
  };
};

// ============================================================================
// RATE LIMITING
// ============================================================================

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 1000; // Minimum 1 second between requests

/**
 * Ensure we don't exceed rate limits
 */
const waitForRateLimit = async (): Promise<void> => {
  const timeSinceLastRequest = Date.now() - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();
};

// ============================================================================
// SAMPLE DATA (Fallback when API is unavailable)
// ============================================================================

export const sampleTweets: Tweet[] = [
  {
    id: "1",
    author: { username: "ufc", name: "UFC" },
    text: "🔥 FIGHT WEEK IS HERE! Who's ready for #UFC309? The heavyweight title is on the line as Jon Jones defends against Stipe Miocic!",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/1",
  },
  {
    id: "2",
    author: { username: "ufc", name: "UFC" },
    text: "💪 @AlexPereiraUFC continues to dominate! The Light Heavyweight champion is looking for his next challenge. Who should be next?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/2",
  },
  {
    id: "3",
    author: { username: "ufc", name: "UFC" },
    text: "🏆 OFFICIAL: Islam Makhachev vs Arman Tsarukyan 2 set for UFC 311! The lightweight title rematch is confirmed!",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/3",
  },
  {
    id: "4",
    author: { username: "ufc", name: "UFC" },
    text: "👊 Weigh-in results are IN! All fighters made weight for tomorrow's card. Don't miss the action LIVE on @ESPNPlus",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/4",
  },
  {
    id: "5",
    author: { username: "ufc", name: "UFC" },
    text: "🎤 \"I'm the best pound-for-pound fighter on the planet!\" - @BlessedMMA at today's press conference 🔥",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/5",
  },
  {
    id: "6",
    author: { username: "ufc", name: "UFC" },
    text: "⚡️ KNOCKOUT OF THE NIGHT! Watch the incredible finish from last weekend's main event. What a way to close out the show!",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/6",
  },
  {
    id: "7",
    author: { username: "ufc", name: "UFC" },
    text: "📅 Mark your calendars! UFC 312 in Sydney, Australia is going to be MASSIVE. Tickets on sale this Friday!",
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/7",
  },
  {
    id: "8",
    author: { username: "ufc", name: "UFC" },
    text: "🥊 Training camp footage just dropped! Watch @DustinPoirier prepare for his upcoming war. The Diamond is READY.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/8",
  },
  {
    id: "9",
    author: { username: "ufc", name: "UFC" },
    text: "🌟 Rising star alert! Keep your eyes on the prelims - this card is STACKED from top to bottom!",
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/9",
  },
  {
    id: "10",
    author: { username: "ufc", name: "UFC" },
    text: "🏅 Congratulations to our Performance of the Night bonus winners! $50K well earned 💰",
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/10",
  },
];

// ============================================================================
// TWITTER API FETCHING
// ============================================================================

/**
 * Fetch tweets using Twitter API v2
 * Requires TWITTER_BEARER_TOKEN environment variable
 */
const fetchFromTwitterAPI = async (): Promise<Tweet[]> => {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    console.warn("[Twitter] No TWITTER_BEARER_TOKEN found, using sample data");
    return sampleTweets;
  }

  const UFC_USER_ID = "6446742"; // @ufc Twitter user ID

  const url = new URL(
    `https://api.twitter.com/2/users/${UFC_USER_ID}/tweets`
  );
  url.searchParams.append("max_results", "10");
  url.searchParams.append("tweet.fields", "created_at,public_metrics");
  url.searchParams.append("expansions", "author_id");
  url.searchParams.append("user.fields", "username,name,profile_image_url");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
    next: { revalidate: 300 }, // Next.js cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`Twitter API error: ${response.status} ${response.statusText}`);
  }

  const data: TwitterAPIResponse = await response.json();

  if (!data.data || data.data.length === 0) {
    throw new Error("No tweets returned from Twitter API");
  }

  const user = data.includes?.users?.[0];

  return data.data.map((tweet) => ({
    id: tweet.id,
    author: {
      username: user?.username || "ufc",
      name: user?.name || "UFC",
      profileImageUrl: user?.profile_image_url,
    },
    text: tweet.text,
    timestamp: new Date(tweet.created_at),
    link: `https://x.com/ufc/status/${tweet.id}`,
    metrics: tweet.public_metrics
      ? {
          likes: tweet.public_metrics.like_count,
          retweets: tweet.public_metrics.retweet_count,
          replies: tweet.public_metrics.reply_count,
        }
      : undefined,
  }));
};

/**
 * Fetch with retry logic
 */
const fetchWithRetry = async (
  retries: number = MAX_RETRIES
): Promise<Tweet[]> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await waitForRateLimit();
      return await fetchFromTwitterAPI();
    } catch (error) {
      console.error(`[Twitter] Attempt ${attempt}/${retries} failed:`, error);
      
      if (attempt === retries) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, attempt - 1))
      );
    }
  }
  
  throw new Error("All retry attempts failed");
};

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Get the latest 10 UFC tweets
 * Uses caching, rate limiting, and error handling
 *
 * @returns Promise<Tweet[]> Array of the 10 most recent tweets
 *
 * @example
 * ```ts
 * const tweets = await getLatestUFCTweets();
 * tweets.forEach(tweet => {
 *   console.log(`${tweet.author.name}: ${tweet.text}`);
 * });
 * ```
 */
export const getLatestUFCTweets = async (): Promise<Tweet[]> => {
  // Check cache first
  const cached = getCachedTweets();
  if (cached) {
    console.log("[Twitter] Returning cached tweets");
    return cached;
  }

  try {
    const tweets = await fetchWithRetry();
    setCachedTweets(tweets);
    console.log("[Twitter] Fetched fresh tweets from API");
    return tweets;
  } catch (error) {
    console.error("[Twitter] Failed to fetch tweets, using fallback:", error);
    // Return sample data as fallback
    return sampleTweets;
  }
};

/**
 * Force refresh tweets (bypass cache)
 */
export const refreshUFCTweets = async (): Promise<Tweet[]> => {
  tweetCache = null; // Clear cache
  return getLatestUFCTweets();
};

/**
 * Get cache status
 */
export const getCacheStatus = (): {
  isCached: boolean;
  timestamp: number | null;
  expiresAt: number | null;
} => {
  return {
    isCached: isCacheValid(),
    timestamp: tweetCache?.timestamp || null,
    expiresAt: tweetCache?.expiresAt || null,
  };
};

/**
 * Format relative timestamp
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

