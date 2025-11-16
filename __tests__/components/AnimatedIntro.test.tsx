import { render, screen, waitFor } from "@testing-library/react";
import { AnimatedIntro } from "@/components/dashboard/AnimatedIntro";

describe("AnimatedIntro", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders the animated intro with default text", () => {
    const mockOnComplete = jest.fn();
    render(<AnimatedIntro onComplete={mockOnComplete} />);
    
    const intro = screen.getByTestId("animated-intro");
    expect(intro).toBeInTheDocument();
    expect(screen.getByText("AI ENGINE FOR FIGHTERS")).toBeInTheDocument();
  });

  it("renders custom text when provided", () => {
    const mockOnComplete = jest.fn();
    render(<AnimatedIntro onComplete={mockOnComplete} text="CUSTOM TEXT" />);
    
    expect(screen.getByText("CUSTOM TEXT")).toBeInTheDocument();
  });

  it("calls onComplete callback after animation duration", () => {
    const mockOnComplete = jest.fn();
    render(<AnimatedIntro onComplete={mockOnComplete} duration={3200} />);
    
    expect(mockOnComplete).not.toHaveBeenCalled();
    
    // Fast-forward time
    jest.advanceTimersByTime(3300);
    
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it("unmounts after animation completes", async () => {
    const mockOnComplete = jest.fn();
    const { container } = render(<AnimatedIntro onComplete={mockOnComplete} duration={3200} />);
    
    expect(screen.getByTestId("animated-intro")).toBeInTheDocument();
    
    // Fast-forward time
    jest.advanceTimersByTime(3300);
    
    await waitFor(() => {
      expect(screen.queryByTestId("animated-intro")).not.toBeInTheDocument();
    });
  });

  it("starts animation after mount", () => {
    const mockOnComplete = jest.fn();
    render(<AnimatedIntro onComplete={mockOnComplete} />);
    
    const intro = screen.getByTestId("animated-intro");
    expect(intro).toBeInTheDocument();
    
    // Animation should start after 50ms
    jest.advanceTimersByTime(50);
    expect(intro).toBeInTheDocument();
  });

  it("respects custom duration prop", () => {
    const mockOnComplete = jest.fn();
    const customDuration = 600;
    render(<AnimatedIntro onComplete={mockOnComplete} duration={customDuration} />);
    
    jest.advanceTimersByTime(customDuration - 1);
    expect(mockOnComplete).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(100);
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });
});

