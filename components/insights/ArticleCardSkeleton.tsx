"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ArticleCardSkeleton = ({ index = 0 }: { index?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Image Skeleton */}
      <div className="relative aspect-[16/9] bg-gray-200 animate-pulse">
        {/* Category Tag Skeleton */}
        <div className="absolute top-3 left-3">
          <div className="h-6 w-20 bg-gray-300 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Meta Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Summary Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Read More Link Skeleton */}
        <div className="pt-2">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

// Multiple skeleton cards for grid layout
const ArticleGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }, (_, index) => (
        <ArticleCardSkeleton key={index} index={index} />
      ))}
    </div>
  );
};

export { ArticleCardSkeleton, ArticleGridSkeleton };
export default ArticleCardSkeleton;
