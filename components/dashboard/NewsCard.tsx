"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import Image from "next/image";
import { formatRelativeTime, type NewsItem } from "@/hooks/useNewsFeed";

interface NewsCardProps {
  /** News item data */
  item: NewsItem;
  /** Optional index for staggered animations */
  index?: number;
  /** Compact mode (40% smaller) */
  compact?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
}

/**
 * NewsCard - Individual news article card
 * Supports compact mode (40% smaller) with RTL slide animation
 * Hardware-accelerated using transform and opacity
 */
export const NewsCard = ({ 
  item, 
  index = 0, 
  compact = false,
  animationDuration = 800,
}: NewsCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = useCallback(() => setImageError(true), []);

  const handleClick = useCallback(() => {
    window.open(item.link, "_blank", "noopener,noreferrer");
  }, [item.link]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const relativeTime = formatRelativeTime(item.pubDate);
  const showThumbnail = item.thumbnail && !imageError;

  return (
    <>
      {/* Reusable RTL slide animation class and responsive line-clamp */}
      <style jsx>{`
        .news-card-slide-rtl {
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        
        .news-card-slide-rtl:hover {
          transform: translateY(-2px) scale(1.02);
        }
        
        .news-card-title-compact {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 4;
        }
        
        @media (min-width: 640px) {
          .news-card-title-compact {
            -webkit-line-clamp: 5;
          }
        }
        
        @media (min-width: 768px) {
          .news-card-title-compact {
            -webkit-line-clamp: 6;
          }
        }
      `}</style>

      <article
        role="article"
        tabIndex={0}
        aria-label={`${item.title} from ${item.source}, published ${relativeTime}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          news-card-slide-rtl
          group relative flex flex-col bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 
          rounded-md cursor-pointer h-full
          transition-all ease-out
          hover:border-zinc-600 hover:bg-zinc-800/90
          focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 focus-visible:ring-offset-black
          w-full overflow-hidden
          ${compact ? "min-h-[240px] sm:min-h-[260px] md:min-h-[280px]" : "min-h-[320px]"}
        `}
        style={{
          transitionDuration: `${animationDuration / 2}ms`,
        }}
      >
        {/* Thumbnail - Compact: smaller aspect ratio */}
        {showThumbnail && (
          <div className={`relative w-full overflow-hidden bg-zinc-800 flex-shrink-0 ${compact ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
            <Image
              src={item.thumbnail!}
              alt=""
              fill
              sizes={compact ? "180px" : "300px"}
              className={`
                object-cover transition-transform
                ${isHovered ? "scale-105" : "scale-100"}
              `}
              style={{ transitionDuration: `${animationDuration}ms` }}
              onError={handleImageError}
              loading="lazy"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 to-transparent" />
          </div>
        )}

        {/* Content - Compact styling */}
        <div className={`flex flex-col flex-1 min-h-0 overflow-hidden ${compact ? "p-2.5 sm:p-3" : "p-3"}`}>
          {/* Source and Time */}
          <div className={`flex items-center justify-between gap-1 flex-shrink-0 ${compact ? "mb-1.5 sm:mb-2" : "mb-1"}`}>
            <span 
              className={`font-semibold text-red-500 uppercase tracking-wide truncate max-w-[55%] ${compact ? "text-[10px] sm:text-xs" : "text-xs"}`}
              style={{ fontFamily: 'var(--font-ufc-heading)' }}
            >
              {item.source}
            </span>
            <time 
              dateTime={item.pubDate}
              className={`text-zinc-500 whitespace-nowrap flex-shrink-0 ${compact ? "text-[9px] sm:text-[10px]" : "text-xs"}`}
            >
              {relativeTime}
            </time>
          </div>

          {/* Title - Increased font size to fill card, responsive line-clamp */}
          <h3 
            className={`font-bold text-white flex-1 group-hover:text-red-400 transition-colors ${compact ? "text-sm sm:text-base md:text-lg leading-snug sm:leading-normal md:leading-relaxed news-card-title-compact" : "text-base sm:text-lg leading-relaxed line-clamp-4 sm:line-clamp-5"}`}
            style={{ 
              fontFamily: 'var(--font-ufc-heading)',
              transitionDuration: `${animationDuration / 3}ms`,
            }}
          >
            {item.title}
          </h3>

          {/* Description - Hidden in compact mode for space */}
          {!compact && item.description && (
            <p 
              className="text-xs text-zinc-400 line-clamp-2 leading-relaxed flex-1 min-h-0"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.description}
            </p>
          )}

          {/* Read more - Compact: simpler indicator */}
          <div 
            className={`mt-auto flex items-center justify-between flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${compact ? "pt-1" : "pt-2 border-t border-zinc-700/50"}`}
            style={{ transitionDuration: `${animationDuration / 3}ms` }}
          >
            <span className={`text-zinc-500 ${compact ? "text-[9px]" : "text-xs"}`}>
              {compact ? "→" : "Read more"}
            </span>
            {!compact && (
              <svg 
                className="w-3 h-3 text-red-500 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        </div>

        {/* Hover glow */}
        <div 
          className="absolute inset-0 rounded-md pointer-events-none bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ transitionDuration: `${animationDuration / 2}ms` }}
          aria-hidden="true"
        />
      </article>
    </>
  );
};

export default NewsCard;
