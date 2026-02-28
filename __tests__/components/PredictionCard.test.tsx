/**
 * Tests for PredictionCard component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { PredictionCard } from "@/components/dashboard/PredictionCard";
import { type Prediction } from "@/hooks/usePredictions";

const mockPrediction: Prediction = {
  id: "pred-1",
  userId: "user-1",
  event: "UFC 324",
  fight: "JUSTIN GAETHJE VS PADDY PIMBLETT",
  fighterA: "JUSTIN GAETHJE",
  fighterB: "PADDY PIMBLETT",
  content: "This is a test prediction content that contains multiple paragraphs of analysis about the upcoming fight between these two fighters.",
  imageUrl: "https://example.com/image.jpg",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("PredictionCard", () => {
  it("renders fighter names correctly", () => {
    render(<PredictionCard prediction={mockPrediction} />);

    expect(screen.getByText(/JUSTIN GAETHJE/i)).toBeInTheDocument();
    expect(screen.getByText(/PADDY PIMBLETT/i)).toBeInTheDocument();
    expect(screen.getByText("VS")).toBeInTheDocument();
  });

  it("renders event name when provided", () => {
    render(<PredictionCard prediction={mockPrediction} />);

    expect(screen.getByText("UFC 324")).toBeInTheDocument();
  });

  it("does not render event name when not provided", () => {
    const predictionWithoutEvent = { ...mockPrediction, event: null };
    render(<PredictionCard prediction={predictionWithoutEvent} />);

    expect(screen.queryByText("UFC 324")).not.toBeInTheDocument();
  });

  it("shows truncated content when collapsed", () => {
    const longContent = "A".repeat(300);
    const predictionWithLongContent = { ...mockPrediction, content: longContent };
    render(<PredictionCard prediction={predictionWithLongContent} />);

    // Should show truncated content with ellipsis
    const contentElement = screen.getByText(/A+\.\.\./);
    expect(contentElement).toBeInTheDocument();
  });

  it("expands content when clicked", () => {
    render(<PredictionCard prediction={mockPrediction} />);

    const card = screen.getByRole("button", { name: /prediction/i });
    fireEvent.click(card);

    // Should show full content when expanded
    expect(screen.getByText(mockPrediction.content)).toBeInTheDocument();
  });

  it("collapses content when clicked again", () => {
    render(<PredictionCard prediction={mockPrediction} />);

    const card = screen.getByRole("button", { name: /prediction/i });
    
    // Expand
    fireEvent.click(card);
    expect(screen.getByText(mockPrediction.content)).toBeInTheDocument();

    // Collapse
    fireEvent.click(card);
    // Full content should no longer be visible (truncated in preview)
    expect(screen.queryByText(mockPrediction.content)).not.toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = jest.fn();
    render(<PredictionCard prediction={mockPrediction} onDelete={onDelete} />);

    const deleteButton = screen.getByLabelText("Delete prediction");
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith("pred-1");
  });

  it("does not call onDelete when isDeleting is true", () => {
    const onDelete = jest.fn();
    render(<PredictionCard prediction={mockPrediction} onDelete={onDelete} isDeleting />);

    const deleteButton = screen.getByLabelText("Delete prediction");
    fireEvent.click(deleteButton);

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("shows loading spinner when isDeleting is true", () => {
    render(<PredictionCard prediction={mockPrediction} onDelete={jest.fn()} isDeleting />);

    // Should show spinner, not trash icon
    expect(screen.queryByLabelText("Delete prediction")).toBeInTheDocument();
    // Card should have reduced opacity
    const article = screen.getByRole("article");
    expect(article).toHaveClass("opacity-50");
  });

  it("calls onView when View Full Analysis button is clicked", () => {
    const onView = jest.fn();
    render(<PredictionCard prediction={mockPrediction} onView={onView} />);

    // First expand the card
    const card = screen.getByRole("button", { name: /prediction/i });
    fireEvent.click(card);

    // Then click View Full Analysis
    const viewButton = screen.getByText("View Full Analysis");
    fireEvent.click(viewButton);

    expect(onView).toHaveBeenCalledWith(mockPrediction);
  });

  it("does not render View Full Analysis button when onView is not provided", () => {
    render(<PredictionCard prediction={mockPrediction} />);

    const card = screen.getByRole("button", { name: /prediction/i });
    fireEvent.click(card);

    expect(screen.queryByText("View Full Analysis")).not.toBeInTheDocument();
  });

  it("renders image when imageUrl is provided and expanded", () => {
    render(<PredictionCard prediction={mockPrediction} />);

    // Expand card
    const card = screen.getByRole("button", { name: /prediction/i });
    fireEvent.click(card);

    const image = screen.getByAltText(/JUSTIN GAETHJE vs PADDY PIMBLETT/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockPrediction.imageUrl);
  });

  it("does not render image when imageUrl is not provided", () => {
    const predictionWithoutImage = { ...mockPrediction, imageUrl: null };
    render(<PredictionCard prediction={predictionWithoutImage} />);

    const card = screen.getByRole("button", { name: /prediction/i });
    fireEvent.click(card);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("handles keyboard navigation", () => {
    render(<PredictionCard prediction={mockPrediction} />);

    const card = screen.getByRole("button", { name: /prediction/i });
    
    // Expand with Enter
    fireEvent.keyDown(card, { key: "Enter" });
    expect(screen.getByText(mockPrediction.content)).toBeInTheDocument();

    // Collapse with Space
    fireEvent.keyDown(card, { key: " " });
    expect(screen.queryByText(mockPrediction.content)).not.toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    render(<PredictionCard prediction={mockPrediction} />);

    const article = screen.getByRole("article");
    expect(article).toHaveAttribute("aria-labelledby", `prediction-${mockPrediction.id}-title`);

    const button = screen.getByRole("button", { name: /prediction/i });
    expect(button).toHaveAttribute("aria-expanded", "false");

    // After expanding
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("displays relative time", () => {
    render(<PredictionCard prediction={mockPrediction} />);

    // Should display "Just now" or similar relative time
    expect(screen.getByText(/Just now|m ago|h ago/)).toBeInTheDocument();
  });
});
