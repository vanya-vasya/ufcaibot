import { getOrSetCache, ONE_HOUR_MS } from "./cache";
import { normalizeName } from "./names";

const NEWS_ENDPOINT = "https://newsapi.org/v2/everything";
const NEWS_TTL_MS = 6 * ONE_HOUR_MS;
const LOOKBACK_DAYS = 14;
const MAX_ARTICLES = 12;

interface RawArticle {
  title?: string | null;
  description?: string | null;
  publishedAt?: string | null;
  source?: { name?: string | null };
}

export interface NewsArticle {
  title: string;
  source: string;
  publishedAt: string;
  description: string;
}

export interface NewsData {
  articles: NewsArticle[];
}

const toArticle = (raw: RawArticle): NewsArticle => ({
  title: raw.title ?? "",
  source: raw.source?.name ?? "",
  publishedAt: raw.publishedAt ?? "",
  description: (raw.description ?? "").slice(0, 300),
});

const fetchArticles = async (fighterA: string, fighterB: string): Promise<NewsData> => {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) throw new Error("NEWS_API_KEY is not configured");

  const from = new Date(Date.now() - LOOKBACK_DAYS * 24 * ONE_HOUR_MS)
    .toISOString()
    .slice(0, 10);

  const url = new URL(NEWS_ENDPOINT);
  url.search = new URLSearchParams({
    q: `("${fighterA}" OR "${fighterB}") AND UFC`,
    from,
    language: "en",
    sortBy: "popularity",
    pageSize: String(MAX_ARTICLES),
    apiKey,
  }).toString();

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`NewsAPI responded ${response.status}`);

  const body = (await response.json()) as { articles?: RawArticle[] };
  return { articles: (body.articles ?? []).slice(0, MAX_ARTICLES).map(toArticle) };
};

/** Fetches (and caches for six hours) recent coverage of either fighter. */
export const fetchNewsData = async (
  fighterA: string,
  fighterB: string
): Promise<NewsData | null> => {
  const pair = [normalizeName(fighterA), normalizeName(fighterB)].sort().join("|");
  const data = await getOrSetCache(`news:${pair}`, NEWS_TTL_MS, () =>
    fetchArticles(fighterA, fighterB)
  );
  return data.articles.length > 0 ? data : null;
};
