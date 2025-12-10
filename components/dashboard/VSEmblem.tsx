"use client";

import { TypewriterPhrases } from "./TypewriterPhrases";
import { DEFAULT_ANALYSIS_PHRASES, type TypewriterPhrase } from "@/hooks/useTypewriterPhrases";

interface VSEmblemProps {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  /** Custom phrases for the typewriter effect */
  analysisPhrases?: readonly TypewriterPhrase[];
  /** Total duration for phrase animation (ms) - default 5000 */
  phraseDuration?: number;
  /** Callback when phrase animation completes */
  onPhraseComplete?: () => void;
}

export const VSEmblem = ({ 
  className = "", 
  onClick, 
  disabled = false, 
  isLoading = false,
  analysisPhrases = DEFAULT_ANALYSIS_PHRASES,
  phraseDuration = 5000,
  onPhraseComplete,
}: VSEmblemProps) => {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-red-500 rounded-lg px-4 py-2 transition-all ${
          disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
        data-testid="vs-emblem"
        aria-label={isLoading ? "Processing fight analysis" : "Start fight analysis"}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-2" role="status" aria-live="polite">
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span
              className="text-2xl md:text-3xl font-black text-white"
              style={{
                fontFamily: 'var(--font-ufc-heading)',
                letterSpacing: '0.05em',
              }}
            >
              ANALYZING
            </span>
          </div>
        ) : (
          <span
            className="text-3xl md:text-4xl font-black text-white dark:text-white fight-button-text"
            style={{
              fontFamily: 'var(--font-ufc-heading)',
              letterSpacing: '0.05em',
            }}
          >
            FIGHT
          </span>
        )}

        <style jsx>{`
          @keyframes jump {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }

          @keyframes blink {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.3;
            }
          }

          .fight-button-text {
            animation: jump 1s ease-in-out infinite, blink 1.5s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .fight-button-text {
              animation: none;
            }
          }
        `}</style>
      </button>

      {/* Typewriter phrases displayed below the button during loading */}
      <TypewriterPhrases
        isActive={isLoading}
        phrases={analysisPhrases}
        totalDuration={phraseDuration}
        onComplete={onPhraseComplete}
        className="mt-4 max-w-md"
      />
    </div>
  );
};

export { DEFAULT_ANALYSIS_PHRASES };

