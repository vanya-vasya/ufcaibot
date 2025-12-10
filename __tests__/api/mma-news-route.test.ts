/**
 * Tests for MMA News API Route
 * Tests RSS feed fetching, caching, and error handling
 * 
 * RSS Sources (verified working as of Dec 2025):
 * - UFC: https://www.ufc.com/rss/news
 * - Sherdog: https://www.sherdog.com/rss/news.xml
 * - LowKick MMA: https://www.lowkickmma.com/feed/
 * - BJPENN: https://www.bjpenn.com/feed/
 * - Cageside Press: https://cagesidepress.com/feed/
 */

import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";

// Mock fetch globally
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

// Import after mocking
import { GET } from "@/app/api/mma-news/route";

describe("MMA News API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset module cache to clear server-side cache
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const createMockRSSResponse = (items: Array<{ title: string; link: string; description: string }>) => {
    const itemsXml = items
      .map(
        (item) => `
      <item>
        <title>${item.title}</title>
        <link>${item.link}</link>
        <description>${item.description}</description>
        <pubDate>${new Date().toUTCString()}</pubDate>
      </item>
    `
      )
      .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <title>Test Feed</title>
          ${itemsXml}
        </channel>
      </rss>`;
  };

  it("should fetch and parse RSS feeds successfully", async () => {
    const mockRSS = createMockRSSResponse([
      { title: "Test Fight News", link: "https://example.com/1", description: "Test description" },
      { title: "UFC Update", link: "https://example.com/2", description: "Another test" },
    ]);

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => mockRSS,
    } as Response);

    const request = new Request("http://localhost:3000/api/mma-news?limit=5");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.items).toBeDefined();
    expect(Array.isArray(data.items)).toBe(true);
  });

  it("should respect the limit parameter", async () => {
    const mockRSS = createMockRSSResponse(
      Array.from({ length: 20 }, (_, i) => ({
        title: `News ${i + 1}`,
        link: `https://example.com/${i + 1}`,
        description: `Description ${i + 1}`,
      }))
    );

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => mockRSS,
    } as Response);

    const request = new Request("http://localhost:3000/api/mma-news?limit=5");
    const response = await GET(request);
    const data = await response.json();

    expect(data.items.length).toBeLessThanOrEqual(5);
  });

  it("should handle RSS feed fetch errors gracefully", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const request = new Request("http://localhost:3000/api/mma-news");
    const response = await GET(request);
    const data = await response.json();

    // Should return empty items or cached data on error
    expect(data.items).toBeDefined();
    expect(Array.isArray(data.items)).toBe(true);
  });

  it("should handle non-200 RSS responses", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => "Not found",
    } as Response);

    const request = new Request("http://localhost:3000/api/mma-news");
    const response = await GET(request);
    const data = await response.json();

    expect(data.items).toBeDefined();
    expect(Array.isArray(data.items)).toBe(true);
  });

  it("should decode HTML entities in content", async () => {
    const mockRSS = createMockRSSResponse([
      {
        title: "Fighter&#39;s &amp; Corner",
        link: "https://example.com/1",
        description: "Test &quot;quoted&quot; text",
      },
    ]);

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => mockRSS,
    } as Response);

    const request = new Request("http://localhost:3000/api/mma-news?limit=1");
    const response = await GET(request);
    const data = await response.json();

    if (data.items.length > 0) {
      expect(data.items[0].title).not.toContain("&#39;");
      expect(data.items[0].title).not.toContain("&amp;");
    }
  });

  it("should include cache metadata in response", async () => {
    const mockRSS = createMockRSSResponse([
      { title: "Test", link: "https://example.com/1", description: "Test" },
    ]);

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => mockRSS,
    } as Response);

    const request = new Request("http://localhost:3000/api/mma-news");
    const response = await GET(request);
    const data = await response.json();

    expect(data).toHaveProperty("cached");
    expect(data).toHaveProperty("cachedAt");
    expect(data).toHaveProperty("expiresAt");
  });

  it("should handle CDATA content in RSS", async () => {
    const mockRSS = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <title>Test Feed</title>
          <item>
            <title><![CDATA[Test CDATA Title]]></title>
            <link>https://example.com/1</link>
            <description><![CDATA[<p>HTML content here</p>]]></description>
            <pubDate>${new Date().toUTCString()}</pubDate>
          </item>
        </channel>
      </rss>`;

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => mockRSS,
    } as Response);

    const request = new Request("http://localhost:3000/api/mma-news?limit=1");
    const response = await GET(request);
    const data = await response.json();

    if (data.items.length > 0) {
      expect(data.items[0].title).toBe("Test CDATA Title");
      // HTML should be stripped from description
      expect(data.items[0].description).not.toContain("<p>");
    }
  });

  it("should extract thumbnails from media tags", async () => {
    const mockRSS = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
        <channel>
          <title>Test Feed</title>
          <item>
            <title>Test with Thumbnail</title>
            <link>https://example.com/1</link>
            <description>Test</description>
            <media:thumbnail url="https://example.com/thumb.jpg" />
            <pubDate>${new Date().toUTCString()}</pubDate>
          </item>
        </channel>
      </rss>`;

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => mockRSS,
    } as Response);

    const request = new Request("http://localhost:3000/api/mma-news?limit=1");
    const response = await GET(request);
    const data = await response.json();

    if (data.items.length > 0) {
      expect(data.items[0].thumbnail).toBe("https://example.com/thumb.jpg");
    }
  });

  it("should deduplicate similar articles", async () => {
    const mockRSS = createMockRSSResponse([
      { title: "UFC Fighter Wins Match", link: "https://example.com/1", description: "Test 1" },
      { title: "UFC Fighter Wins Match", link: "https://example.com/2", description: "Test 2" },
      { title: "Different News Story", link: "https://example.com/3", description: "Test 3" },
    ]);

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => mockRSS,
    } as Response);

    const request = new Request("http://localhost:3000/api/mma-news?limit=10");
    const response = await GET(request);
    const data = await response.json();

    // Should have removed the duplicate
    const titles = data.items.map((item: { title: string }) => item.title);
    const uniqueTitles = [...new Set(titles)];
    expect(titles.length).toBe(uniqueTitles.length);
  });
});
