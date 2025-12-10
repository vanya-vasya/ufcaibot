"use client";

import { useTypewriterPhrases, DEFAULT_ANALYSIS_PHRASES, type TypewriterPhrase } from "@/hooks/useTypewriterPhrases";

export interface TypewriterPhrasesProps {
  /** Whether the animation is active */
  isActive: boolean;
  /** Optional custom phrases list */
  phrases?: readonly TypewriterPhrase[];
  /** Total duration for animation cycle (ms) - default 5000 */
  totalDuration?: number;
  /** Time to display completed phrase (ms) - default 300 */
  displayDuration?: number;
  /** Delay between characters (ms) - default 30 */
  charDelay?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * TypewriterPhrases - Displays phrases with typewriter effect
 * 
 * Used below the Fight button during loading to show analysis status.
 * Shows phrases in random order, one at a time, with character-by-character typing.
 */
export const TypewriterPhrases = ({
  isActive,
  phrases = DEFAULT_ANALYSIS_PHRASES,
  totalDuration = 5000,
  displayDuration = 300,
  charDelay = 30,
  onComplete,
  className = "",
  testId = "typewriter-phrases",
}: TypewriterPhrasesProps) => {
  const { displayText, isTyping } = useTypewriterPhrases({
    isActive,
    phrases,
    totalDuration,
    displayDuration,
    charDelay,
    onComplete,
  });

  if (!isActive && !displayText) {
    return null;
  }

  return (
    <div
      data-testid={testId}
      className={`min-h-[2rem] flex items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <p
        className="text-sm md:text-base text-zinc-400 font-mono tracking-wide text-center px-4"
        style={{
          fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
        }}
        data-testid={`${testId}-text`}
      >
        {displayText}
        {isTyping && (
          <span 
            className="inline-block w-[2px] h-4 bg-zinc-400 ml-0.5 animate-pulse"
            aria-hidden="true"
          />
        )}
      </p>
    </div>
  );
};

export { DEFAULT_ANALYSIS_PHRASES };
export default TypewriterPhrases;
