"use client";

import { useState, useCallback } from "react";
import { Trash2, ChevronDown, ChevronUp, Calendar, Clock } from "lucide-react";
import { type Prediction, formatPredictionDate, formatPredictionRelativeTime } from "@/hooks/usePredictions";

interface PredictionCardProps {
  prediction: Prediction;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  onView?: (prediction: Prediction) => void;
}

/**
 * PredictionCard - Displays a saved fight prediction
 * Features: expandable content, delete functionality, image display
 */
export const PredictionCard = ({
  prediction,
  onDelete,
  isDeleting = false,
  onView,
}: PredictionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete && !isDeleting) {
        onDelete(prediction.id);
      }
    },
    [onDelete, isDeleting, prediction.id]
  );

  const handleView = useCallback(() => {
    if (onView) {
      onView(prediction);
    }
  }, [onView, prediction]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggleExpand();
      }
    },
    [handleToggleExpand]
  );

  // Truncate content for preview
  const previewContent = prediction.content.length > 200
    ? `${prediction.content.slice(0, 200)}...`
    : prediction.content;

  return (
    <div
      className={`
        relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden
        transition-all duration-300 hover:border-zinc-700
        ${isDeleting ? "opacity-50 pointer-events-none" : ""}
      `}
      role="article"
      aria-labelledby={`prediction-${prediction.id}-title`}
    >
      {/* Header - Always visible */}
      <div
        className="p-4 cursor-pointer"
        onClick={handleToggleExpand}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${prediction.fighterA} vs ${prediction.fighterB} prediction`}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Fight info */}
          <div className="flex-1 min-w-0">
            <h3
              id={`prediction-${prediction.id}-title`}
              className="text-lg font-bold text-white truncate"
              style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
            >
              {prediction.fighterA.toUpperCase()} <span className="text-red-500">VS</span>{" "}
              {prediction.fighterB.toUpperCase()}
            </h3>
            
            {/* Event name if available */}
            {prediction.event && (
              <p className="text-sm text-zinc-400 mt-1">{prediction.event}</p>
            )}

            {/* Date info */}
            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatPredictionRelativeTime(prediction.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatPredictionDate(prediction.createdAt)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Delete button */}
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-zinc-500 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-colors"
                aria-label="Delete prediction"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Expand/collapse indicator */}
            <div className="p-2 text-zinc-500">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </div>
        </div>

        {/* Preview content (when collapsed) */}
        {!isExpanded && (
          <p className="mt-3 text-sm text-zinc-400 line-clamp-2">
            {previewContent}
          </p>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-zinc-800">
          {/* Fighter image if available */}
          {prediction.imageUrl && (
            <div className="mt-4 mb-4">
              <img
                src={prediction.imageUrl}
                alt={`${prediction.fighterA} vs ${prediction.fighterB}`}
                className="w-full max-h-64 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          )}

          {/* Full content */}
          <div className="mt-4 text-sm text-zinc-300 whitespace-pre-wrap">
            {prediction.content}
          </div>

          {/* View full analysis button */}
          {onView && (
            <button
              onClick={handleView}
              className="mt-4 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded transition-colors"
              style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
            >
              View Full Analysis
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
