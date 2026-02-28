"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Prediction item from the API
 */
export interface Prediction {
  id: string;
  userId: string;
  event: string | null;
  fight: string;
  fighterA: string;
  fighterB: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create prediction payload
 */
export interface CreatePredictionPayload {
  event?: string;
  fight: string;
  fighterA: string;
  fighterB: string;
  content: string;
  imageUrl?: string;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PredictionsResponse {
  predictions: Prediction[];
  pagination: PaginationInfo;
}

interface UsePredictionsOptions {
  /** Initial page */
  initialPage?: number;
  /** Page size (default: 10, max: 50) */
  pageSize?: number;
  /** Auto-fetch on mount */
  autoFetch?: boolean;
}

interface UsePredictionsResult {
  /** List of predictions */
  predictions: Prediction[];
  /** Pagination metadata */
  pagination: PaginationInfo | null;
  /** Loading state for initial/page load */
  isLoading: boolean;
  /** Loading state for create operation */
  isCreating: boolean;
  /** Loading state for delete operation */
  isDeleting: string | null; // Contains ID being deleted
  /** Error message if any */
  error: string | null;
  /** Fetch predictions for a page */
  fetchPredictions: (page?: number) => Promise<void>;
  /** Go to next page */
  nextPage: () => Promise<void>;
  /** Go to previous page */
  previousPage: () => Promise<void>;
  /** Go to specific page */
  goToPage: (page: number) => Promise<void>;
  /** Save a new prediction */
  savePrediction: (data: CreatePredictionPayload) => Promise<Prediction | null>;
  /** Delete a prediction */
  deletePrediction: (id: string) => Promise<boolean>;
  /** Refresh current page */
  refresh: () => Promise<void>;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

/**
 * Custom hook for managing fight predictions
 * Features: pagination, CRUD operations, optimistic updates, error handling
 */
export const usePredictions = (options: UsePredictionsOptions = {}): UsePredictionsResult => {
  const {
    initialPage = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    autoFetch = true,
  } = options;

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentPageRef = useRef(initialPage);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch predictions from API
   */
  const fetchPredictions = useCallback(
    async (page: number = currentPageRef.current): Promise<void> => {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      setError(null);

      try {
        const url = `/api/predictions?page=${page}&pageSize=${pageSize}`;
        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data: PredictionsResponse = await response.json();

        setPredictions(data.predictions);
        setPagination(data.pagination);
        currentPageRef.current = page;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("[usePredictions] Fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch predictions");
        setPredictions([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize]
  );

  /**
   * Save a new prediction (with optimistic update)
   */
  const savePrediction = useCallback(
    async (data: CreatePredictionPayload): Promise<Prediction | null> => {
      setIsCreating(true);
      setError(null);

      // Create optimistic prediction
      const optimisticPrediction: Prediction = {
        id: `temp-${Date.now()}`,
        userId: "",
        event: data.event || null,
        fight: data.fight,
        fighterA: data.fighterA,
        fighterB: data.fighterB,
        content: data.content,
        imageUrl: data.imageUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically add to list (at the beginning since sorted by desc)
      setPredictions((prev) => [optimisticPrediction, ...prev]);

      try {
        const response = await fetch("/api/predictions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();
        const savedPrediction: Prediction = result.prediction;

        // Replace optimistic prediction with real one
        setPredictions((prev) =>
          prev.map((p) => (p.id === optimisticPrediction.id ? savedPrediction : p))
        );

        // Update pagination total count
        setPagination((prev) =>
          prev ? { ...prev, totalCount: prev.totalCount + 1 } : prev
        );

        return savedPrediction;
      } catch (err) {
        console.error("[usePredictions] Save error:", err);
        setError(err instanceof Error ? err.message : "Failed to save prediction");

        // Rollback optimistic update
        setPredictions((prev) => prev.filter((p) => p.id !== optimisticPrediction.id));

        return null;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  /**
   * Delete a prediction (with optimistic update)
   */
  const deletePrediction = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(id);
    setError(null);

    // Store for rollback
    const previousPredictions = predictions;

    // Optimistically remove from list
    setPredictions((prev) => prev.filter((p) => p.id !== id));

    try {
      const response = await fetch(`/api/predictions?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Update pagination total count
      setPagination((prev) =>
        prev ? { ...prev, totalCount: prev.totalCount - 1 } : prev
      );

      return true;
    } catch (err) {
      console.error("[usePredictions] Delete error:", err);
      setError(err instanceof Error ? err.message : "Failed to delete prediction");

      // Rollback optimistic update
      setPredictions(previousPredictions);

      return false;
    } finally {
      setIsDeleting(null);
    }
  }, [predictions]);

  /**
   * Navigate to next page
   */
  const nextPage = useCallback(async (): Promise<void> => {
    if (pagination?.hasNextPage) {
      await fetchPredictions(currentPageRef.current + 1);
    }
  }, [pagination, fetchPredictions]);

  /**
   * Navigate to previous page
   */
  const previousPage = useCallback(async (): Promise<void> => {
    if (pagination?.hasPreviousPage) {
      await fetchPredictions(currentPageRef.current - 1);
    }
  }, [pagination, fetchPredictions]);

  /**
   * Navigate to specific page
   */
  const goToPage = useCallback(
    async (page: number): Promise<void> => {
      if (page >= 1 && (!pagination || page <= pagination.totalPages)) {
        await fetchPredictions(page);
      }
    },
    [pagination, fetchPredictions]
  );

  /**
   * Refresh current page
   */
  const refresh = useCallback(async (): Promise<void> => {
    await fetchPredictions(currentPageRef.current);
  }, [fetchPredictions]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchPredictions(initialPage);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, initialPage, fetchPredictions]);

  return {
    predictions,
    pagination,
    isLoading,
    isCreating,
    isDeleting,
    error,
    fetchPredictions,
    nextPage,
    previousPage,
    goToPage,
    savePrediction,
    deletePrediction,
    refresh,
  };
};

/**
 * Format prediction date for display
 */
export const formatPredictionDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

/**
 * Format relative time for prediction
 */
export const formatPredictionRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
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
