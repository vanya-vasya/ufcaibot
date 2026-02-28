"use client";

import { useCallback } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
import { usePredictions, type Prediction } from "@/hooks/usePredictions";
import { PredictionCard } from "./PredictionCard";
import { PredictionCardSkeleton } from "./PredictionCardSkeleton";

interface PredictionListProps {
  onViewPrediction?: (prediction: Prediction) => void;
  pageSize?: number;
}

/**
 * PredictionList - Displays paginated list of saved predictions
 * Features: pagination, loading states, error handling, empty state
 */
export const PredictionList = ({
  onViewPrediction,
  pageSize = 10,
}: PredictionListProps) => {
  const {
    predictions,
    pagination,
    isLoading,
    isDeleting,
    error,
    nextPage,
    previousPage,
    goToPage,
    deletePrediction,
    refresh,
  } = usePredictions({ pageSize });

  const handleDelete = useCallback(
    async (id: string) => {
      await deletePrediction(id);
    },
    [deletePrediction]
  );

  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  // Loading state
  if (isLoading && predictions.length === 0) {
    return (
      <div className="space-y-4">
        {/* Header with skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-zinc-800 rounded w-48 animate-pulse" />
          <div className="h-10 bg-zinc-800 rounded w-24 animate-pulse" />
        </div>
        {/* Skeleton cards */}
        {Array.from({ length: 3 }).map((_, index) => (
          <PredictionCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error && predictions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3
          className="text-xl font-bold text-white mb-2"
          style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
        >
          FAILED TO LOAD PREDICTIONS
        </h3>
        <p className="text-zinc-400 text-center mb-6 max-w-md">{error}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded transition-colors"
          style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (!isLoading && predictions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🥊</span>
        </div>
        <h3
          className="text-2xl font-bold text-white mb-2"
          style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
        >
          NO PREDICTIONS YET
        </h3>
        <p className="text-zinc-400 text-center max-w-md">
          Generate your first fight prediction from the &quot;Upcoming&quot; tab to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
          >
            YOUR PREDICTIONS
          </h2>
          {pagination && (
            <p className="text-sm text-zinc-500 mt-1">
              {pagination.totalCount} prediction{pagination.totalCount !== 1 ? "s" : ""} total
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-50"
          aria-label="Refresh predictions"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Error banner (non-blocking) */}
      {error && predictions.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-800 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Prediction cards */}
      <div className="space-y-4">
        {predictions.map((prediction) => (
          <PredictionCard
            key={prediction.id}
            prediction={prediction}
            onDelete={handleDelete}
            isDeleting={isDeleting === prediction.id}
            onView={onViewPrediction}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-zinc-800">
          {/* Previous button */}
          <button
            onClick={previousPage}
            disabled={!pagination.hasPreviousPage || isLoading}
            className="flex items-center gap-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first, last, current, and adjacent pages
                const current = pagination.page;
                return (
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - current) <= 1
                );
              })
              .map((page, index, array) => {
                // Add ellipsis if there's a gap
                const showEllipsisBefore =
                  index > 0 && array[index - 1] !== page - 1;

                return (
                  <span key={page} className="flex items-center gap-2">
                    {showEllipsisBefore && (
                      <span className="text-zinc-500 px-1">...</span>
                    )}
                    <button
                      onClick={() => goToPage(page)}
                      disabled={isLoading}
                      className={`
                        w-10 h-10 rounded-lg font-medium transition-colors
                        ${
                          page === pagination.page
                            ? "bg-red-600 text-white"
                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                        }
                        disabled:opacity-50
                      `}
                      aria-label={`Go to page ${page}`}
                      aria-current={page === pagination.page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  </span>
                );
              })}
          </div>

          {/* Next button */}
          <button
            onClick={nextPage}
            disabled={!pagination.hasNextPage || isLoading}
            className="flex items-center gap-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictionList;
