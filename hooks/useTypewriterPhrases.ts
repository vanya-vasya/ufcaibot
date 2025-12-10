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
  /** Total duration for the entire animation cycle (ms) */
  totalDuration?: number;
  /** Time to display completed phrase before clearing (ms) */
  displayDuration?: number;
  /** Delay between characters (ms) */
  charDelay?: number;
  /** Whether the animation is active */
  isActive: boolean;
  /** Callback when animation completes or is cancelled */
  onComplete?: () => void;
}

export interface UseTypewriterPhrasesReturn {
  /** Current displayed text (partial or full phrase) */
  displayText: string;
  /** Current full phrase being typed */
  currentPhrase: string;
  /** Index of current phrase in the shuffled list */
  phraseIndex: number;
  /** Whether currently typing characters */
  isTyping: boolean;
  /** Whether animation has completed (all phrases shown or timed out) */
  isComplete: boolean;
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
 * Hook for displaying typewriter-style phrases with timing control
 * 
 * Features:
 * - Random phrase order (no repeats)
 * - Character-by-character typing effect
 * - Configurable timing
 * - Auto-cleanup and cancellation
 * - Keeps last phrase visible if list exhausted
 */
export const useTypewriterPhrases = ({
  phrases = DEFAULT_ANALYSIS_PHRASES,
  totalDuration = 5000,
  displayDuration = 300,
  charDelay = 30,
  isActive,
  onComplete,
}: UseTypewriterPhrasesOptions): UseTypewriterPhrasesReturn => {
  const [displayText, setDisplayText] = useState("");
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Refs for cleanup and state tracking
  const shuffledPhrasesRef = useRef<string[]>([]);
  const shownPhrasesRef = useRef<Set<number>>(new Set());
  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const displayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const globalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isActiveRef = useRef(isActive);
  const onCompleteRef = useRef(onComplete);

  // Keep refs in sync
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

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
    if (globalTimeoutRef.current) {
      clearTimeout(globalTimeoutRef.current);
      globalTimeoutRef.current = null;
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
    setIsTyping(false);
    setIsComplete(false);
    shuffledPhrasesRef.current = [];
    shownPhrasesRef.current = new Set();
    charIndexRef.current = 0;
    startTimeRef.current = 0;
  }, [clearAllTimers]);

  /**
   * Force stop the animation
   */
  const stop = useCallback(() => {
    clearAllTimers();
    setIsTyping(false);
    setIsComplete(true);
    onCompleteRef.current?.();
  }, [clearAllTimers]);

  /**
   * Get next phrase that hasn't been shown
   */
  const getNextPhrase = useCallback((): string | null => {
    const shuffled = shuffledPhrasesRef.current;
    
    for (let i = 0; i < shuffled.length; i++) {
      if (!shownPhrasesRef.current.has(i)) {
        shownPhrasesRef.current.add(i);
        setPhraseIndex(i);
        return shuffled[i];
      }
    }
    
    return null; // All phrases exhausted
  }, []);

  /**
   * Type the next phrase
   */
  const typeNextPhrase = useCallback(() => {
    // Check if we've exceeded total duration
    const elapsed = Date.now() - startTimeRef.current;
    if (elapsed >= totalDuration) {
      setIsComplete(true);
      setIsTyping(false);
      onCompleteRef.current?.();
      return;
    }

    const nextPhrase = getNextPhrase();
    
    if (!nextPhrase) {
      // All phrases exhausted - keep last phrase visible
      setIsComplete(true);
      setIsTyping(false);
      onCompleteRef.current?.();
      return;
    }

    setCurrentPhrase(nextPhrase);
    setDisplayText("");
    charIndexRef.current = 0;
    setIsTyping(true);

    // Calculate remaining time
    const remainingTime = totalDuration - elapsed;
    const estimatedTypeTime = nextPhrase.length * charDelay;
    const estimatedCycleTime = estimatedTypeTime + displayDuration + 100; // 100ms buffer

    // Start typing
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

        // Check if we have time for another phrase
        const currentElapsed = Date.now() - startTimeRef.current;
        const timeLeft = totalDuration - currentElapsed;

        if (timeLeft > estimatedCycleTime && shownPhrasesRef.current.size < shuffledPhrasesRef.current.length) {
          // Wait, then clear and show next phrase
          displayTimeoutRef.current = setTimeout(() => {
            if (!isActiveRef.current) return;
            setDisplayText("");
            
            // Small delay before next phrase
            displayTimeoutRef.current = setTimeout(() => {
              if (!isActiveRef.current) return;
              typeNextPhrase();
            }, 100);
          }, displayDuration);
        } else {
          // Keep this phrase visible - we're out of time or phrases
          setIsComplete(true);
          onCompleteRef.current?.();
        }
      }
    }, charDelay);
  }, [charDelay, clearAllTimers, displayDuration, getNextPhrase, totalDuration]);

  /**
   * Start the animation when isActive becomes true
   */
  useEffect(() => {
    if (isActive && !isComplete) {
      // Initialize
      shuffledPhrasesRef.current = shuffleArray(phrases);
      shownPhrasesRef.current = new Set();
      startTimeRef.current = Date.now();
      
      // Start typing first phrase
      typeNextPhrase();

      // Set global timeout to stop after totalDuration
      globalTimeoutRef.current = setTimeout(() => {
        clearAllTimers();
        setIsTyping(false);
        setIsComplete(true);
        onCompleteRef.current?.();
      }, totalDuration);
    }

    return () => {
      if (!isActive) {
        clearAllTimers();
      }
    };
  }, [isActive, isComplete, phrases, totalDuration, typeNextPhrase, clearAllTimers]);

  /**
   * Cleanup when isActive becomes false
   */
  useEffect(() => {
    if (!isActive && (isTyping || displayText)) {
      reset();
    }
  }, [isActive, isTyping, displayText, reset]);

  return {
    displayText,
    currentPhrase,
    phraseIndex,
    isTyping,
    isComplete,
    reset,
    stop,
  };
};

export default useTypewriterPhrases;
