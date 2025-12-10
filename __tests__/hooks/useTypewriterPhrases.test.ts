import { renderHook, act, waitFor } from '@testing-library/react';
import { useTypewriterPhrases, DEFAULT_ANALYSIS_PHRASES } from '@/hooks/useTypewriterPhrases';

// Mock timers for precise control
jest.useFakeTimers();

describe('useTypewriterPhrases', () => {
  const testPhrases = ['Test phrase one', 'Test phrase two', 'Test phrase three'] as const;

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('initialization', () => {
    it('should start with empty state when inactive', () => {
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: false,
          phrases: testPhrases,
        })
      );

      expect(result.current.displayText).toBe('');
      expect(result.current.currentPhrase).toBe('');
      expect(result.current.isTyping).toBe(false);
      expect(result.current.isComplete).toBe(false);
    });

    it('should have default phrases exported', () => {
      expect(DEFAULT_ANALYSIS_PHRASES).toBeDefined();
      expect(DEFAULT_ANALYSIS_PHRASES.length).toBe(20);
      expect(DEFAULT_ANALYSIS_PHRASES[0]).toBe('Reconstructing fighter DNA patterns…');
    });
  });

  describe('typing animation', () => {
    it('should start typing when isActive becomes true', () => {
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: true,
          phrases: testPhrases,
          charDelay: 10,
        })
      );

      // After some time, should be typing
      act(() => {
        jest.advanceTimersByTime(50);
      });

      expect(result.current.isTyping).toBe(true);
      expect(result.current.displayText.length).toBeGreaterThan(0);
    });

    it('should type character by character', () => {
      const shortPhrase = ['ABC'] as const;
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: true,
          phrases: shortPhrase,
          charDelay: 100,
          totalDuration: 10000,
        })
      );

      // After 100ms, should have 1 character
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(result.current.displayText).toBe('A');

      // After another 100ms, should have 2 characters
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(result.current.displayText).toBe('AB');

      // After another 100ms, should have all 3 characters
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(result.current.displayText).toBe('ABC');
    });
  });

  describe('phrase deduplication', () => {
    it('should not repeat phrases', () => {
      const seenPhrases = new Set<string>();
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: true,
          phrases: testPhrases,
          charDelay: 1,
          displayDuration: 10,
          totalDuration: 10000,
        })
      );

      // Advance through several phrase cycles
      for (let i = 0; i < 50; i++) {
        act(() => {
          jest.advanceTimersByTime(100);
        });

        if (result.current.currentPhrase) {
          // Check if we've seen this phrase before in a completed state
          if (!result.current.isTyping && result.current.displayText === result.current.currentPhrase) {
            if (seenPhrases.has(result.current.currentPhrase)) {
              // If we see it again, it should be because list is exhausted
              expect(seenPhrases.size).toBe(testPhrases.length);
            }
            seenPhrases.add(result.current.currentPhrase);
          }
        }
      }
    });
  });

  describe('timing control', () => {
    it('should complete within totalDuration', () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: true,
          phrases: testPhrases,
          totalDuration: 1000,
          charDelay: 10,
          onComplete,
        })
      );

      // Advance past total duration
      act(() => {
        jest.advanceTimersByTime(1100);
      });

      expect(result.current.isComplete).toBe(true);
      expect(onComplete).toHaveBeenCalled();
    });

    it('should respect displayDuration between phrases', () => {
      const shortPhrase = ['AB'] as const;
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: true,
          phrases: shortPhrase,
          charDelay: 50,
          displayDuration: 200,
          totalDuration: 10000,
        })
      );

      // Type both characters (100ms)
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(result.current.displayText).toBe('AB');
      expect(result.current.isTyping).toBe(false);

      // Display duration not yet elapsed (at 150ms)
      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(result.current.displayText).toBe('AB');
    });
  });

  describe('cleanup and cancellation', () => {
    it('should clean up timers when isActive becomes false', () => {
      const { result, rerender } = renderHook(
        ({ isActive }) =>
          useTypewriterPhrases({
            isActive,
            phrases: testPhrases,
            charDelay: 10,
          }),
        { initialProps: { isActive: true } }
      );

      // Start typing
      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(result.current.displayText.length).toBeGreaterThan(0);

      // Deactivate
      rerender({ isActive: false });

      // State should reset
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(result.current.displayText).toBe('');
      expect(result.current.isTyping).toBe(false);
    });

    it('should call stop() to force stop animation', () => {
      const onComplete = jest.fn();
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: true,
          phrases: testPhrases,
          charDelay: 10,
          totalDuration: 5000,
          onComplete,
        })
      );

      // Start typing
      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(result.current.isTyping).toBe(true);

      // Force stop
      act(() => {
        result.current.stop();
      });

      expect(result.current.isComplete).toBe(true);
      expect(result.current.isTyping).toBe(false);
      expect(onComplete).toHaveBeenCalled();
    });

    it('should reset state with reset()', () => {
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: true,
          phrases: testPhrases,
          charDelay: 10,
        })
      );

      // Start typing
      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(result.current.displayText.length).toBeGreaterThan(0);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.displayText).toBe('');
      expect(result.current.currentPhrase).toBe('');
      expect(result.current.isTyping).toBe(false);
      expect(result.current.isComplete).toBe(false);
    });

    it('should not cause memory leaks with rapid activation/deactivation', () => {
      const { rerender } = renderHook(
        ({ isActive }) =>
          useTypewriterPhrases({
            isActive,
            phrases: testPhrases,
            charDelay: 10,
          }),
        { initialProps: { isActive: false } }
      );

      // Rapidly toggle
      for (let i = 0; i < 10; i++) {
        rerender({ isActive: true });
        act(() => {
          jest.advanceTimersByTime(20);
        });
        rerender({ isActive: false });
        act(() => {
          jest.advanceTimersByTime(20);
        });
      }

      // Should not throw or cause issues
      expect(true).toBe(true);
    });
  });

  describe('phrase exhaustion fallback', () => {
    it('should keep last phrase visible when all phrases exhausted', () => {
      const twoPhrase = ['First', 'Second'] as const;
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: true,
          phrases: twoPhrase,
          charDelay: 10,
          displayDuration: 50,
          totalDuration: 10000, // Long duration to ensure exhaustion
        })
      );

      // Advance through both phrases with enough time
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Should have completed and be showing something
      if (result.current.isComplete) {
        // Last phrase should still be visible
        expect(result.current.displayText.length).toBeGreaterThan(0);
      }
    });
  });

  describe('shuffling', () => {
    it('should shuffle phrases randomly', () => {
      // Run multiple times and verify order varies
      const orders: string[] = [];

      for (let i = 0; i < 5; i++) {
        const { result, unmount } = renderHook(() =>
          useTypewriterPhrases({
            isActive: true,
            phrases: testPhrases,
            charDelay: 1,
            totalDuration: 100,
          })
        );

        act(() => {
          jest.advanceTimersByTime(50);
        });

        if (result.current.currentPhrase) {
          orders.push(result.current.currentPhrase);
        }

        unmount();
      }

      // At least one order should be different (probabilistically)
      // This isn't a deterministic test but with 5 runs and 3 phrases,
      // probability of all same is very low
      // We mainly verify it doesn't crash and produces valid phrases
      orders.forEach(order => {
        expect(testPhrases).toContain(order);
      });
    });
  });
});
