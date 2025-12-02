/**
 * Unit tests for TwitterSlider component
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TwitterSlider from "@/components/landing/twitter-slider";
import { Tweet, sampleTweets } from "@/lib/twitter";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe("TwitterSlider Component", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<TwitterSlider />);
      expect(screen.getByRole("region")).toBeInTheDocument();
    });

    it("should have correct aria-label", () => {
      render(<TwitterSlider />);
      expect(screen.getByLabelText("Latest UFC tweets")).toBeInTheDocument();
    });

    it("should render with custom tweets", () => {
      const customTweets: Tweet[] = [
        {
          id: "custom-1",
          author: { username: "testuser", name: "Test User" },
          text: "Custom test tweet content",
          timestamp: new Date(),
          link: "https://x.com/testuser/status/custom-1",
        },
      ];

      render(<TwitterSlider tweets={customTweets} />);
      expect(screen.getByText("Custom test tweet content")).toBeInTheDocument();
    });

    it("should render X (Twitter) logo", () => {
      render(<TwitterSlider />);
      expect(screen.getByLabelText("X (Twitter)")).toBeInTheDocument();
    });

    it("should render UFC label", () => {
      render(<TwitterSlider />);
      expect(screen.getByText("UFC")).toBeInTheDocument();
    });
  });

  describe("Tweet Items", () => {
    it("should render tweet author usernames", () => {
      render(<TwitterSlider tweets={sampleTweets.slice(0, 1)} />);
      // Check for @ufc (doubled because of infinite scroll duplication)
      const usernames = screen.getAllByText("@ufc");
      expect(usernames.length).toBeGreaterThan(0);
    });

    it("should render tweet links", () => {
      const testTweet: Tweet = {
        id: "link-test",
        author: { username: "ufc", name: "UFC" },
        text: "Link test tweet",
        timestamp: new Date(),
        link: "https://x.com/ufc/status/link-test",
      };

      render(<TwitterSlider tweets={[testTweet]} />);
      
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveAttribute("href", "https://x.com/ufc/status/link-test");
    });

    it("should open links in new tab", () => {
      render(<TwitterSlider tweets={sampleTweets.slice(0, 1)} />);
      
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("should truncate long tweet text", () => {
      const longTweet: Tweet = {
        id: "long-1",
        author: { username: "ufc", name: "UFC" },
        text: "A".repeat(150), // Very long text
        timestamp: new Date(),
        link: "https://x.com/ufc/status/long-1",
      };

      render(<TwitterSlider tweets={[longTweet]} />);
      
      // Should truncate to 117 chars + "..."
      const truncatedText = "A".repeat(117) + "...";
      expect(screen.getByText(truncatedText)).toBeInTheDocument();
    });

    it("should not truncate short tweet text", () => {
      const shortTweet: Tweet = {
        id: "short-1",
        author: { username: "ufc", name: "UFC" },
        text: "Short tweet",
        timestamp: new Date(),
        link: "https://x.com/ufc/status/short-1",
      };

      render(<TwitterSlider tweets={[shortTweet]} />);
      expect(screen.getByText("Short tweet")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper region role", () => {
      render(<TwitterSlider />);
      expect(screen.getByRole("region")).toBeInTheDocument();
    });

    it("should have proper list role for tweets", () => {
      render(<TwitterSlider />);
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should have proper listitem role for each tweet", () => {
      render(<TwitterSlider tweets={sampleTweets.slice(0, 2)} />);
      
      // Each tweet is duplicated for infinite scroll
      const items = screen.getAllByRole("listitem");
      expect(items.length).toBe(4); // 2 tweets × 2 (duplicated)
    });

    it("should have aria-label on tweet items", () => {
      const testTweet: Tweet = {
        id: "aria-test",
        author: { username: "ufc", name: "UFC" },
        text: "Accessibility test tweet",
        timestamp: new Date(),
        link: "https://x.com/ufc/status/aria-test",
      };

      render(<TwitterSlider tweets={[testTweet]} />);
      
      const items = screen.getAllByRole("listitem");
      items.forEach((item) => {
        expect(item).toHaveAttribute("aria-label");
      });
    });

    it("should be keyboard accessible", () => {
      render(<TwitterSlider tweets={sampleTweets.slice(0, 1)} />);
      
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("tabIndex", "0");
      });
    });
  });

  describe("Default Props", () => {
    it("should use sampleTweets when no tweets prop is provided", () => {
      render(<TwitterSlider />);
      
      // Check that sample tweets are rendered (they're duplicated for infinite scroll)
      // Look for content from first sample tweet
      const firstSampleText = sampleTweets[0].text.substring(0, 50);
      expect(screen.getByText((content) => content.includes("FIGHT WEEK"))).toBeInTheDocument();
    });
  });

  describe("Infinite Scroll Duplication", () => {
    it("should duplicate tweets for seamless scrolling", () => {
      const singleTweet: Tweet = {
        id: "dup-test",
        author: { username: "ufc", name: "UFC" },
        text: "Duplication test tweet",
        timestamp: new Date(),
        link: "https://x.com/ufc/status/dup-test",
      };

      render(<TwitterSlider tweets={[singleTweet]} />);
      
      // Should find the tweet text twice (original + duplicate)
      const texts = screen.getAllByText("Duplication test tweet");
      expect(texts).toHaveLength(2);
    });
  });
});

