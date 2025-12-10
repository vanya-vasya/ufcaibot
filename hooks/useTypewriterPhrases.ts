"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Default analysis phrases shown during Fight button loading
 */
export const DEFAULT_ANALYSIS_PHRASES = [
  "Reconstructing fighter DNA patterns…",
  "Scanning aggression thresholds…",
  "Predicting strike-exchange volatility…",
  "Locking onto weak-spot algorithms…",
  "Computing knockout probability curves…",
  "Decrypting opponent timing codes…",
  "Running pressure-test simulations…",
  "Mapping footwork vectors…",
  "Detecting micro-tells in movement…",
  "Analyzing cage-control dynamics…",
  "Forecasting stamina decay rates…",
  "Processing damage-absorption metrics…",
  "Rebuilding fight tempo models…",
  "Evaluating chaos resistance levels…",
  "Tracking psychological momentum shifts…",
  "Predicting counter-strike windows…",
  "Simulating ground-and-pound outcomes…",
  "Identifying submission threat clusters…",
  "Testing resilience against southpaw pressure…",
  "Estimating last-minute fight volatility…",
] as const;

export type TypewriterPhrase = string;

export interface UseTypewriterPhrasesOptions {
  /** List of phrases to display */
  phrases?: readonly TypewriterPhrase[];
  /** Time to display completed phrase before clearing (ms) */
  displayDuration?: number;
  /** Delay between characters (ms) */
  charDelay?: number;
  /** Whether the animation is active */
  isActive: boolean;
  /** Callback when a full cycle completes (all phrases shown once) */
  onCycleComplete?: () => void;
}

export interface UseTypewriterPhrasesReturn {
  /** Current displayed text (partial or full phrase) */
  displayText: string;
  /** Current full phrase being typed */
  currentPhrase: string;
  /** Index of current phrase in the shuffled list */
  phraseIndex: number;
  /** Number of completed cycles */
  cycleCount: number;
  /** Whether currently typing characters */
  isTyping: boolean;
  /** Reset the animation state */
  reset: () => void;
  /** Force stop the animation */
  stop: () => void;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
const shuffleArray = <T,>(array: readonly T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Hook for displaying typewriter-style phrases with infinite cycling
 * 
 * Features:
 * - Random phrase order (no repeats within a cycle)
 * - Character-by-character typing effect
 * - Configurable timing
 * - Auto-cleanup and cancellation
 * - Infinite cycling: after all phrases shown, reshuffles and starts new cycle
 */
/**
 * Default timing configuration for phrase display
 * - PHRASE_DISPLAY_DURATION: How long each completed phrase stays visible (10 seconds)
 * - CHAR_TYPING_DELAY: Delay between typing each character (25ms)
 */
export const PHRASE_DISPLAY_DURATION = 10000; // 10 seconds
export const CHAR_TYPING_DELAY = 25; // 25ms between characters

export const useTypewriterPhrases = ({
  phrases = DEFAULT_ANALYSIS_PHRASES,
  displayDuration = PHRASE_DISPLAY_DURATION,
  charDelay = CHAR_TYPING_DELAY,
  isActive,
  onCycleComplete,
}: UseTypewriterPhrasesOptions): UseTypewriterPhrasesReturn => {
  const [displayText, setDisplayText] = useState("");
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Refs for cleanup and state tracking
  const shuffledPhrasesRef = useRef<string[]>([]);
  const currentPhraseIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const displayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(isActive);
  const onCycleCompleteRef = useRef(onCycleComplete);

  // Keep refs in sync
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    onCycleCompleteRef.current = onCycleComplete;
  }, [onCycleComplete]);

  /**
   * Clear all timers
   */
  const clearAllTimers = useCallback(() => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    if (displayTimeoutRef.current) {
      clearTimeout(displayTimeoutRef.current);
      displayTimeoutRef.current = null;
    }
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    clearAllTimers();
    setDisplayText("");
    setCurrentPhrase("");
    setPhraseIndex(0);
    setCycleCount(0);
    setIsTyping(false);
    shuffledPhrasesRef.current = [];
    currentPhraseIndexRef.current = 0;
    charIndexRef.current = 0;
  }, [clearAllTimers]);

  /**
   * Force stop the animation
   */
  const stop = useCallback(() => {
    clearAllTimers();
    setIsTyping(false);
  }, [clearAllTimers]);

  /**
   * Start a new cycle with reshuffled phrases
   */
  const startNewCycle = useCallback(() => {
    shuffledPhrasesRef.current = shuffleArray(phrases);
    currentPhraseIndexRef.current = 0;
    setCycleCount(prev => prev + 1);
  }, [phrases]);

  /**
   * Get next phrase, starting new cycle if needed
   */
  const getNextPhrase = useCallback((): string => {
    // If we've shown all phrases, start a new cycle
    if (currentPhraseIndexRef.current >= shuffledPhrasesRef.current.length) {
      startNewCycle();
      onCycleCompleteRef.current?.();
    }

    const phrase = shuffledPhrasesRef.current[currentPhraseIndexRef.current];
    setPhraseIndex(currentPhraseIndexRef.current);
    currentPhraseIndexRef.current++;
    
    return phrase;
  }, [startNewCycle]);

  /**
   * Type the next phrase
   */
  const typeNextPhrase = useCallback(() => {
    if (!isActiveRef.current) {
      return;
    }

    const nextPhrase = getNextPhrase();
    
    if (!nextPhrase) {
      return;
    }

    setCurrentPhrase(nextPhrase);
    setDisplayText("");
    charIndexRef.current = 0;
    setIsTyping(true);

    // Start typing character by character
    typingIntervalRef.current = setInterval(() => {
      if (!isActiveRef.current) {
        clearAllTimers();
        return;
      }

      charIndexRef.current++;
      const newText = nextPhrase.slice(0, charIndexRef.current);
      setDisplayText(newText);

      // Finished typing this phrase
      if (charIndexRef.current >= nextPhrase.length) {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        setIsTyping(false);

        // Wait for display duration, then clear and show next phrase
        displayTimeoutRef.current = setTimeout(() => {
          if (!isActiveRef.current) return;
          setDisplayText("");
          
          // Small delay before next phrase starts
          displayTimeoutRef.current = setTimeout(() => {
            if (!isActiveRef.current) return;
            typeNextPhrase();
          }, 100);
        }, displayDuration);
      }
    }, charDelay);
  }, [charDelay, clearAllTimers, displayDuration, getNextPhrase]);

  /**
   * Start the animation when isActive becomes true
   */
  useEffect(() => {
    if (isActive) {
      // Initialize with shuffled phrases
      shuffledPhrasesRef.current = shuffleArray(phrases);
      currentPhraseIndexRef.current = 0;
      setCycleCount(1);
      
      // Start typing first phrase
      typeNextPhrase();
    }

    return () => {
      clearAllTimers();
    };
  }, [isActive, phrases, typeNextPhrase, clearAllTimers]);

  /**
   * Cleanup when isActive becomes false
   */
  useEffect(() => {
    if (!isActive) {
      reset();
    }
  }, [isActive, reset]);

  return {
    displayText,
    currentPhrase,
    phraseIndex,
    cycleCount,
    isTyping,
    reset,
    stop,
  };
};

export default useTypewriterPhrases;
