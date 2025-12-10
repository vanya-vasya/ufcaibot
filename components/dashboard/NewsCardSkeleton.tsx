"use client";

/** Fixed card width matching NewsFeed slider */
const CARD_WIDTH = 300;

interface NewsCardSkeletonProps {
  /** Show thumbnail placeholder */
  showThumbnail?: boolean;
  /** Animation delay index */
  index?: number;
}

/**
 * NewsCardSkeleton - Loading placeholder for NewsCard
 * Matches the exact dimensions and layout of NewsCard
 */
export const NewsCardSkeleton = ({
  showThumbnail = true,
  index = 0,
}: NewsCardSkeletonProps) => {
  return (
    <div
      role="status"
      aria-label="Loading news article"
      className="flex flex-col bg-zinc-900/80 border border-zinc-800 rounded-lg overflow-hidden flex-shrink-0 h-full animate-pulse"
      style={{
        width: `${CARD_WIDTH}px`,
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Thumbnail skeleton */}
      {showThumbnail && (
        <div className="w-full aspect-[16/9] bg-zinc-800 relative overflow-hidden">
          <div className="absolute inset-0 shimmer-skeleton" />
        </div>
      )}

      {/* Content skeleton */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 space-y-3">
        {/* Source and time */}
        <div className="flex items-center justify-between gap-2">
          <div className="h-3 w-16 bg-zinc-700 rounded shimmer-skeleton" />
          <div className="h-3 w-10 bg-zinc-800 rounded shimmer-skeleton" />
        </div>

        {/* Title - 2 lines */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-zinc-700 rounded shimmer-skeleton" />
          <div className="h-4 w-3/4 bg-zinc-700 rounded shimmer-skeleton" />
        </div>

        {/* Description - 2 lines */}
        <div className="space-y-2 flex-1">
          <div className="h-3 w-full bg-zinc-800 rounded shimmer-skeleton" />
          <div className="h-3 w-5/6 bg-zinc-800 rounded shimmer-skeleton" />
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Loading news article...</span>

      <style jsx>{`
        .shimmer-skeleton {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Multiple skeletons for loading state
 */
export const NewsSkeletonGroup = ({ count = 5 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} index={i} showThumbnail={i % 2 === 0} />
      ))}
    </>
  );
};

export default NewsCardSkeleton;
