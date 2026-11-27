import {
  ANALYSIS_PRODUCTS,
  ANALYSIS_PRODUCT_ORDER,
  type AnalysisProduct,
} from "@/lib/analysis/products";

export interface ActivityRow {
  seq: number;
  ts: number;
  date: string;
  tool: string;
  tokensUsed: number;
  /** Running total of tokensUsed in chronological order (the "Total spent" column). */
  tokensTotal: number;
}

export type RandomSource = () => number;

const MAX_USES_PER_SESSION = 4;

/** Every tool the generator may pick, with the same names and prices the app charges. */
export const ACTIVITY_TOOLS: readonly AnalysisProduct[] =
  ANALYSIS_PRODUCT_ORDER.map((id) => ANALYSIS_PRODUCTS[id]);

/** Cheapest tool; every price is a multiple of it, so any multiple of it can be hit exactly. */
export const MIN_TOOL_COST = Math.min(
  ...ACTIVITY_TOOLS.map((tool) => tool.cost),
);

export const randomInt = (
  min: number,
  max: number,
  random: RandomSource = Math.random,
): number => Math.floor(random() * (max - min + 1)) + min;

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
};

/** Largest amount <= tokensTarget that can be spent exactly with the available tool prices. */
export const getSpendableTokens = (tokensTarget: number): number =>
  Math.floor(tokensTarget / MIN_TOOL_COST) * MIN_TOOL_COST;

/**
 * Picks random tools until their prices add up to exactly getSpendableTokens(tokensTarget).
 * The cheapest tool is always affordable while anything remains, so the budget never gets stuck.
 */
export const pickTools = (
  tokensTarget: number,
  random: RandomSource = Math.random,
): AnalysisProduct[] => {
  let remaining = getSpendableTokens(tokensTarget);
  const picked: AnalysisProduct[] = [];

  while (remaining > 0) {
    const affordable = ACTIVITY_TOOLS.filter((tool) => tool.cost <= remaining);
    const tool = affordable[randomInt(0, affordable.length - 1, random)];
    picked.push(tool);
    remaining -= tool.cost;
  }

  return picked;
};

const splitIntoSessions = (total: number, random: RandomSource): number[] => {
  const sessions: number[] = [];
  let remaining = total;
  while (remaining > 0) {
    const size = Math.min(
      randomInt(1, MAX_USES_PER_SESSION, random),
      remaining,
    );
    sessions.push(size);
    remaining -= size;
  }
  return sessions;
};

export const generateActivity = (
  tokensTarget: number,
  startDate: Date,
  endDate: Date,
  random: RandomSource = Math.random,
): ActivityRow[] => {
  const tools = pickTools(tokensTarget, random);
  if (tools.length === 0) return [];

  const sessions = splitIntoSessions(tools.length, random);

  const startMs = startDate.getTime();
  const endMs = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
    23,
    59,
    59,
  ).getTime();
  const rangeMs = Math.max(endMs - startMs, 60_000);
  const slotMs = rangeMs / sessions.length;
  const maxStartMinutes = Math.max(0, Math.floor((slotMs * 0.25) / 60_000));

  const timestamps: number[] = [];
  sessions.forEach((uses, sessionIndex) => {
    const slotStart = startMs + sessionIndex * slotMs;
    let cursor =
      slotStart +
      randomInt(0, maxStartMinutes, random) * 60_000 +
      randomInt(0, 59, random) * 1000;

    for (let use = 0; use < uses; use++) {
      timestamps.push(
        Math.min(cursor + randomInt(0, 59, random) * 1000, endMs),
      );
      cursor += randomInt(2, 25, random) * 60_000;
    }
  });
  timestamps.sort((a, b) => a - b);

  // Tools are assigned after sorting so the running total follows the order shown to the user.
  let runningTotal = 0;
  return timestamps.map((ts, seq) => {
    const tool = tools[seq];
    runningTotal += tool.cost;
    return {
      seq,
      ts,
      date: formatDate(new Date(ts)),
      tool: tool.label,
      tokensUsed: tool.cost,
      tokensTotal: runningTotal,
    };
  });
};
