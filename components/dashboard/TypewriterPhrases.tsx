"use client";

import { 
  useTypewriterPhrases, 
  DEFAULT_ANALYSIS_PHRASES, 
  PHRASE_DISPLAY_DURATION,
  CHAR_TYPING_DELAY,
  type TypewriterPhrase 
} from "@/hooks/useTypewriterPhrases";

export interface TypewriterPhrasesProps {
  /** Whether the animation is active */
  isActive: boolean;
  /** Optional custom phrases list */
  phrases?: readonly TypewriterPhrase[];
  /** Time to display completed phrase (ms) - default 10000 (10 seconds) */
  displayDuration?: number;
  /** Delay between characters (ms) - default 25 */
  charDelay?: number;
  /** Callback when a full cycle completes */
  onCycleComplete?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * TypewriterPhrases - Displays phrases with typewriter effect
 * 
 * Cycles through all phrases in random order, then reshuffles and repeats indefinitely.
 */
export const TypewriterPhrases = ({
  isActive,
  phrases = DEFAULT_ANALYSIS_PHRASES,
  displayDuration = PHRASE_DISPLAY_DURATION,
  charDelay = CHAR_TYPING_DELAY,
  onCycleComplete,
  className = "",
  testId = "typewriter-phrases",
}: TypewriterPhrasesProps) => {
  const { displayText, isTyping } = useTypewriterPhrases({
    isActive,
    phrases,
    displayDuration,
    charDelay,
    onCycleComplete,
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

export { DEFAULT_ANALYSIS_PHRASES, PHRASE_DISPLAY_DURATION, CHAR_TYPING_DELAY };
export default TypewriterPhrases;
