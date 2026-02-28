/**
 * Unit tests for Twitter/X API Service
 * @jest-environment node
 */

import {
  Tweet,
  sampleTweets,
  getLatestUFCTweets,
  refreshUFCTweets,
  getCacheStatus,
  formatRelativeTime,
} from "@/lib/twitter";

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Store original env
const originalEnv = process.env;

describe("Twitter Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment
    process.env = { ...originalEnv };
    delete process.env.TWITTER_BEARER_TOKEN;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("sampleTweets", () => {
    it("should contain 10 sample tweets", () => {
      expect(sampleTweets).toHaveLength(10);
    });

    it("should have valid Tweet structure", () => {
      sampleTweets.forEach((tweet) => {
        expect(tweet).toHaveProperty("id");
        expect(tweet).toHaveProperty("author");
        expect(tweet).toHaveProperty("author.username");
        expect(tweet).toHaveProperty("author.name");
        expect(tweet).toHaveProperty("text");
        expect(tweet).toHaveProperty("timestamp");
        expect(tweet).toHaveProperty("link");
      });
    });

    it("should have UFC as the author", () => {
      sampleTweets.forEach((tweet) => {
        expect(tweet.author.username).toBe("ufc");
        expect(tweet.author.name).toBe("UFC");
      });
    });

    it("should have valid links", () => {
      sampleTweets.forEach((tweet) => {
        expect(tweet.link).toMatch(/^https:\/\/x\.com\/ufc\/status\//);
      });
    });
  });

  describe("getLatestUFCTweets", () => {
    it("should return sample tweets when no bearer token is set", async () => {
      const tweets = await getLatestUFCTweets();
      expect(tweets).toEqual(sampleTweets);
    });

    it("should fetch from API when bearer token is set", async () => {
      process.env.TWITTER_BEARER_TOKEN = "test-token";

      const mockResponse = {
        data: [
          {
            id: "123",
            text: "Test tweet",
            created_at: "2024-01-01T12:00:00Z",
            public_metrics: {
              like_count: 100,
              retweet_count: 50,
              reply_count: 10,
            },
          },
        ],
        includes: {
          users: [
            {
              id: "6446742",
              username: "ufc",
              name: "UFC",
              profile_image_url: "https://example.com/image.jpg",
            },
          ],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // Force clear cache by calling refresh
      await refreshUFCTweets();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("api.twitter.com"),
        expect.objectContaining({
          headers: {
            Authorization: "Bearer test-token",
          },
        })
      );
    });

    it("should return fallback data on API error", async () => {
      process.env.TWITTER_BEARER_TOKEN = "test-token";

      mockFetch.mockRejectedValue(new Error("Network error"));

      // Force clear cache
      await refreshUFCTweets();

      const tweets = await getLatestUFCTweets();
      expect(tweets).toEqual(sampleTweets);
    });

    it("should return fallback data on non-ok response", async () => {
      process.env.TWITTER_BEARER_TOKEN = "test-token";

      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
      });

      await refreshUFCTweets();

      const tweets = await getLatestUFCTweets();
      expect(tweets).toEqual(sampleTweets);
    });
  });

  describe("getCacheStatus", () => {
    it("should return cache status object", () => {
      const status = getCacheStatus();
      expect(status).toHaveProperty("isCached");
      expect(status).toHaveProperty("timestamp");
      expect(status).toHaveProperty("expiresAt");
    });
  });

  describe("formatRelativeTime", () => {
    it("should return 'just now' for very recent dates", () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe("just now");
    });

    it("should return minutes for dates less than an hour ago", () => {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      expect(formatRelativeTime(fifteenMinutesAgo)).toBe("15m");
    });

    it("should return hours for dates less than a day ago", () => {
      const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
      expect(formatRelativeTime(fiveHoursAgo)).toBe("5h");
    });

    it("should return days for dates less than a week ago", () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(threeDaysAgo)).toBe("3d");
    });

    it("should return formatted date for dates older than a week", () => {
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoWeeksAgo);
      // Should return something like "Nov 18"
      expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/);
    });
  });

  describe("Tweet interface", () => {
    it("should allow creating a valid Tweet object", () => {
      const tweet: Tweet = {
        id: "test-123",
        author: {
          username: "testuser",
          name: "Test User",
          profileImageUrl: "https://example.com/avatar.jpg",
        },
        text: "This is a test tweet",
        timestamp: new Date(),
        link: "https://x.com/testuser/status/test-123",
        metrics: {
          likes: 100,
          retweets: 50,
          replies: 25,
        },
      };

      expect(tweet.id).toBe("test-123");
      expect(tweet.author.username).toBe("testuser");
      expect(tweet.metrics?.likes).toBe(100);
    });

    it("should allow Tweet without optional metrics", () => {
      const tweet: Tweet = {
        id: "test-456",
        author: {
          username: "ufc",
          name: "UFC",
        },
        text: "Simple tweet without metrics",
        timestamp: new Date(),
        link: "https://x.com/ufc/status/test-456",
      };

      expect(tweet.metrics).toBeUndefined();
    });
  });
});

