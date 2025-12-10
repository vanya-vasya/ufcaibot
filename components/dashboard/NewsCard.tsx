"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import Image from "next/image";
import { formatRelativeTime, type NewsItem } from "@/hooks/useNewsFeed";

interface NewsCardProps {
  /** News item data */
  item: NewsItem;
  /** Optional index for staggered animations */
  index?: number;
}

/**
 * NewsCard - Individual news article card
 * Displays title, source, relative time, excerpt, and optional thumbnail
 * Fully accessible with keyboard navigation and ARIA labels
 */
export const NewsCard = ({ item, index = 0 }: NewsCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

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
    <article
      role="article"
      tabIndex={0}
      aria-label={`${item.title} from ${item.source}, published ${relativeTime}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative flex flex-col bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 
        rounded-lg overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
        hover:border-zinc-600 hover:bg-zinc-800/90
        focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black
        min-w-[240px] max-w-[280px] sm:min-w-[260px] sm:max-w-[300px] lg:min-w-[280px] lg:max-w-[320px]
        flex-shrink-0 h-full
      `}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Thumbnail */}
      {showThumbnail && (
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-800">
          <Image
            src={item.thumbnail!}
            alt=""
            fill
            sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 320px"
            className={`
              object-cover transition-transform duration-500
              ${isHovered ? "scale-105" : "scale-100"}
            `}
            onError={handleImageError}
            loading="lazy"
            unoptimized // External URLs
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        {/* Source and Time */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span 
            className="text-xs font-semibold text-red-500 uppercase tracking-wide truncate"
            style={{ fontFamily: 'var(--font-ufc-heading)' }}
          >
            {item.source}
          </span>
          <time 
            dateTime={item.pubDate}
            className="text-xs text-zinc-500 whitespace-nowrap"
          >
            {relativeTime}
          </time>
        </div>

        {/* Title */}
        <h3 
          className={`
            text-sm sm:text-base font-bold text-white mb-2 
            line-clamp-2 leading-tight
            group-hover:text-red-400 transition-colors duration-200
          `}
          style={{ fontFamily: 'var(--font-ufc-heading)' }}
        >
          {item.title}
        </h3>

        {/* Description/Excerpt */}
        {item.description && (
          <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed flex-1">
            {item.description}
          </p>
        )}

        {/* Read more indicator */}
        <div 
          className={`
            mt-3 pt-2 border-t border-zinc-700/50 flex items-center justify-between
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
          `}
        >
          <span className="text-xs text-zinc-500">Read more</span>
          <svg 
            className="w-4 h-4 text-red-500 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Hover effect glow */}
      <div 
        className={`
          absolute inset-0 rounded-lg pointer-events-none
          bg-gradient-to-br from-red-500/5 via-transparent to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        `}
        aria-hidden="true"
      />
    </article>
  );
};

export default NewsCard;
