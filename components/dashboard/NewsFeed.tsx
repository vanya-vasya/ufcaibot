"use client";

import { useCallback, useRef, useEffect, useState, KeyboardEvent } from "react";
import { useNewsFeed, useResponsiveItemCount } from "@/hooks/useNewsFeed";
import { NewsCard } from "./NewsCard";
import { NewsSkeletonGroup } from "./NewsCardSkeleton";

interface NewsFeedProps {
  /** Optional class name for the container */
  className?: string;
  /** Animation duration in ms (default: 800) */
  animationDuration?: number;
}

/** Card width - reduced by 40% from 300px to 180px */
const CARD_WIDTH = 180;
const CARD_GAP = 12;
const SCROLL_SPEED = 0.3; // Slower for smaller cards
const AUTO_SCROLL_DELAY = 2000;

/**
 * NewsFeed - MMA/UFC News Slider Component
 * RTL auto-scrolling news feed with smooth slide-in animations
 *
 * Features:
 * - 40% smaller cards (180px width)
 * - Right-to-left slide-in animation per card
 * - Slow, smooth continuous scroll
 * - Hardware-accelerated animations (transform/opacity)
 * - Configurable animation duration
 */
export const NewsFeed = ({ 
  className = "",
  animationDuration = 800,
}: NewsFeedProps) => {
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
    limit: Math.max(itemCount, 12),
    refetchOnFocus: true,
    enableCache: true,
    cacheTTL: 5 * 60 * 1000,
  });

  const updateArrowVisibility = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

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

    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    const scrollAmount = SCROLL_SPEED * (deltaTime / 16.67);
    container.scrollLeft += scrollAmount;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    if (scrollLeft >= scrollWidth - clientWidth - 1) {
      container.scrollLeft = 0;
    }

    updateArrowVisibility();
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, isHovered, isLoading, items.length, updateArrowVisibility]);

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

  const handleScrollLeft = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsPaused(true);
    container.scrollBy({
      left: -(CARD_WIDTH + CARD_GAP) * 2,
      behavior: "smooth",
    });

    setTimeout(() => {
      setIsPaused(false);
      updateArrowVisibility();
    }, 3000);
  }, [updateArrowVisibility]);

  const handleScrollRight = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsPaused(true);
    container.scrollBy({
      left: (CARD_WIDTH + CARD_GAP) * 2,
      behavior: "smooth",
    });

    setTimeout(() => {
      setIsPaused(false);
      updateArrowVisibility();
    }, 3000);
  }, [updateArrowVisibility]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleScrollLeft();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleScrollRight();
    }
  }, [handleScrollLeft, handleScrollRight]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const handleFocus = useCallback(() => setIsPaused(true), []);
  const handleBlur = useCallback(() => setIsPaused(false), []);
  const handleRetry = useCallback(() => refresh(), [refresh]);

  if (error && items.length === 0) {
    return (
      <section
        aria-label="MMA News Feed - Error"
        className={`w-full bg-black py-3 px-4 ${className}`}
      >
        <div className="max-w-[1350px] mx-auto">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <svg className="w-8 h-8 text-zinc-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-zinc-400 text-sm mb-2">{error}</p>
            <button
              onClick={handleRetry}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors"
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
      className={`w-full bg-black py-3 overflow-hidden ${className}`}
    >
      {/* RTL Slide Animation Keyframes */}
      <style jsx>{`
        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        .news-card-animate {
          animation: slideInFromRight ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .news-card-animate {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <div className="max-w-[1350px] mx-auto">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-4 mb-2">
          <div className="flex items-center gap-2">
            <h2
              className="text-sm sm:text-base font-bold text-white uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-ufc-heading)' }}
            >
              MMA News
            </h2>
            {isStale && (
              <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                Cached
              </span>
            )}
          </div>

          {/* Navigation controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleScrollLeft}
              disabled={!showLeftArrow || isLoading}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                showLeftArrow 
                  ? "text-white bg-zinc-800 hover:bg-red-600" 
                  : "text-zinc-600 bg-zinc-900 opacity-50"
              }`}
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleScrollRight}
              disabled={!showRightArrow || isLoading}
              className={`p-1.5 rounded-full transition-all duration-300 ${
                showRightArrow 
                  ? "text-white bg-zinc-800 hover:bg-red-600" 
                  : "text-zinc-600 bg-zinc-900 opacity-50"
              }`}
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={handleRetry}
              disabled={isLoading}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-50"
              aria-label="Refresh"
            >
              <svg className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
          {/* Fade gradients */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-r from-black to-transparent transition-opacity ${showLeftArrow ? "opacity-100" : "opacity-0"}`}
            aria-hidden="true"
          />
          <div
            className={`absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-l from-black to-transparent transition-opacity ${showRightArrow ? "opacity-100" : "opacity-0"}`}
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
            className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 pt-1 focus:outline-none"
            style={{ scrollBehavior: isPaused ? "smooth" : "auto" }}
          >
            {isLoading && items.length === 0 ? (
              <NewsSkeletonGroup count={itemCount} />
            ) : (
              <>
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 news-card-animate"
                    style={{ 
                      width: `${CARD_WIDTH}px`,
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <NewsCard 
                      item={item} 
                      index={index} 
                      compact={true}
                      animationDuration={animationDuration}
                    />
                  </div>
                ))}
                
                {/* Loop cards */}
                {items.length > 3 && items.slice(0, 4).map((item, index) => (
                  <div
                    key={`loop-${item.id}`}
                    className="flex-shrink-0"
                    style={{ width: `${CARD_WIDTH}px` }}
                  >
                    <NewsCard item={item} index={items.length + index} compact={true} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsFeed;
