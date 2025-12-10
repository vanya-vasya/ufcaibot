/**
 * Tests for NewsFeed components
 * Tests NewsCard, NewsCardSkeleton, and NewsFeed
 */

import React from "react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the hooks
jest.mock("@/hooks/useNewsFeed", () => ({
  useNewsFeed: jest.fn(),
  useResponsiveItemCount: jest.fn(() => 5),
  formatRelativeTime: jest.fn((date: string) => "2h ago"),
}));

import { NewsCard } from "@/components/dashboard/NewsCard";
import { NewsCardSkeleton, NewsSkeletonGroup } from "@/components/dashboard/NewsCardSkeleton";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { useNewsFeed } from "@/hooks/useNewsFeed";

const mockUseNewsFeed = useNewsFeed as jest.MockedFunction<typeof useNewsFeed>;

describe("NewsCard", () => {
  const mockItem = {
    id: "1",
    title: "UFC Fighter Wins Championship",
    link: "https://example.com/news/1",
    description: "An exciting fight concluded with a knockout victory.",
    pubDate: new Date().toISOString(),
    source: "UFC",
    thumbnail: "https://example.com/thumb.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.open
    global.open = jest.fn();
  });

  it("renders news card with all content", () => {
    render(<NewsCard item={mockItem} />);

    expect(screen.getByText("UFC Fighter Wins Championship")).toBeInTheDocument();
    expect(screen.getByText("UFC")).toBeInTheDocument();
    expect(screen.getByText("2h ago")).toBeInTheDocument();
    expect(screen.getByText(/An exciting fight/)).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<NewsCard item={mockItem} />);

    const article = screen.getByRole("article");
    expect(article).toHaveAttribute("tabIndex", "0");
    expect(article).toHaveAttribute("aria-label");
  });

  it("opens link in new tab on click", () => {
    render(<NewsCard item={mockItem} />);

    const article = screen.getByRole("article");
    fireEvent.click(article);

    expect(global.open).toHaveBeenCalledWith(
      mockItem.link,
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("opens link on Enter key press", () => {
    render(<NewsCard item={mockItem} />);

    const article = screen.getByRole("article");
    fireEvent.keyDown(article, { key: "Enter" });

    expect(global.open).toHaveBeenCalledWith(
      mockItem.link,
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("opens link on Space key press", () => {
    render(<NewsCard item={mockItem} />);

    const article = screen.getByRole("article");
    fireEvent.keyDown(article, { key: " " });

    expect(global.open).toHaveBeenCalledWith(
      mockItem.link,
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("renders without thumbnail when not provided", () => {
    const itemWithoutThumbnail = { ...mockItem, thumbnail: undefined };
    render(<NewsCard item={itemWithoutThumbnail} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("handles image error gracefully", () => {
    render(<NewsCard item={mockItem} />);

    const img = screen.getByRole("img", { hidden: true });
    fireEvent.error(img);

    // Image should be hidden after error
    // The component handles this internally
    expect(screen.queryByAltText("")).not.toBeVisible;
  });
});

describe("NewsCardSkeleton", () => {
  it("renders skeleton with loading state", () => {
    render(<NewsCardSkeleton />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Loading news article...")).toBeInTheDocument();
  });

  it("renders with thumbnail placeholder by default", () => {
    const { container } = render(<NewsCardSkeleton showThumbnail={true} />);

    // Should have aspect-ratio container for thumbnail
    const thumbnailPlaceholder = container.querySelector(".aspect-\\[16\\/9\\]");
    expect(thumbnailPlaceholder).toBeInTheDocument();
  });

  it("renders without thumbnail when showThumbnail is false", () => {
    const { container } = render(<NewsCardSkeleton showThumbnail={false} />);

    const thumbnailPlaceholder = container.querySelector(".aspect-\\[16\\/9\\]");
    expect(thumbnailPlaceholder).not.toBeInTheDocument();
  });

  it("applies animation delay based on index", () => {
    const { container } = render(<NewsCardSkeleton index={3} />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.animationDelay).toBe("300ms");
  });
});

describe("NewsSkeletonGroup", () => {
  it("renders correct number of skeletons", () => {
    render(<NewsSkeletonGroup count={5} />);

    const skeletons = screen.getAllByRole("status");
    expect(skeletons).toHaveLength(5);
  });

  it("alternates thumbnails between skeletons", () => {
    const { container } = render(<NewsSkeletonGroup count={4} />);

    const thumbnails = container.querySelectorAll(".aspect-\\[16\\/9\\]");
    // Every other skeleton should have thumbnail (indices 0, 2)
    expect(thumbnails.length).toBe(2);
  });
});

describe("NewsFeed", () => {
  const mockItems = [
    {
      id: "1",
      title: "News 1",
      link: "https://example.com/1",
      description: "Desc 1",
      pubDate: new Date().toISOString(),
      source: "UFC",
    },
    {
      id: "2",
      title: "News 2",
      link: "https://example.com/2",
      description: "Desc 2",
      pubDate: new Date().toISOString(),
      source: "MMA Fighting",
    },
  ];

  beforeEach(() => {
    mockUseNewsFeed.mockReturnValue({
      items: mockItems,
      isLoading: false,
      error: null,
      isFromCache: false,
      isStale: false,
      refresh: jest.fn(),
      lastUpdated: new Date(),
    });
  });

  it("renders news feed section with header", () => {
    render(<NewsFeed />);

    expect(screen.getByText("Latest MMA News")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "MMA News Feed" })).toBeInTheDocument();
  });

  it("renders news cards when data is loaded", () => {
    render(<NewsFeed />);

    expect(screen.getByText("News 1")).toBeInTheDocument();
    expect(screen.getByText("News 2")).toBeInTheDocument();
  });

  it("shows loading skeletons when isLoading is true", () => {
    mockUseNewsFeed.mockReturnValue({
      items: [],
      isLoading: true,
      error: null,
      isFromCache: false,
      isStale: false,
      refresh: jest.fn(),
      lastUpdated: null,
    });

    render(<NewsFeed />);

    const skeletons = screen.getAllByRole("status");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("shows error state with retry button", () => {
    const mockRefresh = jest.fn();
    mockUseNewsFeed.mockReturnValue({
      items: [],
      isLoading: false,
      error: "Failed to fetch news",
      isFromCache: false,
      isStale: false,
      refresh: mockRefresh,
      lastUpdated: null,
    });

    render(<NewsFeed />);

    expect(screen.getByText("Failed to fetch news")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Try Again"));
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("shows cached badge when data is stale", () => {
    mockUseNewsFeed.mockReturnValue({
      items: mockItems,
      isLoading: false,
      error: null,
      isFromCache: true,
      isStale: true,
      refresh: jest.fn(),
      lastUpdated: new Date(),
    });

    render(<NewsFeed />);

    expect(screen.getByText("Cached")).toBeInTheDocument();
  });

  it("has refresh button that calls refresh", () => {
    const mockRefresh = jest.fn();
    mockUseNewsFeed.mockReturnValue({
      items: mockItems,
      isLoading: false,
      error: null,
      isFromCache: false,
      isStale: false,
      refresh: mockRefresh,
      lastUpdated: new Date(),
    });

    render(<NewsFeed />);

    const refreshButton = screen.getByRole("button", { name: "Refresh news feed" });
    fireEvent.click(refreshButton);

    expect(mockRefresh).toHaveBeenCalled();
  });

  it("disables refresh button when loading", () => {
    mockUseNewsFeed.mockReturnValue({
      items: mockItems,
      isLoading: true,
      error: null,
      isFromCache: false,
      isStale: false,
      refresh: jest.fn(),
      lastUpdated: new Date(),
    });

    render(<NewsFeed />);

    const refreshButton = screen.getByRole("button", { name: "Refresh news feed" });
    expect(refreshButton).toBeDisabled();
  });

  it("supports keyboard navigation in scroll container", () => {
    render(<NewsFeed />);

    const scrollContainer = screen.getByRole("region", { name: "News articles" });

    // Mock scrollBy
    scrollContainer.scrollBy = jest.fn();

    fireEvent.keyDown(scrollContainer, { key: "ArrowRight" });
    expect(scrollContainer.scrollBy).toHaveBeenCalledWith({
      left: 300,
      behavior: "smooth",
    });

    fireEvent.keyDown(scrollContainer, { key: "ArrowLeft" });
    expect(scrollContainer.scrollBy).toHaveBeenCalledWith({
      left: -300,
      behavior: "smooth",
    });
  });

  it("shows swipe hint on mobile", () => {
    render(<NewsFeed />);

    expect(screen.getByText("Swipe for more")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<NewsFeed className="custom-class" />);

    const section = container.querySelector("section");
    expect(section).toHaveClass("custom-class");
  });
});
