/**
 * Utilities to extract chart data from AI-generated analysis text blocks.
 * Each block (odds, fighters, sentiment) may contain explicit win probabilities
 * for each fighter which should drive the infographic bar charts.
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

/**
 * Collapse "X to Y %" ranges into a single midpoint value.
 * e.g. "55 to 65%" → "60%", "35 to 45%" → "40%"
 */
const collapseRanges = (text: string): string =>
  text.replace(
    /(\d+)\s+to\s+(\d+)\s*%/gi,
    (_, a, b) => `${Math.round((parseInt(a) + parseInt(b)) / 2)}%`
  );

/**
 * Parse a win-probability split from a block of text.
 *
 * Strategy (in order):
 * 1. Find all "N%" tokens with a window of surrounding text.
 * 2. Associate each token with fighterA or fighterB by checking whether the
 *    fighter's last name appears within ±80 chars of the token.
 * 3. If both sides are found, normalise to 100.
 * 4. If only one side is found, derive the other as 100 – found.
 * 5. Last resort: look for two adjacent percentages that sum ≈ 100.
 * 6. Default: 50 / 50.
 */
export const parseWinProbability = (
  text: string,
  fighterA: string,
  fighterB: string
): BarData => {
  if (!text) return { red: 50, blue: 50 };

  const lastNameA = (fighterA.split(" ").pop() ?? "").toLowerCase();
  const lastNameB = (fighterB.split(" ").pop() ?? "").toLowerCase();

  // Resolve ranges first, then lowercase
  const resolved = collapseRanges(text).toLowerCase();

  const allMatches = [...resolved.matchAll(/(\d+(?:\.\d+)?)\s*%/g)];
  if (allMatches.length === 0) return { red: 50, blue: 50 };

  let percentA: number | null = null;
  let percentB: number | null = null;

  for (const match of allMatches) {
    const pct = parseFloat(match[1]);
    if (pct <= 0 || pct >= 100) continue;

    const idx = match.index!;
    const window = resolved.substring(Math.max(0, idx - 80), Math.min(resolved.length, idx + 80));

    const hasA = lastNameA && window.includes(lastNameA);
    const hasB = lastNameB && window.includes(lastNameB);

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

  // Adjacent pair summing ≈ 100
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
 * the fighter's last name.
 */
export const parseFighterStatsFromBlock = (
  text: string,
  fighterName: string
): ParsedFighterStats => {
  if (!text || !fighterName) return {};

  const lastName = (fighterName.split(" ").pop() ?? "").toLowerCase();
  const lower = text.toLowerCase();

  const nameIdx = lower.indexOf(lastName);
  if (nameIdx === -1) return {};

  // Scan up to 250 chars after the fighter name mention
  const segment = lower.substring(nameIdx, Math.min(lower.length, nameIdx + 250));

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
