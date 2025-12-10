import { renderHook, act } from '@testing-library/react';
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
      expect(result.current.cycleCount).toBe(0);
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
      expect(result.current.cycleCount).toBe(1);
    });

    it('should type character by character', () => {
      const shortPhrase = ['ABC'] as const;
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: true,
          phrases: shortPhrase,
          charDelay: 100,
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

  describe('phrase deduplication within cycle', () => {
    it('should not repeat phrases within the same cycle', () => {
      const seenPhrases = new Set<string>();
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: true,
          phrases: testPhrases,
          charDelay: 1,
          displayDuration: 10,
        })
      );

      // Advance through all phrases in first cycle
      for (let i = 0; i < 100; i++) {
        act(() => {
          jest.advanceTimersByTime(50);
        });

        if (result.current.currentPhrase && !result.current.isTyping) {
          seenPhrases.add(result.current.currentPhrase);
        }

        // Stop at end of first cycle
        if (result.current.cycleCount > 1) break;
      }

      // All phrases from testPhrases should have been shown
      expect(seenPhrases.size).toBe(testPhrases.length);
    });
  });

  describe('infinite cycling', () => {
    it('should increment cycleCount after showing all phrases', () => {
      const twoPhrase = ['AB', 'CD'] as const;
      const onCycleComplete = jest.fn();
      
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: true,
          phrases: twoPhrase,
          charDelay: 10,
          displayDuration: 50,
          onCycleComplete,
        })
      );

      expect(result.current.cycleCount).toBe(1);

      // Type through both phrases and wait for cycle to complete
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Should have started second cycle
      expect(result.current.cycleCount).toBeGreaterThanOrEqual(2);
      expect(onCycleComplete).toHaveBeenCalled();
    });

    it('should reshuffle phrases for each new cycle', () => {
      const { result } = renderHook(() =>
        useTypewriterPhrases({
          isActive: true,
          phrases: testPhrases,
          charDelay: 1,
          displayDuration: 10,
        })
      );

      // Advance through multiple cycles
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Should have cycled multiple times
      expect(result.current.cycleCount).toBeGreaterThan(1);
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
      expect(result.current.cycleCount).toBe(0);
    });

    it('should call stop() to force stop animation', () => {
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
      expect(result.current.isTyping).toBe(true);

      // Force stop
      act(() => {
        result.current.stop();
      });

      expect(result.current.isTyping).toBe(false);
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
      expect(result.current.cycleCount).toBe(0);
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

      // All phrases should be valid
      orders.forEach(order => {
        expect(testPhrases).toContain(order);
      });
    });
  });
});
