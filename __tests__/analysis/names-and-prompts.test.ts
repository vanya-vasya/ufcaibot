import { namesMatch, normalizeName } from "@/lib/analysis/names";
import { buildUserPrompt, NO_DATA_SENTENCE } from "@/lib/analysis/prompts";
import { ANALYSIS_PRODUCTS } from "@/lib/analysis/products";

describe("fighter name matching", () => {
  it("normalizes accents, case and punctuation", () => {
    expect(normalizeName("  Jiří   Procházka ")).toBe("jiri prochazka");
    expect(normalizeName("Sean O'Malley")).toBe("sean o malley");
  });

  it.each([
    ["Max Holloway", "max holloway", true],
    ["Alexandre Pantoja", "Pantoja", true],
    ["Jon Jones", "Jon Jones Jr.", true],
    ["Max Holloway", "Charles Oliveira", false],
    ["", "Max Holloway", false],
  ])("namesMatch(%s, %s) -> %s", (a, b, expected) => {
    expect(namesMatch(a, b)).toBe(expected);
  });
});

describe("prompt builder", () => {
  const input = {
    fighterA: "Max Holloway",
    fighterB: "Charles Oliveira",
    odds: null,
    stats: null,
    news: null,
  };

  it("builds a single-block prompt for each single product", () => {
    const prompt = buildUserPrompt("stats", ANALYSIS_PRODUCTS.stats.sections, input);

    expect(prompt).toContain("Block 2: Fighters Data");
    expect(prompt).not.toContain("Block 1: Odds Data");
    expect(prompt).not.toContain("Block 3: Sentiment Analysis");
    expect(prompt).toContain("Produce exactly 1 block");
  });

  it("builds a three-block prompt for ultimate in block order", () => {
    const prompt = buildUserPrompt("ultimate", ANALYSIS_PRODUCTS.ultimate.sections, input);
    const first = prompt.lastIndexOf("Block 1: Odds Data");
    const second = prompt.lastIndexOf("Block 2: Fighters Data");
    const third = prompt.lastIndexOf("Block 3: Sentiment Analysis");

    expect(first).toBeGreaterThan(-1);
    expect(second).toBeGreaterThan(first);
    expect(third).toBeGreaterThan(second);
    expect(prompt).toContain("Produce exactly 3 blocks");
  });

  it("marks missing data sets and tells the model what to write", () => {
    const prompt = buildUserPrompt("odds", ANALYSIS_PRODUCTS.odds.sections, input);

    expect(prompt).toContain("NO DATA AVAILABLE");
    expect(prompt).toContain(NO_DATA_SENTENCE);
  });

  it("embeds the supplied data as JSON", () => {
    const prompt = buildUserPrompt("news", ANALYSIS_PRODUCTS.news.sections, {
      ...input,
      news: { articles: [{ title: "Holloway eyes title", source: "ESPN", publishedAt: "2026-11-20", description: "" }] },
    });

    expect(prompt).toContain("Holloway eyes title");
    expect(prompt).not.toContain("News Articles (feeds Block 3): NO DATA AVAILABLE");
  });
});
