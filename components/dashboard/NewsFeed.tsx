"use client";

import { useCallback, useRef, KeyboardEvent } from "react";
import { useNewsFeed, useResponsiveItemCount } from "@/hooks/useNewsFeed";
import { NewsCard } from "./NewsCard";
import { NewsCardSkeleton, NewsSkeletonGroup } from "./NewsCardSkeleton";

interface NewsFeedProps {
  /** Optional class name for the container */
  className?: string;
}

/**
 * NewsFeed - MMA/UFC News Feed Component
 * Displays latest news with responsive layout:
 * - Mobile: Horizontal scroll with 5 items
 * - Tablet: Horizontal scroll with 6-8 items
 * - Desktop: Grid/flex layout with 8-10 items
 *
 * Features:
 * - Async loading (non-blocking)
 * - Caching with visibility-based refetch
 * - Accessible keyboard navigation
 * - Error handling with retry
 * - Skeleton loading states
 */
export const NewsFeed = ({ className = "" }: NewsFeedProps) => {
  const itemCount = useResponsiveItemCount();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    items,
    isLoading,
    error,
    isStale,
    refresh,
  } = useNewsFeed({
    limit: itemCount,
    refetchOnFocus: true,
    enableCache: true,
    cacheTTL: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Handle horizontal scroll with keyboard
   */
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, []);

  /**
   * Handle retry on error
   */
  const handleRetry = useCallback(() => {
    refresh();
  }, [refresh]);

  // Error state with retry
  if (error && items.length === 0) {
    return (
      <section
        aria-label="MMA News Feed - Error"
        className={`w-full bg-black py-4 px-4 ${className}`}
      >
        <div className="max-w-[1350px] mx-auto">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              className="w-12 h-12 text-zinc-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-zinc-400 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ fontFamily: 'var(--font-ufc-heading)' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="MMA News Feed"
      aria-busy={isLoading}
      className={`w-full bg-black py-4 ${className}`}
    >
      <div className="max-w-[1350px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-3">
            <h2
              className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-ufc-heading)' }}
            >
              Latest MMA News
            </h2>
            {isStale && (
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                Cached
              </span>
            )}
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label="Refresh news feed"
            title="Refresh"
          >
            <svg
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {/* Scroll indicators for mobile */}
        <div className="relative">
          {/* Left fade indicator */}
          <div
            className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none lg:hidden"
            aria-hidden="true"
          />

          {/* Right fade indicator */}
          <div
            className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none lg:hidden"
            aria-hidden="true"
          />

          {/* News cards container */}
          <div
            ref={scrollContainerRef}
            role="region"
            aria-label="News articles"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className={`
              flex gap-4 overflow-x-auto scrollbar-hide
              px-4 pb-4 pt-1
              snap-x snap-mandatory
              focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:ring-inset
              lg:flex-wrap lg:overflow-x-visible lg:justify-center
            `}
          >
            {isLoading && items.length === 0 ? (
              // Loading skeletons
              <NewsSkeletonGroup count={itemCount} />
            ) : (
              // News cards
              items.map((item, index) => (
                <div key={item.id} className="snap-start">
                  <NewsCard item={item} index={index} />
                </div>
              ))
            )}

            {/* Show skeletons for additional loading items */}
            {isLoading && items.length > 0 && items.length < itemCount && (
              <>
                {Array.from({ length: itemCount - items.length }).map((_, i) => (
                  <NewsCardSkeleton
                    key={`skeleton-${i}`}
                    index={items.length + i}
                    showThumbnail={i % 2 === 0}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Scroll hint for mobile */}
        <div
          className="flex items-center justify-center gap-2 mt-2 text-xs text-zinc-500 lg:hidden"
          aria-hidden="true"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          <span>Swipe for more</span>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default NewsFeed;
