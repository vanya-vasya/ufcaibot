import { NextResponse } from "next/server";

/**
 * MMA News RSS Feed API
 * Fetches and aggregates news from multiple MMA RSS sources
 * Implements server-side caching to reduce requests
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

interface CacheEntry {
  data: NewsItem[];
  timestamp: number;
}

// Server-side cache (survives between requests within the same serverless instance)
let newsCache: CacheEntry | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// MMA RSS Feed sources (verified working feeds from https://rss.feedspot.com/mma_rss_feeds/)
const RSS_FEEDS = [
  { url: "https://www.ufc.com/rss/news", source: "UFC" },
  { url: "https://www.sherdog.com/rss/news.xml", source: "Sherdog" },
  { url: "https://www.lowkickmma.com/feed/", source: "LowKick MMA" },
  { url: "https://www.bjpenn.com/feed/", source: "BJPENN" },
  { url: "https://cagesidepress.com/feed/", source: "Cageside Press" },
];

/**
 * Parse RSS XML and extract news items
 */
const parseRSSFeed = async (
  feedUrl: string,
  source: string
): Promise<NewsItem[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
  
  try {
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; UFCAIBot/1.0; +https://ufcaibot.com)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      signal: controller.signal,
      cache: "no-store", // Avoid Next.js caching issues with external feeds
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[MMA News] Failed to fetch ${source}: ${response.status}`);
      return [];
    }

    const xmlText = await response.text();
    
    if (!xmlText || xmlText.length < 100) {
      console.warn(`[MMA News] Empty or invalid response from ${source}`);
      return [];
    }
    
    const items: NewsItem[] = [];

    // Simple XML parsing using regex (works for standard RSS feeds)
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let itemMatch;

    while ((itemMatch = itemRegex.exec(xmlText)) !== null) {
      const itemXml = itemMatch[1];

      const title = extractXMLTag(itemXml, "title");
      const link = extractXMLTag(itemXml, "link");
      const description = cleanDescription(extractXMLTag(itemXml, "description"));
      const pubDate = extractXMLTag(itemXml, "pubDate");
      const thumbnail = extractThumbnail(itemXml);

      if (title && link) {
        items.push({
          id: generateId(link),
          title: decodeHTMLEntities(title),
          link,
          description: description || "",
          pubDate: pubDate || new Date().toISOString(),
          source,
          thumbnail,
        });
      }
    }

    console.log(`[MMA News] Successfully fetched ${items.length} items from ${source}`);
    return items;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      console.warn(`[MMA News] Timeout fetching ${source}`);
    } else {
      console.error(`[MMA News] Error fetching ${source}:`, error);
    }
    return [];
  }
};

/**
 * Extract content from XML tag
 */
const extractXMLTag = (xml: string, tag: string): string => {
  // Try CDATA first
  const cdataRegex = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`,
    "i"
  );
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  // Regular tag content
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
};

/**
 * Extract thumbnail from various RSS formats
 */
const extractThumbnail = (xml: string): string | undefined => {
  // media:thumbnail
  const mediaThumbnail = xml.match(/<media:thumbnail[^>]*url="([^"]+)"/i);
  if (mediaThumbnail) return mediaThumbnail[1];

  // media:content
  const mediaContent = xml.match(/<media:content[^>]*url="([^"]+)"/i);
  if (mediaContent) return mediaContent[1];

  // enclosure (image type)
  const enclosure = xml.match(
    /<enclosure[^>]*type="image[^"]*"[^>]*url="([^"]+)"/i
  );
  if (enclosure) return enclosure[1];

  // enclosure url first
  const enclosureUrl = xml.match(/<enclosure[^>]*url="([^"]+)"/i);
  if (enclosureUrl && /\.(jpg|jpeg|png|gif|webp)/i.test(enclosureUrl[1])) {
    return enclosureUrl[1];
  }

  // img tag in description
  const imgInDesc = xml.match(/<img[^>]*src="([^"]+)"/i);
  if (imgInDesc) return imgInDesc[1];

  return undefined;
};

/**
 * Clean HTML from description
 */
const cleanDescription = (html: string): string => {
  if (!html) return "";
  
  // Remove HTML tags
  let text = html.replace(/<[^>]+>/g, "");
  
  // Decode HTML entities
  text = decodeHTMLEntities(text);
  
  // Normalize whitespace
  text = text.replace(/\s+/g, " ").trim();
  
  // Truncate to reasonable length
  if (text.length > 200) {
    text = text.substring(0, 200).trim() + "...";
  }
  
  return text;
};

/**
 * Decode HTML entities
 */
const decodeHTMLEntities = (text: string): string => {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&#8217;": "'",
    "&#8216;": "'",
    "&#8220;": '"',
    "&#8221;": '"',
    "&#8211;": "–",
    "&#8212;": "—",
    "&#038;": "&",
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, "g"), char);
  }

  // Handle numeric entities
  decoded = decoded.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCharCode(parseInt(dec, 10))
  );

  return decoded;
};

/**
 * Generate unique ID from link
 */
const generateId = (link: string): string => {
  let hash = 0;
  for (let i = 0; i < link.length; i++) {
    const char = link.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

/**
 * Sort news items by publication date (newest first)
 */
const sortByDate = (items: NewsItem[]): NewsItem[] => {
  return items.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    return dateB - dateA;
  });
};

/**
 * GET /api/mma-news
 * Returns aggregated MMA news from multiple sources
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 20);
    const forceRefresh = searchParams.get("refresh") === "true";

    // Check cache
    const now = Date.now();
    if (!forceRefresh && newsCache && now - newsCache.timestamp < CACHE_TTL_MS) {
      console.log("[MMA News] Serving from cache");
      return NextResponse.json({
        items: newsCache.data.slice(0, limit),
        cached: true,
        cachedAt: new Date(newsCache.timestamp).toISOString(),
        expiresAt: new Date(newsCache.timestamp + CACHE_TTL_MS).toISOString(),
      });
    }

    // Fetch from all sources in parallel
    console.log("[MMA News] Fetching fresh data from RSS feeds");
    const feedPromises = RSS_FEEDS.map((feed) =>
      parseRSSFeed(feed.url, feed.source)
    );

    const results = await Promise.allSettled(feedPromises);

    // Aggregate all successful results
    const allItems: NewsItem[] = [];
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        allItems.push(...result.value);
      }
    });

    // Sort by date and deduplicate by similar titles
    const sortedItems = sortByDate(allItems);
    const uniqueItems = deduplicateItems(sortedItems);

    // Update cache
    newsCache = {
      data: uniqueItems,
      timestamp: now,
    };

    return NextResponse.json({
      items: uniqueItems.slice(0, limit),
      cached: false,
      cachedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + CACHE_TTL_MS).toISOString(),
    });
  } catch (error) {
    console.error("[MMA News] API Error:", error);

    // Return cached data if available, even if stale
    if (newsCache) {
      return NextResponse.json(
        {
          items: newsCache.data.slice(0, 10),
          cached: true,
          stale: true,
          error: "Failed to fetch fresh data, serving stale cache",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch MMA news", items: [] },
      { status: 500 }
    );
  }
}

/**
 * Remove duplicate articles based on similar titles
 */
const deduplicateItems = (items: NewsItem[]): NewsItem[] => {
  const seen = new Map<string, boolean>();
  return items.filter((item) => {
    // Normalize title for comparison
    const normalized = item.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const shortKey = normalized.substring(0, 50);

    if (seen.has(shortKey)) {
      return false;
    }
    seen.set(shortKey, true);
    return true;
  });
};
