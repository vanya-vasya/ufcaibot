"use client";

/**
 * PredictionCardSkeleton - Loading skeleton for PredictionCard
 */
export const PredictionCardSkeleton = () => {
  return (
    <div
      className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 animate-pulse"
      role="status"
      aria-label="Loading prediction"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title skeleton */}
          <div className="h-6 bg-zinc-800 rounded w-3/4 mb-2" />
          {/* Event skeleton */}
          <div className="h-4 bg-zinc-800 rounded w-1/2 mb-3" />
          {/* Date skeleton */}
          <div className="flex gap-4">
            <div className="h-3 bg-zinc-800 rounded w-16" />
            <div className="h-3 bg-zinc-800 rounded w-24" />
          </div>
        </div>
        {/* Actions skeleton */}
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
          <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
        </div>
      </div>
      {/* Content preview skeleton */}
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-zinc-800 rounded w-full" />
        <div className="h-4 bg-zinc-800 rounded w-5/6" />
      </div>
    </div>
  );
};

export default PredictionCardSkeleton;
