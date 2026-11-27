import {
  ACTIVITY_TOOLS,
  generateActivity,
  getSpendableTokens,
  pickTools,
} from "@/lib/admin-activity";
import { ANALYSIS_PRODUCTS } from "@/lib/analysis/products";

/** Small deterministic PRNG (mulberry32) so property checks are reproducible. */
const seededRandom = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const START = new Date(2026, 10, 1);
const END = new Date(2026, 10, 30);

describe("activity tools", () => {
  it("uses exactly the four analysis products with their real prices", () => {
    expect(ACTIVITY_TOOLS.map((tool) => [tool.label, tool.cost])).toEqual([
      ["ODDS", 10],
      ["STATS", 5],
      ["NEWS", 15],
      ["ULTIMATE", 25],
    ]);
    ACTIVITY_TOOLS.forEach((tool) => expect(tool.cost).toBe(ANALYSIS_PRODUCTS[tool.id].cost));
  });
});

describe("getSpendableTokens", () => {
  it("rounds down to a multiple of the cheapest tool", () => {
    expect(getSpendableTokens(1500)).toBe(1500);
    expect(getSpendableTokens(1503)).toBe(1500);
    expect(getSpendableTokens(7)).toBe(5);
    expect(getSpendableTokens(4)).toBe(0);
  });
});

describe("pickTools", () => {
  it("always adds up to exactly the spendable target", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const random = seededRandom(seed);
      const target = 5 + Math.floor(random() * 3000);
      const total = pickTools(target, random).reduce((sum, tool) => sum + tool.cost, 0);
      expect(total).toBe(getSpendableTokens(target));
    }
  });

  it("uses every tool over a large budget", () => {
    const labels = new Set(pickTools(5000, seededRandom(7)).map((tool) => tool.label));
    expect(Array.from(labels).sort()).toEqual(["NEWS", "ODDS", "STATS", "ULTIMATE"]);
  });

  it("returns nothing below the cheapest tool", () => {
    expect(pickTools(4)).toEqual([]);
  });
});

describe("generateActivity", () => {
  it.each([5, 10, 25, 100, 1500, 1503, 4999])(
    "spends exactly the target and keeps Total spent consistent (target %i)",
    (target) => {
      for (let seed = 1; seed <= 25; seed++) {
        const rows = generateActivity(target, START, END, seededRandom(seed * 31 + target));

        const spent = rows.reduce((sum, row) => sum + row.tokensUsed, 0);
        expect(spent).toBe(getSpendableTokens(target));

        let running = 0;
        rows.forEach((row, index) => {
          running += row.tokensUsed;
          expect(row.tokensTotal).toBe(running);
          expect(row.tokensUsed).toBe(
            ACTIVITY_TOOLS.find((tool) => tool.label === row.tool)?.cost,
          );
          expect(row.seq).toBe(index);
          if (index > 0) expect(row.ts).toBeGreaterThanOrEqual(rows[index - 1].ts);
        });

        expect(rows[rows.length - 1].tokensTotal).toBe(getSpendableTokens(target));
      }
    },
  );

  it("keeps every timestamp inside the selected dates", () => {
    const rows = generateActivity(2000, START, END, seededRandom(99));
    const endOfLastDay = new Date(2026, 10, 30, 23, 59, 59).getTime();

    rows.forEach((row) => {
      expect(row.ts).toBeGreaterThanOrEqual(START.getTime());
      expect(row.ts).toBeLessThanOrEqual(endOfLastDay);
    });
  });

  it("never uses the old Fight Analysis tool", () => {
    const rows = generateActivity(3000, START, END, seededRandom(3));
    expect(rows.some((row) => row.tool === "Fight Analysis")).toBe(false);
  });

  it("returns no rows when the target is below the cheapest tool", () => {
    expect(generateActivity(4, START, END)).toEqual([]);
  });
});
