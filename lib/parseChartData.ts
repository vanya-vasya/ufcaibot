/**
 * Utilities to extract chart data from AI-generated analysis text blocks.
 *
 * The N8N webhook often returns numbers written as words
 * ("seventy percent", "sixty-two to sixty-eight percent") instead of digits.
 * We normalise the text through several stages before extracting percentages.
 */

export interface BarData {
  red: number;
  blue: number;
}

export interface ParsedFighterStats {
  wins?: number;
  losses?: number;
  knockouts?: number;
  submissions?: number;
}

// ---------------------------------------------------------------------------
// Word-to-number helpers
// ---------------------------------------------------------------------------

const ONES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

const tensPattern = Object.keys(TENS).join("|");
const onesPattern = Object.keys(ONES).join("|");

const convertWordNumbersToDigits = (text: string): string => {
  const compoundRe = new RegExp(`\\b(${tensPattern})[-\\s](${onesPattern})\\b`, "gi");
  let result = text.replace(compoundRe, (_, t, o) =>
    String((TENS[t.toLowerCase()] ?? 0) + (ONES[o.toLowerCase()] ?? 0))
  );
  const tensRe = new RegExp(`\\b(${tensPattern})\\b`, "gi");
  result = result.replace(tensRe, (w) => String(TENS[w.toLowerCase()] ?? w));
  const onesRe = new RegExp(`\\b(${onesPattern})\\b`, "gi");
  result = result.replace(onesRe, (w) => String(ONES[w.toLowerCase()] ?? w));
  return result;
};

const wordPercentToSymbol = (text: string): string =>
  text.replace(/(\d+(?:\.\d+)?)\s+percent\b/gi, "$1%");

/**
 * Collapse percentage ranges into their midpoint.
 * Handles all common formats from N8N output:
 *   "58% to 62.5%"  →  "60%"
 *   "58 to 62%"     →  "60%"
 *   "52%–56%"       →  "54%"   (en-dash)
 *   "52%—56%"       →  "54%"   (em-dash)
 */
const collapseRanges = (text: string): string => {
  // "N% to M%" — both numbers already have %
  let result = text.replace(
    /(\d+(?:\.\d+)?)\s*%\s+to\s+(\d+(?:\.\d+)?)\s*%/gi,
    (_, a, b) => `${Math.round((parseFloat(a) + parseFloat(b)) / 2)}%`
  );
  // "N to M%" — only the trailing number has %
  result = result.replace(
    /(\d+(?:\.\d+)?)\s+to\s+(\d+(?:\.\d+)?)\s*%/gi,
    (_, a, b) => `${Math.round((parseFloat(a) + parseFloat(b)) / 2)}%`
  );
  // "N%–M%" or "N%—M%" — en/em-dash range, both with %
  result = result.replace(
    /(\d+(?:\.\d+)?)\s*%\s*[–—]\s*(\d+(?:\.\d+)?)\s*%/gi,
    (_, a, b) => `${Math.round((parseFloat(a) + parseFloat(b)) / 2)}%`
  );
  return result;
};

const normaliseText = (raw: string): string => {
  let t = raw;
  t = convertWordNumbersToDigits(t);
  t = wordPercentToSymbol(t);
  t = collapseRanges(t);
  return t.toLowerCase();
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Parse a win-probability split (red = fighterA, blue = fighterB) from a
 * single analysis block.
 *
 * Strategy:
 * 1. Collect ALL "N%" tokens. For each token, check whether either fighter's
 *    last name appears within ±300 chars (large window to handle blocks where
 *    the fighter is named at the start but percentages follow later).
 * 2. Filter collected candidates to "win-probability range" (20–85%).
 *    This removes vig/juice values (typically 3–8%) and other small numbers
 *    that appear near a fighter's name but are not win probabilities.
 *    If filtering removes ALL candidates for a fighter, fall back to unfiltered.
 * 3. Take the median of candidates per fighter (robust against outliers).
 * 4. If both found, normalise to sum to exactly 100.
 * 5. If only one found, derive the other as 100 – found.
 * 6. Last resort: first adjacent pair that sums ≈ 100.
 * 7. Default: 50 / 50.
 *
 * red = fighterA, blue = fighterB.  Both always sum to 100.
 */
export const parseWinProbability = (
  text: string,
  fighterA: string,
  fighterB: string
): BarData => {
  if (!text) return { red: 50, blue: 50 };

  const lastNameA = (fighterA.split(" ").pop() ?? "").toLowerCase();
  const lastNameB = (fighterB.split(" ").pop() ?? "").toLowerCase();

  const normalised = normaliseText(text);

  // Clamp red to [1,99] and set blue = 100 – red (guarantees sum = 100)
  const makeBar = (rawRed: number): BarData => {
    const r = Math.min(Math.max(Math.round(rawRed), 1), 99);
    return { red: r, blue: 100 - r };
  };

  const allMatches = Array.from(normalised.matchAll(/(\d+(?:\.\d+)?)\s*%/g));
  if (allMatches.length === 0) return { red: 50, blue: 50 };

  // Step 1 — collect all candidate percentages per fighter (large window)
  const candidatesA: number[] = [];
  const candidatesB: number[] = [];

  for (const match of allMatches) {
    const pct = parseFloat(match[1]);
    if (pct <= 0 || pct >= 100) continue;

    const idx = match.index!;
    const ctx = normalised.substring(
      Math.max(0, idx - 300),
      Math.min(normalised.length, idx + 300)
    );

    const hasA = !!lastNameA && ctx.includes(lastNameA);
    const hasB = !!lastNameB && ctx.includes(lastNameB);

    // Prefer exclusive association; if both present use the closer one
    if (hasA && !hasB) {
      candidatesA.push(pct);
    } else if (hasB && !hasA) {
      candidatesB.push(pct);
    } else if (hasA && hasB) {
      const idxA = ctx.indexOf(lastNameA);
      const idxB = ctx.indexOf(lastNameB);
      const pctPosInCtx = Math.min(idx, 300); // offset of % within ctx
      if (Math.abs(idxA - pctPosInCtx) <= Math.abs(idxB - pctPosInCtx)) {
        candidatesA.push(pct);
      } else {
        candidatesB.push(pct);
      }
    }
  }

  // Step 2 — filter to win-probability range; fall back to unfiltered if empty
  const WIN_MIN = 20;
  const WIN_MAX = 85;
  const filterWinProb = (vals: number[]): number[] => {
    const filtered = vals.filter((v) => v >= WIN_MIN && v <= WIN_MAX);
    return filtered.length > 0 ? filtered : vals;
  };

  const filteredA = filterWinProb(candidatesA);
  const filteredB = filterWinProb(candidatesB);

  // Step 3 — median (robust against outliers)
  const median = (vals: number[]): number | null => {
    if (vals.length === 0) return null;
    const s = [...vals].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
  };

  const percentA = median(filteredA);
  const percentB = median(filteredB);

  if (percentA !== null && percentB !== null) {
    const sum = percentA + percentB;
    return makeBar((percentA / (sum > 0 ? sum : 100)) * 100);
  }
  if (percentB !== null) return makeBar(100 - percentB);
  if (percentA !== null) return makeBar(percentA);

  // Step 4 — adjacent pair summing ≈ 100
  for (let i = 0; i < allMatches.length - 1; i++) {
    const p1 = parseFloat(allMatches[i][1]);
    const p2 = parseFloat(allMatches[i + 1][1]);
    if (p1 > 0 && p2 > 0 && Math.abs(p1 + p2 - 100) <= 5) {
      return makeBar(p1);
    }
  }

  return { red: 50, blue: 50 };
};

/**
 * Extract basic fight stats for a single fighter from a block of text.
 */
export const parseFighterStatsFromBlock = (
  text: string,
  fighterName: string
): ParsedFighterStats => {
  if (!text || !fighterName) return {};

  const normalised = convertWordNumbersToDigits(text).toLowerCase();
  const lastName = (fighterName.split(" ").pop() ?? "").toLowerCase();

  const nameIdx = normalised.indexOf(lastName);
  if (nameIdx === -1) return {};

  const segment = normalised.substring(
    nameIdx,
    Math.min(normalised.length, nameIdx + 250)
  );

  const stats: ParsedFighterStats = {};

  const winsMatch = segment.match(/(\d+)\s+(?:career\s+)?wins?/);
  if (winsMatch) stats.wins = parseInt(winsMatch[1]);

  const koMatch = segment.match(/(\d+)\s+(?:k\.?o\.?s?|knockouts?|tko)/);
  if (koMatch) stats.knockouts = parseInt(koMatch[1]);

  const subMatch = segment.match(/(\d+)\s+submissions?/);
  if (subMatch) stats.submissions = parseInt(subMatch[1]);

  const lossesMatch = segment.match(/(\d+)\s+losses?/);
  if (lossesMatch) stats.losses = parseInt(lossesMatch[1]);

  return stats;
};
