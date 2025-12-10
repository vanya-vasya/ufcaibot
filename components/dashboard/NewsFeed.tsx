"use client";

import { useCallback, useRef, useEffect, useState, KeyboardEvent } from "react";
import { useNewsFeed, useResponsiveItemCount } from "@/hooks/useNewsFeed";
import { NewsCard } from "./NewsCard";
import { NewsSkeletonGroup } from "./NewsCardSkeleton";

interface NewsFeedProps {
  /** Optional class name for the container */
  className?: string;
}

/** Card width including gap (fixed for consistent slider behavior) */
const CARD_WIDTH = 300;
const CARD_GAP = 16;
const SCROLL_SPEED = 0.5; // pixels per frame (slow, smooth scroll)
const AUTO_SCROLL_DELAY = 2000; // ms before auto-scroll starts

/**
 * NewsFeed - MMA/UFC News Slider Component
 * RTL auto-scrolling news feed with smooth transitions
 *
 * Features:
 * - Right-to-left continuous auto-scroll
 * - Slow, smooth transition timing
 * - Navigation controls (prev/next arrows)
 * - Pause on hover/focus
 * - Fixed card widths for consistent layout
 * - Accessible keyboard navigation
 * - Error handling with retry
 */
export const NewsFeed = ({ className = "" }: NewsFeedProps) => {
  const itemCount = useResponsiveItemCount();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const {
    items,
    isLoading,
    error,
    isStale,
    refresh,
  } = useNewsFeed({
    limit: Math.max(itemCount, 10), // Fetch more for seamless looping
    refetchOnFocus: true,
    enableCache: true,
    cacheTTL: 5 * 60 * 1000,
  });

  /**
   * Update arrow visibility based on scroll position
   */
  const updateArrowVisibility = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  /**
   * Smooth auto-scroll animation (RTL direction)
   */
  const animate = useCallback((timestamp: number) => {
    if (isPaused || isHovered || isLoading || items.length === 0) {
      animationRef.current = requestAnimationFrame(animate);
      lastTimeRef.current = timestamp;
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    // Calculate delta time for smooth animation
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Scroll right-to-left (increase scrollLeft)
    const scrollAmount = SCROLL_SPEED * (deltaTime / 16.67); // Normalize to 60fps
    container.scrollLeft += scrollAmount;

    // Check if we've reached the end, loop back smoothly
    const { scrollLeft, scrollWidth, clientWidth } = container;
    if (scrollLeft >= scrollWidth - clientWidth - 1) {
      // Reset to start for infinite loop effect
      container.scrollLeft = 0;
    }

    updateArrowVisibility();
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, isHovered, isLoading, items.length, updateArrowVisibility]);

  /**
   * Start auto-scroll after delay
   */
  useEffect(() => {
    if (items.length === 0 || isLoading) return;

    const timeoutId = setTimeout(() => {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    }, AUTO_SCROLL_DELAY);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [items.length, isLoading, animate]);

  /**
   * Navigate left (against auto-scroll direction)
   */
  const handleScrollLeft = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsPaused(true);
    container.scrollBy({
      left: -(CARD_WIDTH + CARD_GAP),
      behavior: "smooth",
    });

    // Resume auto-scroll after user interaction
    setTimeout(() => {
      setIsPaused(false);
      updateArrowVisibility();
    }, 3000);
  }, [updateArrowVisibility]);

  /**
   * Navigate right (with auto-scroll direction)
   */
  const handleScrollRight = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsPaused(true);
    container.scrollBy({
      left: CARD_WIDTH + CARD_GAP,
      behavior: "smooth",
    });

    setTimeout(() => {
      setIsPaused(false);
      updateArrowVisibility();
    }, 3000);
  }, [updateArrowVisibility]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleScrollLeft();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleScrollRight();
    }
  }, [handleScrollLeft, handleScrollRight]);

  /**
   * Pause on hover/focus
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsPaused(false);
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
      className={`w-full bg-black py-4 overflow-hidden ${className}`}
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
            {isHovered && (
              <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded animate-pulse">
                Paused
              </span>
            )}
          </div>

          {/* Navigation controls */}
          <div className="flex items-center gap-2">
            {/* Left arrow */}
            <button
              onClick={handleScrollLeft}
              disabled={!showLeftArrow || isLoading}
              className={`
                p-2 rounded-full transition-all duration-300
                ${showLeftArrow 
                  ? "text-white bg-zinc-800 hover:bg-red-600 hover:scale-110" 
                  : "text-zinc-600 bg-zinc-900 cursor-not-allowed opacity-50"
                }
                focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
              `}
              aria-label="Scroll left"
              title="Previous"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right arrow */}
            <button
              onClick={handleScrollRight}
              disabled={!showRightArrow || isLoading}
              className={`
                p-2 rounded-full transition-all duration-300
                ${showRightArrow 
                  ? "text-white bg-zinc-800 hover:bg-red-600 hover:scale-110" 
                  : "text-zinc-600 bg-zinc-900 cursor-not-allowed opacity-50"
                }
                focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
              `}
              aria-label="Scroll right"
              title="Next"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Refresh button */}
            <button
              onClick={handleRetry}
              disabled={isLoading}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
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
        </div>

        {/* Slider container */}
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Left fade gradient */}
          <div
            className={`
              absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none
              bg-gradient-to-r from-black via-black/80 to-transparent
              transition-opacity duration-300
              ${showLeftArrow ? "opacity-100" : "opacity-0"}
            `}
            aria-hidden="true"
          />

          {/* Right fade gradient */}
          <div
            className={`
              absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none
              bg-gradient-to-l from-black via-black/80 to-transparent
              transition-opacity duration-300
              ${showRightArrow ? "opacity-100" : "opacity-0"}
            `}
            aria-hidden="true"
          />

          {/* News cards slider */}
          <div
            ref={scrollContainerRef}
            role="region"
            aria-label="News articles slider"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onScroll={updateArrowVisibility}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 pt-1 focus:outline-none"
            style={{
              scrollBehavior: isPaused ? "smooth" : "auto",
            }}
          >
            {isLoading && items.length === 0 ? (
              <NewsSkeletonGroup count={itemCount} />
            ) : (
              <>
                {/* Render news cards with fixed width */}
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0"
                    style={{ width: `${CARD_WIDTH}px` }}
                  >
                    <NewsCard item={item} index={index} />
                  </div>
                ))}
                
                {/* Duplicate first few items for seamless loop effect */}
                {items.length > 3 && items.slice(0, 3).map((item, index) => (
                  <div
                    key={`loop-${item.id}`}
                    className="flex-shrink-0"
                    style={{ width: `${CARD_WIDTH}px` }}
                  >
                    <NewsCard item={item} index={items.length + index} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Progress indicator dots */}
        {items.length > 0 && (
          <div 
            className="flex items-center justify-center gap-1.5 mt-3 px-4"
            aria-hidden="true"
          >
            {items.slice(0, Math.min(items.length, 10)).map((_, index) => (
              <div
                key={index}
                className={`
                  w-1.5 h-1.5 rounded-full transition-all duration-300
                  ${index === 0 ? "bg-red-500 w-3" : "bg-zinc-700 hover:bg-zinc-500"}
                `}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsFeed;
