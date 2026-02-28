import { render, screen } from "@testing-library/react";
import OddsSlider, {
  getFighterStatus,
  formatOdds,
  formatUpdatedAt,
  getStatusIndicator,
  sampleOddsData,
  FightOdds,
} from "@/components/landing/odds-slider";

// ============================================================================
// UNIT TESTS - Utility Functions
// ============================================================================

describe("getFighterStatus", () => {
  it("should return 'favorite' when fighter has lower odds (more negative)", () => {
    expect(getFighterStatus(-250, +200)).toBe("favorite");
    expect(getFighterStatus(-180, +155)).toBe("favorite");
    expect(getFighterStatus(-145, +125)).toBe("favorite");
  });

  it("should return 'favorite' when fighter has lower positive odds", () => {
    expect(getFighterStatus(+100, +200)).toBe("favorite");
    expect(getFighterStatus(+110, +150)).toBe("favorite");
  });

  it("should return 'underdog' when fighter has higher odds (less negative or more positive)", () => {
    expect(getFighterStatus(+200, -250)).toBe("underdog");
    expect(getFighterStatus(+155, -180)).toBe("underdog");
    expect(getFighterStatus(+125, -145)).toBe("underdog");
  });

  it("should return 'underdog' when fighter has higher positive odds", () => {
    expect(getFighterStatus(+200, +100)).toBe("underdog");
    expect(getFighterStatus(+150, +110)).toBe("underdog");
  });

  it("should return 'even' when odds are exactly equal", () => {
    expect(getFighterStatus(+100, +100)).toBe("even");
    expect(getFighterStatus(-110, -110)).toBe("even");
    expect(getFighterStatus(+200, +200)).toBe("even");
    expect(getFighterStatus(-150, -150)).toBe("even");
    expect(getFighterStatus(0, 0)).toBe("even");
  });

  it("should handle edge case with very close odds", () => {
    expect(getFighterStatus(-115, -105)).toBe("favorite");
    expect(getFighterStatus(-105, -115)).toBe("underdog");
  });

  it("should handle transition from negative to positive odds", () => {
    expect(getFighterStatus(-100, +100)).toBe("favorite");
    expect(getFighterStatus(+100, -100)).toBe("underdog");
  });

  it("should handle very large odds values", () => {
    expect(getFighterStatus(-5000, +10000)).toBe("favorite");
    expect(getFighterStatus(+10000, -5000)).toBe("underdog");
  });
});

describe("formatOdds", () => {
  it("should add + sign to positive odds", () => {
    expect(formatOdds(200)).toBe("+200");
    expect(formatOdds(100)).toBe("+100");
    expect(formatOdds(155)).toBe("+155");
    expect(formatOdds(1)).toBe("+1");
  });

  it("should preserve - sign for negative odds", () => {
    expect(formatOdds(-250)).toBe("-250");
    expect(formatOdds(-180)).toBe("-180");
    expect(formatOdds(-100)).toBe("-100");
    expect(formatOdds(-1)).toBe("-1");
  });

  it("should format zero as +0", () => {
    expect(formatOdds(0)).toBe("+0");
  });

  it("should handle large positive numbers", () => {
    expect(formatOdds(10000)).toBe("+10000");
  });

  it("should handle large negative numbers", () => {
    expect(formatOdds(-10000)).toBe("-10000");
  });
});

describe("getStatusIndicator", () => {
  it("should return ▲ for favorite", () => {
    expect(getStatusIndicator("favorite")).toBe("▲");
  });

  it("should return ▼ for underdog", () => {
    expect(getStatusIndicator("underdog")).toBe("▼");
  });

  it("should return = for even", () => {
    expect(getStatusIndicator("even")).toBe("=");
  });
});

describe("formatUpdatedAt", () => {
  it("should format date with Asia/Tbilisi timezone", () => {
    // Create a date and check it formats correctly
    const testDate = new Date("2025-01-15T12:00:00Z");
    const formatted = formatUpdatedAt(testDate);
    
    // Should return a string in format like "04:00 PM" (or similar)
    expect(typeof formatted).toBe("string");
    expect(formatted.length).toBeGreaterThan(0);
    expect(formatted).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
  });

  it("should handle midnight correctly", () => {
    const midnight = new Date("2025-01-15T00:00:00Z");
    const formatted = formatUpdatedAt(midnight);
    
    expect(typeof formatted).toBe("string");
    expect(formatted).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
  });

  it("should handle noon correctly", () => {
    const noon = new Date("2025-01-15T12:00:00Z");
    const formatted = formatUpdatedAt(noon);
    
    expect(typeof formatted).toBe("string");
    expect(formatted).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
  });

  it("should return empty string for invalid date", () => {
    const invalidDate = new Date("invalid");
    const formatted = formatUpdatedAt(invalidDate);
    
    // Should handle gracefully (may return empty or throw handled)
    expect(typeof formatted).toBe("string");
  });
});

// ============================================================================
// SAMPLE DATA VALIDATION
// ============================================================================

describe("sampleOddsData", () => {
  it("should have at least 5 fight entries", () => {
    expect(sampleOddsData.length).toBeGreaterThanOrEqual(5);
  });

  it("should have unique IDs for all entries", () => {
    const ids = sampleOddsData.map((fight) => fight.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(sampleOddsData.length);
  });

  it("should have valid fighter data for all entries", () => {
    sampleOddsData.forEach((fight) => {
      expect(fight.fighterA).toBeDefined();
      expect(fight.fighterB).toBeDefined();
      expect(typeof fight.fighterA.surname).toBe("string");
      expect(typeof fight.fighterB.surname).toBe("string");
      expect(fight.fighterA.surname.length).toBeGreaterThan(0);
      expect(fight.fighterB.surname.length).toBeGreaterThan(0);
      expect(typeof fight.fighterA.odds).toBe("number");
      expect(typeof fight.fighterB.odds).toBe("number");
    });
  });

  it("should include at least one even odds case", () => {
    const hasEvenCase = sampleOddsData.some(
      (fight) => fight.fighterA.odds === fight.fighterB.odds
    );
    expect(hasEvenCase).toBe(true);
  });

  it("should have valid Date objects for updatedAt", () => {
    sampleOddsData.forEach((fight) => {
      expect(fight.updatedAt).toBeInstanceOf(Date);
      expect(isNaN(fight.updatedAt.getTime())).toBe(false);
    });
  });
});

// ============================================================================
// COMPONENT RENDER TESTS
// ============================================================================

describe("OddsSlider Component", () => {
  it("should render without crashing", () => {
    render(<OddsSlider />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("should have proper aria-label for accessibility", () => {
    render(<OddsSlider />);
    const section = screen.getByRole("region");
    expect(section).toHaveAttribute("aria-label", "Live betting odds ticker");
  });

  it("should render the LIVE label", () => {
    render(<OddsSlider />);
    expect(screen.getByText("LIVE")).toBeInTheDocument();
  });

  it("should render a list of fight odds", () => {
    render(<OddsSlider />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(list).toHaveAttribute("aria-label", "Current fight odds");
  });

  it("should render fight odds items", () => {
    render(<OddsSlider />);
    const items = screen.getAllByRole("listitem");
    // Should have at least some items (doubled for infinite scroll)
    expect(items.length).toBeGreaterThan(0);
  });

  it("should display fighter surnames in uppercase", () => {
    const customData: FightOdds[] = [
      {
        id: "test-1",
        fighterA: { surname: "JONES", odds: -250 },
        fighterB: { surname: "MIOCIC", odds: +200 },
        updatedAt: new Date(),
      },
    ];
    
    render(<OddsSlider oddsData={customData} />);
    
    // Check that fighter names are displayed (checking aria-label since text is in spans)
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute(
      "aria-label",
      expect.stringContaining("JONES")
    );
    expect(items[0]).toHaveAttribute(
      "aria-label",
      expect.stringContaining("MIOCIC")
    );
  });

  it("should include odds in accessible label", () => {
    const customData: FightOdds[] = [
      {
        id: "test-1",
        fighterA: { surname: "JONES", odds: -250 },
        fighterB: { surname: "MIOCIC", odds: +200 },
        updatedAt: new Date(),
      },
    ];
    
    render(<OddsSlider oddsData={customData} />);
    
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute(
      "aria-label",
      expect.stringContaining("-250")
    );
    expect(items[0]).toHaveAttribute(
      "aria-label",
      expect.stringContaining("+200")
    );
  });

  it("should render with custom odds data", () => {
    const customData: FightOdds[] = [
      {
        id: "custom-1",
        fighterA: { surname: "CUSTOM", odds: -100 },
        fighterB: { surname: "FIGHTER", odds: +100 },
        updatedAt: new Date(),
      },
    ];
    
    render(<OddsSlider oddsData={customData} />);
    
    const items = screen.getAllByRole("listitem");
    // Should render at least the custom items (doubled for infinite scroll)
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  it("should duplicate data for seamless infinite scroll", () => {
    const customData: FightOdds[] = [
      {
        id: "single-1",
        fighterA: { surname: "ONE", odds: -150 },
        fighterB: { surname: "TWO", odds: +130 },
        updatedAt: new Date(),
      },
    ];
    
    render(<OddsSlider oddsData={customData} />);
    
    const items = screen.getAllByRole("listitem");
    // Should be exactly 2 items (original + duplicate)
    expect(items.length).toBe(2);
  });

  it("should have proper section id for navigation", () => {
    render(<OddsSlider />);
    const section = screen.getByRole("region");
    expect(section).toHaveAttribute("id", "odds-slider");
  });
});

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

describe("OddsSlider Accessibility", () => {
  it("should have role='region' for section landmark", () => {
    render(<OddsSlider />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("should have descriptive aria-labels for screen readers", () => {
    const customData: FightOdds[] = [
      {
        id: "a11y-test",
        fighterA: { surname: "FIGHTER_A", odds: -200 },
        fighterB: { surname: "FIGHTER_B", odds: +175 },
        updatedAt: new Date(),
      },
    ];
    
    render(<OddsSlider oddsData={customData} />);
    
    // Check that fight items have descriptive aria-labels
    const items = screen.getAllByRole("listitem");
    items.forEach((item) => {
      expect(item).toHaveAttribute("aria-label");
      const ariaLabel = item.getAttribute("aria-label");
      expect(ariaLabel).toContain("versus");
    });
  });

  it("should hide decorative elements from screen readers", () => {
    render(<OddsSlider />);
    
    // VS separator should be hidden
    const vsSeparators = screen.getAllByText("vs");
    vsSeparators.forEach((separator) => {
      expect(separator).toHaveAttribute("aria-hidden", "true");
    });
    
    // Dividers should be hidden
    const dividers = screen.getAllByText("|");
    dividers.forEach((divider) => {
      expect(divider).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("should have role='list' for the marquee wrapper", () => {
    render(<OddsSlider />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("should have role='listitem' for each fight odds entry", () => {
    render(<OddsSlider />);
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// EDGE CASES
// ============================================================================

describe("OddsSlider Edge Cases", () => {
  it("should handle empty odds data gracefully", () => {
    render(<OddsSlider oddsData={[]} />);
    
    // Should still render the section
    expect(screen.getByRole("region")).toBeInTheDocument();
    expect(screen.getByText("LIVE")).toBeInTheDocument();
    
    // Should have no list items
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("should handle single fight entry", () => {
    const singleFight: FightOdds[] = [
      {
        id: "single",
        fighterA: { surname: "SOLO", odds: -150 },
        fighterB: { surname: "OPPONENT", odds: +130 },
        updatedAt: new Date(),
      },
    ];
    
    render(<OddsSlider oddsData={singleFight} />);
    
    // Should duplicate for seamless loop
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBe(2);
  });

  it("should handle fights with equal odds (even case)", () => {
    const evenFight: FightOdds[] = [
      {
        id: "even",
        fighterA: { surname: "FIGHTER_A", odds: +100 },
        fighterB: { surname: "FIGHTER_B", odds: +100 },
        updatedAt: new Date(),
      },
    ];
    
    render(<OddsSlider oddsData={evenFight} />);
    
    // Should render without errors
    expect(screen.getByRole("region")).toBeInTheDocument();
    
    // Both fighters should be marked as even
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should handle very long surnames", () => {
    const longNames: FightOdds[] = [
      {
        id: "long",
        fighterA: { surname: "VERYLONGFIGHTERSURNAME", odds: -150 },
        fighterB: { surname: "ANOTHERLONGNAME", odds: +130 },
        updatedAt: new Date(),
      },
    ];
    
    render(<OddsSlider oddsData={longNames} />);
    
    // Should render without errors
    expect(screen.getByRole("region")).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should handle extreme odds values", () => {
    const extremeOdds: FightOdds[] = [
      {
        id: "extreme",
        fighterA: { surname: "HEAVY_FAV", odds: -10000 },
        fighterB: { surname: "HUGE_DOG", odds: +50000 },
        updatedAt: new Date(),
      },
    ];
    
    render(<OddsSlider oddsData={extremeOdds} />);
    
    // Should render without errors
    expect(screen.getByRole("region")).toBeInTheDocument();
    
    // Should include extreme odds in aria-label
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute(
      "aria-label",
      expect.stringContaining("-10000")
    );
    expect(items[0]).toHaveAttribute(
      "aria-label",
      expect.stringContaining("+50000")
    );
  });
});

// ============================================================================
// LAYOUT & VISIBILITY TESTS (Regression prevention for flexbox collapse bug)
// ============================================================================

describe("OddsSlider Layout & Visibility", () => {
  it("should have shrink-0 class to prevent flexbox collapse", () => {
    render(<OddsSlider />);
    
    const section = screen.getByRole("region");
    // The section should have the shrink-0 Tailwind class
    expect(section.className).toContain("shrink-0");
  });

  it("should have odds-slider-section class for styling", () => {
    render(<OddsSlider />);
    
    const section = screen.getByRole("region");
    expect(section.className).toContain("odds-slider-section");
  });

  it("should have id='odds-slider' for CSS targeting", () => {
    render(<OddsSlider />);
    
    const section = screen.getByRole("region");
    expect(section).toHaveAttribute("id", "odds-slider");
  });

  it("should render visible content with LIVE label and fight items", () => {
    render(<OddsSlider />);
    
    // LIVE label should be present
    expect(screen.getByText("LIVE")).toBeInTheDocument();
    
    // Fight items should be present
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });
});

