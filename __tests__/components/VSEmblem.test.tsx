import { render, screen, fireEvent } from "@testing-library/react";
import { VSEmblem } from "@/components/dashboard/VSEmblem";

describe("VSEmblem", () => {
  it("renders the FIGHT button", () => {
    render(<VSEmblem />);
    
    const emblem = screen.getByTestId("vs-emblem");
    expect(emblem).toBeInTheDocument();
    expect(screen.getByText("FIGHT")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    render(<VSEmblem className="custom-class" />);
    
    const emblem = screen.getByTestId("vs-emblem");
    expect(emblem).toHaveClass("custom-class");
  });

  it("renders as a button element", () => {
    render(<VSEmblem />);
    
    const emblem = screen.getByTestId("vs-emblem");
    expect(emblem.tagName).toBe("BUTTON");
    expect(emblem).toHaveAttribute("type", "button");
  });

  it("has proper accessibility attributes", () => {
    render(<VSEmblem />);
    
    const button = screen.getByTestId("vs-emblem");
    expect(button).toHaveAttribute("aria-label", "Start fight analysis");
  });

  it("calls onClick handler when clicked", () => {
    const mockOnClick = jest.fn();
    render(<VSEmblem onClick={mockOnClick} />);
    
    const button = screen.getByTestId("vs-emblem");
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("contains FIGHT text with animation classes", () => {
    render(<VSEmblem />);
    
    const fightText = screen.getByText("FIGHT");
    expect(fightText).toHaveClass("fight-button-text");
  });
});

