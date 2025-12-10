/**
 * Tests for useNewsFeed hook
 * Tests data fetching, caching, error handling, and utilities
 */

import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { renderHook, act, waitFor } from "@testing-library/react";
import { formatRelativeTime } from "@/hooks/useNewsFeed";

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe("formatRelativeTime", () => {
  it("should format seconds ago as 'Just now'", () => {
    const now = new Date();
    const result = formatRelativeTime(now.toISOString());
    expect(result).toBe("Just now");
  });

  it("should format minutes ago correctly", () => {
    const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    const result = formatRelativeTime(date.toISOString());
    expect(result).toBe("5m ago");
  });

  it("should format hours ago correctly", () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
    const result = formatRelativeTime(date.toISOString());
    expect(result).toBe("3h ago");
  });

  it("should format days ago correctly", () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    const result = formatRelativeTime(date.toISOString());
    expect(result).toBe("2d ago");
  });

  it("should format older dates as month/day", () => {
    const date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
    const result = formatRelativeTime(date.toISOString());
    // Should be in "Mon D" format
    expect(result).toMatch(/^[A-Z][a-z]{2}\s\d{1,2}$/);
  });

  it("should handle invalid date gracefully", () => {
    const result = formatRelativeTime("invalid-date");
    expect(result).toBe("");
  });

  it("should handle empty string", () => {
    const result = formatRelativeTime("");
    expect(result).toBe("");
  });
});

describe("useNewsFeed hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const mockNewsResponse = {
    items: [
      {
        id: "1",
        title: "Test News 1",
        link: "https://example.com/1",
        description: "Description 1",
        pubDate: new Date().toISOString(),
        source: "Test Source",
        thumbnail: "https://example.com/thumb1.jpg",
      },
      {
        id: "2",
        title: "Test News 2",
        link: "https://example.com/2",
        description: "Description 2",
        pubDate: new Date().toISOString(),
        source: "Test Source 2",
      },
    ],
    cached: false,
    cachedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  };

  it("should have correct initial state", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockNewsResponse,
    } as Response);

    // Import dynamically to reset module state
    const { useNewsFeed } = await import("@/hooks/useNewsFeed");
    
    const { result } = renderHook(() => useNewsFeed());

    // Initial state should have isLoading true
    expect(result.current.isLoading).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("should fetch news on mount", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockNewsResponse,
    } as Response);

    const { useNewsFeed } = await import("@/hooks/useNewsFeed");
    
    const { result } = renderHook(() => useNewsFeed({ limit: 5 }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/mma-news"),
      expect.any(Object)
    );
  });

  it("should handle fetch errors", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const { useNewsFeed } = await import("@/hooks/useNewsFeed");
    
    const { result } = renderHook(() => useNewsFeed({ enableCache: false }));

    // Wait for retries to complete (with exponential backoff)
    await act(async () => {
      jest.advanceTimersByTime(30000); // Advance past all retries
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });

  it("should handle HTTP error responses", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    const { useNewsFeed } = await import("@/hooks/useNewsFeed");
    
    const { result } = renderHook(() => useNewsFeed({ enableCache: false }));

    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });

  it("should provide a refresh function", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockNewsResponse,
    } as Response);

    const { useNewsFeed } = await import("@/hooks/useNewsFeed");
    
    const { result } = renderHook(() => useNewsFeed());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refresh).toBe("function");

    // Call refresh
    await act(async () => {
      await result.current.refresh();
    });

    // Should have made additional fetch call
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should include cache metadata in result", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockNewsResponse,
        cached: true,
        stale: false,
      }),
    } as Response);

    const { useNewsFeed } = await import("@/hooks/useNewsFeed");
    
    const { result } = renderHook(() => useNewsFeed());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isFromCache).toBe(true);
    expect(result.current.isStale).toBe(false);
  });

  it("should update lastUpdated after successful fetch", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockNewsResponse,
    } as Response);

    const { useNewsFeed } = await import("@/hooks/useNewsFeed");
    
    const { result } = renderHook(() => useNewsFeed());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.lastUpdated).toBeInstanceOf(Date);
  });
});

describe("useResponsiveItemCount", () => {
  const originalInnerWidth = global.innerWidth;

  afterEach(() => {
    Object.defineProperty(global, "innerWidth", {
      value: originalInnerWidth,
      writable: true,
    });
  });

  it("should return correct count for mobile viewport", async () => {
    Object.defineProperty(global, "innerWidth", { value: 400, writable: true });
    
    const { useResponsiveItemCount } = await import("@/hooks/useNewsFeed");
    const { result } = renderHook(() => useResponsiveItemCount());

    // Trigger resize event
    act(() => {
      global.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(5);
  });

  it("should return correct count for tablet viewport", async () => {
    Object.defineProperty(global, "innerWidth", { value: 800, writable: true });
    
    const { useResponsiveItemCount } = await import("@/hooks/useNewsFeed");
    const { result } = renderHook(() => useResponsiveItemCount());

    act(() => {
      global.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(6);
  });

  it("should return correct count for desktop viewport", async () => {
    Object.defineProperty(global, "innerWidth", { value: 1400, writable: true });
    
    const { useResponsiveItemCount } = await import("@/hooks/useNewsFeed");
    const { result } = renderHook(() => useResponsiveItemCount());

    act(() => {
      global.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(10);
  });
});
