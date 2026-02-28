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

const tensPattern  = Object.keys(TENS).join("|");
const onesPattern  = Object.keys(ONES).join("|");

/**
 * Convert word-based numbers to digit strings.
 * Handles:
 *   - Compound hyphenated:  "sixty-two" → "62"
 *   - Compound with space:  "sixty two" → "62"  (only tens + ones combos)
 *   - Single tens word:     "seventy"   → "70"
 *   - Single ones/teen:     "thirty"    → "30"
 *
 * Betting lines like "minus one-seventy" are intentionally left alone because
 * "one" is not in the TENS map, so the compound pattern won't fire.
 */
const convertWordNumbersToDigits = (text: string): string => {
  // 1. Compound: tens + hyphen/space + ones  e.g. "sixty-two", "thirty seven"
  const compoundRe = new RegExp(`\\b(${tensPattern})[-\\s](${onesPattern})\\b`, "gi");
  let result = text.replace(compoundRe, (_, t, o) =>
    String((TENS[t.toLowerCase()] ?? 0) + (ONES[o.toLowerCase()] ?? 0))
  );

  // 2. Single tens words  e.g. "seventy" → "70"
  const tensRe = new RegExp(`\\b(${tensPattern})\\b`, "gi");
  result = result.replace(tensRe, (w) => String(TENS[w.toLowerCase()] ?? w));

  // 3. Single ones/teen words  e.g. "thirty" already handled; "fifteen" → "15"
  const onesRe = new RegExp(`\\b(${onesPattern})\\b`, "gi");
  result = result.replace(onesRe, (w) => String(ONES[w.toLowerCase()] ?? w));

  return result;
};

/**
 * Replace "N percent" (word) with "N%" so downstream regexes can match it.
 */
const wordPercentToSymbol = (text: string): string =>
  text.replace(/(\d+)\s+percent\b/gi, "$1%");

/**
 * Collapse "X to Y %" ranges into their midpoint.
 * e.g. "62 to 68%" → "65%"
 */
const collapseRanges = (text: string): string =>
  text.replace(
    /(\d+)\s+to\s+(\d+)\s*%/gi,
    (_, a, b) => `${Math.round((parseInt(a) + parseInt(b)) / 2)}%`
  );

/**
 * Full normalisation pipeline applied before percentage extraction.
 */
const normaliseText = (raw: string): string => {
  let t = raw;
  t = convertWordNumbersToDigits(t);  // "seventy" → "70"
  t = wordPercentToSymbol(t);          // "70 percent" → "70%"
  t = collapseRanges(t);               // "62 to 68%" → "65%"
  return t.toLowerCase();
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Parse a win-probability split (red = fighterA, blue = fighterB) from a
 * single analysis block.
 *
 * Strategy (applied in order after text normalisation):
 * 1. Scan every "N%" token; associate it with a fighter if that fighter's
 *    last name appears within ±80 chars of the token.
 * 2. If both fighters found, normalise pair to sum to 100.
 * 3. If only one fighter found, derive the other as 100 – found.
 * 4. Last resort: first adjacent pair that sums ≈ 100.
 * 5. Default: 50 / 50.
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

  const allMatches = Array.from(normalised.matchAll(/(\d+(?:\.\d+)?)\s*%/g));
  if (allMatches.length === 0) return { red: 50, blue: 50 };

  let percentA: number | null = null;
  let percentB: number | null = null;

  for (const match of allMatches) {
    const pct = parseFloat(match[1]);
    if (pct <= 0 || pct >= 100) continue;

    const idx = match.index!;
    const ctx = normalised.substring(
      Math.max(0, idx - 80),
      Math.min(normalised.length, idx + 80)
    );

    const hasA = !!lastNameA && ctx.includes(lastNameA);
    const hasB = !!lastNameB && ctx.includes(lastNameB);

    if (hasB && !hasA && percentB === null) {
      percentB = pct;
    } else if (hasA && !hasB && percentA === null) {
      percentA = pct;
    }
  }

  if (percentA !== null && percentB !== null) {
    const sum = percentA + percentB;
    const divisor = sum > 105 ? sum : 100;
    return {
      red: Math.round((percentA / divisor) * 100),
      blue: Math.round((percentB / divisor) * 100),
    };
  }

  if (percentB !== null) {
    const b = Math.min(Math.max(Math.round(percentB), 1), 99);
    return { red: 100 - b, blue: b };
  }

  if (percentA !== null) {
    const a = Math.min(Math.max(Math.round(percentA), 1), 99);
    return { red: a, blue: 100 - a };
  }

  // Adjacent pair summing ≈ 100 as last resort
  for (let i = 0; i < allMatches.length - 1; i++) {
    const p1 = parseFloat(allMatches[i][1]);
    const p2 = parseFloat(allMatches[i + 1][1]);
    if (p1 > 0 && p2 > 0 && Math.abs(p1 + p2 - 100) <= 5) {
      return { red: Math.round(p1), blue: Math.round(p2) };
    }
  }

  return { red: 50, blue: 50 };
};

/**
 * Extract basic fight stats for a single fighter from a block of text.
 * Looks for patterns like "15 career wins", "7 KOs", "4 submissions" near
 * the fighter's last name. Also handles word-based numbers.
 */
export const parseFighterStatsFromBlock = (
  text: string,
  fighterName: string
): ParsedFighterStats => {
  if (!text || !fighterName) return {};

  // Convert word numbers so "fifteen career wins" → "15 career wins"
  const normalised = convertWordNumbersToDigits(text).toLowerCase();
  const lastName = (fighterName.split(" ").pop() ?? "").toLowerCase();

  const nameIdx = normalised.indexOf(lastName);
  if (nameIdx === -1) return {};

  // Scan up to 250 chars after the fighter name mention
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
