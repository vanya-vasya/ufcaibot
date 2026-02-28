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
// SAMPLE DATA - UFC 324 & UFC 325 Tweets from @ufc
// Selected tweets containing #UFC324 or #UFC325 hashtags
// ============================================================================

export const sampleTweets: Tweet[] = [
  {
    id: "1868542901234567890",
    author: { username: "ufc", name: "UFC" },
    text: "🇬🇧 THE UK IS CALLING! #UFC324 is headed to Manchester on July 26th! Who's ready for another epic night at Co-op Live Arena? 🔥",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/1868542901234567890",
  },
  {
    id: "1868541234567890123",
    author: { username: "ufc", name: "UFC" },
    text: "🏆 TITLE FIGHT CONFIRMED! The welterweight championship is on the line at #UFC324! @Leon_edwardsmma defends against @Aborahimi - this is going to be WAR! 👊",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/1868541234567890123",
  },
  {
    id: "1868539876543210987",
    author: { username: "ufc", name: "UFC" },
    text: "🎫 TICKETS ON SALE NOW! Don't miss your chance to witness history at #UFC324 in Manchester! Get yours before they're gone ➡️ ufc.com/tickets",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/1868539876543210987",
  },
  {
    id: "1868538765432109876",
    author: { username: "ufc", name: "UFC" },
    text: "🔥 The co-main event for #UFC324 is SET! @TomAspinallUFC takes on a top contender in his home country. Manchester is about to erupt! 💥",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/1868538765432109876",
  },
  {
    id: "1868537654321098765",
    author: { username: "ufc", name: "UFC" },
    text: "🇦🇪 ABU DHABI, WE'RE COMING BACK! #UFC325 returns to Etihad Arena on August 16th! Another blockbuster event in the capital of MMA! 🌟",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/1868537654321098765",
  },
  {
    id: "1868536543210987654",
    author: { username: "ufc", name: "UFC" },
    text: "⚔️ MIDDLEWEIGHT MAYHEM! @DricusDuPlessis puts his title on the line at #UFC325 in Abu Dhabi! Who should challenge the champion? Drop your picks! 👇",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/1868536543210987654",
  },
  {
    id: "1868535432109876543",
    author: { username: "ufc", name: "UFC" },
    text: "🎬 Behind the scenes at the #UFC324 press conference! The tension is REAL between these fighters. July can't come soon enough! 🎤",
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/1868535432109876543",
  },
  {
    id: "1868534321098765432",
    author: { username: "ufc", name: "UFC" },
    text: "💪 Training camp footage JUST dropped! Watch the #UFC325 headliner prepare for war in Abu Dhabi. The champ looks SHARP! 🔪",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/1868534321098765432",
  },
  {
    id: "1868533210987654321",
    author: { username: "ufc", name: "UFC" },
    text: "🇬🇧🇦🇪 Back-to-back MEGA events! #UFC324 Manchester ➡️ #UFC325 Abu Dhabi! Summer 2025 is going to be LEGENDARY! Mark your calendars! 📅",
    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/1868533210987654321",
  },
  {
    id: "1868532109876543210",
    author: { username: "ufc", name: "UFC" },
    text: "🌍 Fan Fest is BACK! Join us in Manchester for #UFC324 Fan Fest - meet your favorite fighters, get autographs, and experience the Octagon up close! Free entry! 🎉",
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    link: "https://x.com/ufc/status/1868532109876543210",
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

