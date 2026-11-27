import { americanToDecimal, fetchTableOdds } from "@/lib/analysis/odds-table";

const mockFindMany = jest.fn();

jest.mock("@/lib/prismadb", () => ({
  __esModule: true,
  default: { fightOdds: { findMany: (...args: unknown[]) => mockFindMany(...args) } },
}));

const row = {
  eventName: "MMA FIGHT NIGHT: ADESANYA VS MAGOMEDOV",
  fighterA: "Israel Adesanya",
  fighterB: "Shara Magomedov",
  oddsA: -170,
  oddsB: 140,
  source: "ufc.com",
};

describe("americanToDecimal", () => {
  it("converts favourites and underdogs", () => {
    expect(americanToDecimal(-200)).toBeCloseTo(1.5);
    expect(americanToDecimal(150)).toBeCloseTo(2.5);
  });
});

describe("fetchTableOdds", () => {
  beforeEach(() => mockFindMany.mockReset().mockResolvedValue([row]));

  it("returns odds in the requested fighter order with margin-free probabilities", async () => {
    const data = await fetchTableOdds("Shara Magomedov", "Israel Adesanya");

    expect(data?.source).toBe("odds-table");
    expect(data?.fighters[0].fighter).toBe("Shara Magomedov");
    expect(data?.fighters[0].americanOdds).toBe(140);
    expect(data?.fighters[1].americanOdds).toBe(-170);
    expect(data?.fighters[1].impliedProbabilityPct).toBeGreaterThan(50);
    const total = (data?.fighters[0].impliedProbabilityPct ?? 0) + (data?.fighters[1].impliedProbabilityPct ?? 0);
    expect(total).toBeGreaterThan(99.8);
    expect(total).toBeLessThan(100.2);
    expect(data?.bookmakerCount).toBe(1);
    expect(data?.eventName).toBe(row.eventName);
  });

  it("matches names regardless of accents and case", async () => {
    mockFindMany.mockResolvedValue([{ ...row, fighterA: "Jiří Procházka", fighterB: "Navajo Stirling" }]);

    const data = await fetchTableOdds("JIRI PROCHAZKA", "navajo stirling");

    expect(data?.fighters[0].fighter).toBe("Jiří Procházka");
  });

  it("returns null when no candidate is the requested fight", async () => {
    expect(await fetchTableOdds("Jon Jones", "Tom Aspinall")).toBeNull();
    mockFindMany.mockResolvedValue([]);
    expect(await fetchTableOdds("Israel Adesanya", "Shara Magomedov")).toBeNull();
  });
});
