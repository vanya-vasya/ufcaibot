import { render, screen, act } from '@testing-library/react';
import { TypewriterPhrases, DEFAULT_ANALYSIS_PHRASES } from '@/components/dashboard/TypewriterPhrases';

// Mock timers
jest.useFakeTimers();

describe('TypewriterPhrases Component', () => {
  const testPhrases = ['Test phrase one', 'Test phrase two'] as const;

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('rendering', () => {
    it('should not render when inactive and no text', () => {
      const { container } = render(
        <TypewriterPhrases isActive={false} phrases={testPhrases} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render when active', () => {
      render(<TypewriterPhrases isActive={true} phrases={testPhrases} />);

      expect(screen.getByTestId('typewriter-phrases')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <TypewriterPhrases
          isActive={true}
          phrases={testPhrases}
          className="custom-class"
        />
      );

      expect(screen.getByTestId('typewriter-phrases')).toHaveClass('custom-class');
    });

    it('should use custom testId', () => {
      render(
        <TypewriterPhrases
          isActive={true}
          phrases={testPhrases}
          testId="custom-test-id"
        />
      );

      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have role="status" for screen readers', () => {
      render(<TypewriterPhrases isActive={true} phrases={testPhrases} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-live="polite"', () => {
      render(<TypewriterPhrases isActive={true} phrases={testPhrases} />);

      expect(screen.getByTestId('typewriter-phrases')).toHaveAttribute(
        'aria-live',
        'polite'
      );
    });

    it('should have aria-atomic="true"', () => {
      render(<TypewriterPhrases isActive={true} phrases={testPhrases} />);

      expect(screen.getByTestId('typewriter-phrases')).toHaveAttribute(
        'aria-atomic',
        'true'
      );
    });
  });

  describe('typing animation', () => {
    it('should display text after delay', () => {
      render(
        <TypewriterPhrases
          isActive={true}
          phrases={['ABC']}
          charDelay={50}
        />
      );

      // Advance time to type some characters
      act(() => {
        jest.advanceTimersByTime(150);
      });

      const textElement = screen.getByTestId('typewriter-phrases-text');
      expect(textElement.textContent).toContain('AB');
    });

    it('should show cursor while typing', () => {
      render(
        <TypewriterPhrases
          isActive={true}
          phrases={['A long phrase to type']}
          charDelay={50}
        />
      );

      // Start typing
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Cursor should be visible (span with animate-pulse)
      const container = screen.getByTestId('typewriter-phrases');
      const cursor = container.querySelector('.animate-pulse');
      expect(cursor).toBeInTheDocument();
    });
  });

  describe('callback', () => {
    it('should call onCycleComplete when a full cycle finishes', () => {
      const onCycleComplete = jest.fn();
      render(
        <TypewriterPhrases
          isActive={true}
          phrases={['AB', 'CD']}
          charDelay={10}
          displayDuration={50}
          onCycleComplete={onCycleComplete}
        />
      );

      // Advance through full cycle
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(onCycleComplete).toHaveBeenCalled();
    });
  });

  describe('default phrases', () => {
    it('should export DEFAULT_ANALYSIS_PHRASES', () => {
      expect(DEFAULT_ANALYSIS_PHRASES).toBeDefined();
      expect(Array.isArray(DEFAULT_ANALYSIS_PHRASES)).toBe(true);
      expect(DEFAULT_ANALYSIS_PHRASES.length).toBe(20);
    });

    it('should use default phrases if none provided', () => {
      render(<TypewriterPhrases isActive={true} />);

      // Should render without errors
      expect(screen.getByTestId('typewriter-phrases')).toBeInTheDocument();
    });
  });

  describe('cleanup', () => {
    it('should clean up when isActive changes to false', () => {
      const { rerender } = render(
        <TypewriterPhrases
          isActive={true}
          phrases={testPhrases}
          charDelay={10}
        />
      );

      // Start typing
      act(() => {
        jest.advanceTimersByTime(50);
      });

      // Deactivate
      rerender(
        <TypewriterPhrases
          isActive={false}
          phrases={testPhrases}
          charDelay={10}
        />
      );

      // Wait for cleanup
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Component should not render
      expect(screen.queryByTestId('typewriter-phrases')).not.toBeInTheDocument();
    });

    it('should clean up on unmount', () => {
      const { unmount } = render(
        <TypewriterPhrases
          isActive={true}
          phrases={testPhrases}
          charDelay={10}
        />
      );

      // Start typing
      act(() => {
        jest.advanceTimersByTime(50);
      });

      // Unmount should not throw
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('infinite cycling', () => {
    it('should continue cycling through phrases indefinitely', () => {
      render(
        <TypewriterPhrases
          isActive={true}
          phrases={['A', 'B']}
          charDelay={10}
          displayDuration={50}
        />
      );

      // Advance through multiple cycles
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Should still be active
      expect(screen.getByTestId('typewriter-phrases')).toBeInTheDocument();
    });
  });
});
