/**
 * Tests for usePredictions hook
 * Tests data fetching, pagination, CRUD operations, and utilities
 */

import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { renderHook, act, waitFor } from "@testing-library/react";
import { formatPredictionDate, formatPredictionRelativeTime } from "@/hooks/usePredictions";

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe("formatPredictionDate", () => {
  it("should format date correctly", () => {
    const date = "2024-01-15T10:30:00Z";
    const result = formatPredictionDate(date);
    expect(result).toMatch(/January 15, 2024/);
  });

  it("should handle invalid date gracefully", () => {
    const result = formatPredictionDate("invalid-date");
    expect(result).toBe("");
  });

  it("should handle empty string", () => {
    const result = formatPredictionDate("");
    expect(result).toBe("");
  });
});

describe("formatPredictionRelativeTime", () => {
  it("should format seconds ago as 'Just now'", () => {
    const now = new Date();
    const result = formatPredictionRelativeTime(now.toISOString());
    expect(result).toBe("Just now");
  });

  it("should format minutes ago correctly", () => {
    const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    const result = formatPredictionRelativeTime(date.toISOString());
    expect(result).toBe("5m ago");
  });

  it("should format hours ago correctly", () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
    const result = formatPredictionRelativeTime(date.toISOString());
    expect(result).toBe("3h ago");
  });

  it("should format days ago correctly", () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    const result = formatPredictionRelativeTime(date.toISOString());
    expect(result).toBe("2d ago");
  });

  it("should format older dates as month/day", () => {
    const date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
    const result = formatPredictionRelativeTime(date.toISOString());
    expect(result).toMatch(/^[A-Z][a-z]{2}\s\d{1,2}$/);
  });

  it("should handle invalid date gracefully", () => {
    const result = formatPredictionRelativeTime("invalid-date");
    expect(result).toBe("");
  });
});

describe("usePredictions hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockPrediction = {
    id: "pred-1",
    userId: "user-1",
    event: "UFC 324",
    fight: "JUSTIN GAETHJE VS PADDY PIMBLETT",
    fighterA: "JUSTIN GAETHJE",
    fighterB: "PADDY PIMBLETT",
    content: "Test prediction content",
    imageUrl: "https://example.com/image.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockPaginatedResponse = {
    predictions: [mockPrediction],
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  it("should have correct initial state", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockPaginatedResponse,
    } as Response);

    const { usePredictions } = await import("@/hooks/usePredictions");
    const { result } = renderHook(() => usePredictions());

    expect(result.current.predictions).toEqual([]);
    expect(result.current.pagination).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should fetch predictions on mount when autoFetch is true", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockPaginatedResponse,
    } as Response);

    const { usePredictions } = await import("@/hooks/usePredictions");
    const { result } = renderHook(() => usePredictions({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/predictions"),
      expect.any(Object)
    );
    expect(result.current.predictions).toEqual([mockPrediction]);
  });

  it("should not fetch on mount when autoFetch is false", async () => {
    const { usePredictions } = await import("@/hooks/usePredictions");
    renderHook(() => usePredictions({ autoFetch: false }));

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should handle fetch errors", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const { usePredictions } = await import("@/hooks/usePredictions");
    const { result } = renderHook(() => usePredictions({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.predictions).toEqual([]);
  });

  it("should handle HTTP error responses", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" }),
    } as Response);

    const { usePredictions } = await import("@/hooks/usePredictions");
    const { result } = renderHook(() => usePredictions({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Unauthorized");
  });

  it("should save prediction successfully", async () => {
    const newPrediction = { ...mockPrediction, id: "new-pred-1" };
    
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ predictions: [], pagination: { ...mockPaginatedResponse.pagination, totalCount: 0 } }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ prediction: newPrediction }),
      } as Response);

    const { usePredictions } = await import("@/hooks/usePredictions");
    const { result } = renderHook(() => usePredictions({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let savedPrediction;
    await act(async () => {
      savedPrediction = await result.current.savePrediction({
        fight: "JUSTIN GAETHJE VS PADDY PIMBLETT",
        fighterA: "JUSTIN GAETHJE",
        fighterB: "PADDY PIMBLETT",
        content: "Test content",
      });
    });

    expect(savedPrediction).toBeDefined();
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/predictions",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  it("should handle save prediction error", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPaginatedResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Invalid data" }),
      } as Response);

    const { usePredictions } = await import("@/hooks/usePredictions");
    const { result } = renderHook(() => usePredictions({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let savedPrediction;
    await act(async () => {
      savedPrediction = await result.current.savePrediction({
        fight: "TEST",
        fighterA: "A",
        fighterB: "B",
        content: "Test",
      });
    });

    expect(savedPrediction).toBeNull();
    expect(result.current.error).toBe("Invalid data");
  });

  it("should delete prediction successfully", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPaginatedResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

    const { usePredictions } = await import("@/hooks/usePredictions");
    const { result } = renderHook(() => usePredictions({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let deleteSuccess;
    await act(async () => {
      deleteSuccess = await result.current.deletePrediction("pred-1");
    });

    expect(deleteSuccess).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/predictions?id=pred-1",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("should handle pagination correctly", async () => {
    const multiPageResponse = {
      predictions: [mockPrediction],
      pagination: {
        page: 1,
        pageSize: 10,
        totalCount: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: false,
      },
    };

    const page2Response = {
      predictions: [{ ...mockPrediction, id: "pred-2" }],
      pagination: {
        page: 2,
        pageSize: 10,
        totalCount: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      },
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => multiPageResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => page2Response,
      } as Response);

    const { usePredictions } = await import("@/hooks/usePredictions");
    const { result } = renderHook(() => usePredictions({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pagination?.page).toBe(1);
    expect(result.current.pagination?.hasNextPage).toBe(true);

    await act(async () => {
      await result.current.nextPage();
    });

    expect(result.current.pagination?.page).toBe(2);
    expect(result.current.pagination?.hasPreviousPage).toBe(true);
  });

  it("should refresh predictions", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockPaginatedResponse,
    } as Response);

    const { usePredictions } = await import("@/hooks/usePredictions");
    const { result } = renderHook(() => usePredictions({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.refresh();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should go to specific page", async () => {
    const multiPageResponse = {
      predictions: [mockPrediction],
      pagination: {
        page: 1,
        pageSize: 10,
        totalCount: 50,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: false,
      },
    };

    const page3Response = {
      predictions: [{ ...mockPrediction, id: "pred-3" }],
      pagination: {
        page: 3,
        pageSize: 10,
        totalCount: 50,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: true,
      },
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => multiPageResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => page3Response,
      } as Response);

    const { usePredictions } = await import("@/hooks/usePredictions");
    const { result } = renderHook(() => usePredictions({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.goToPage(3);
    });

    expect(result.current.pagination?.page).toBe(3);
  });
});
