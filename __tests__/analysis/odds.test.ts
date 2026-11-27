import { fetchOddsData } from "@/lib/analysis/odds";

jest.mock("@/lib/analysis/cache", () => ({
  ONE_HOUR_MS: 3_600_000,
  getOrSetCache: jest.fn((_key: string, _ttl: number, loader: () => Promise<unknown>) => loader()),
}));

const event = {
  id: "1",
  commence_time: "2026-12-06T22:00:00Z",
  home_team: "Charles Oliveira",
  away_team: "Max Holloway",
  bookmakers: [
    {
      key: "a",
      title: "Book A",
      markets: [
        {
          key: "h2h",
          outcomes: [
            { name: "Charles Oliveira", price: 2.0 },
            { name: "Max Holloway", price: 1.8 },
          ],
        },
      ],
    },
    {
      key: "b",
      title: "Book B",
      markets: [
        {
          key: "h2h",
          outcomes: [
            { name: "Charles Oliveira", price: 2.2 },
            { name: "Max Holloway", price: 1.7 },
          ],
        },
      ],
    },
  ],
};

describe("fetchOddsData", () => {
  beforeEach(() => {
    process.env.ODDS_API_KEY = "test-key";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([event]),
    }) as unknown as typeof fetch;
  });

  it("finds the fight regardless of home/away order and orders fighters as requested", async () => {
    const data = await fetchOddsData("Max Holloway", "Charles Oliveira");

    expect(data?.fighters[0].fighter).toBe("Max Holloway");
    expect(data?.fighters[1].fighter).toBe("Charles Oliveira");
    expect(data?.bookmakerCount).toBe(2);
    expect(data?.fighters[0].bestDecimalOdds).toBe(1.8);
    expect(data?.fighters[0].averageDecimalOdds).toBe(1.75);
  });

  it("removes the bookmaker margin so implied probabilities sum to 100", async () => {
    const data = await fetchOddsData("Max Holloway", "Charles Oliveira");
    const total = (data?.fighters[0].impliedProbabilityPct ?? 0) + (data?.fighters[1].impliedProbabilityPct ?? 0);

    expect(total).toBeGreaterThan(99.8);
    expect(total).toBeLessThan(100.2);
    expect(data?.fighters[0].impliedProbabilityPct).toBeGreaterThan(50);
  });

  it("returns null when the fight is not on the board", async () => {
    expect(await fetchOddsData("Jon Jones", "Tom Aspinall")).toBeNull();
  });

  it("sends the API key and decimal format to the odds provider", async () => {
    await fetchOddsData("Max Holloway", "Charles Oliveira");

    const requested = String((global.fetch as jest.Mock).mock.calls[0][0]);
    expect(requested).toContain("apiKey=test-key");
    expect(requested).toContain("oddsFormat=decimal");
    expect(requested).toContain("mma_mixed_martial_arts");
  });
});
