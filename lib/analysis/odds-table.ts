import prismadb from "@/lib/prismadb";
import { namesMatch, normalizeName } from "./names";
import type { OddsData } from "./odds";

export const ODDS_TABLE_SOURCE = "odds-table";

const round = (value: number, digits = 2) => Number(value.toFixed(digits));

/** American moneyline (-170, +140) -> decimal odds (1.59, 2.4). */
export const americanToDecimal = (american: number): number =>
  american > 0 ? 1 + american / 100 : 1 + 100 / Math.abs(american);

const lastToken = (name: string) => normalizeName(name).split(" ").pop() ?? "";

const buildOddsData = (
  row: { eventName: string; fighterA: string; fighterB: string; oddsA: number; oddsB: number; source: string },
  requestedA: string
): OddsData => {
  const sameOrder = namesMatch(row.fighterA, requestedA);
  const entries = [
    { fighter: row.fighterA, american: row.oddsA },
    { fighter: row.fighterB, american: row.oddsB },
  ];
  const [first, second] = sameOrder ? entries : [entries[1], entries[0]];

  const decimals = [first, second].map((entry) => americanToDecimal(entry.american));
  const inverse = decimals.map((decimal) => 1 / decimal);
  const overround = inverse[0] + inverse[1];

  const toFighterOdds = (entry: (typeof entries)[number], index: number) => ({
    fighter: entry.fighter,
    americanOdds: entry.american,
    averageDecimalOdds: round(decimals[index]),
    bestDecimalOdds: round(decimals[index]),
    impliedProbabilityPct: round((inverse[index] / overround) * 100, 1),
  });

  return {
    source: ODDS_TABLE_SOURCE,
    eventName: row.eventName,
    commenceTime: null,
    bookmakerCount: 1,
    fighters: [toFighterOdds(first, 0), toFighterOdds(second, 1)],
    bookmakers: [
      {
        bookmaker: row.source,
        prices: { [first.fighter]: round(decimals[0]), [second.fighter]: round(decimals[1]) },
      },
    ],
  };
};

/** Looks the fight up in the hand-maintained FightOdds table (either fighter order). */
export const fetchTableOdds = async (
  fighterA: string,
  fighterB: string
): Promise<OddsData | null> => {
  const lastNames = [lastToken(fighterA), lastToken(fighterB)].filter(Boolean);
  if (lastNames.length === 0) return null;

  const candidates = await prismadb.fightOdds.findMany({
    where: {
      OR: lastNames.flatMap((lastName) => [
        { fighterAKey: { contains: lastName } },
        { fighterBKey: { contains: lastName } },
      ]),
    },
    orderBy: { updatedAt: "desc" },
  });

  const row = candidates.find(
    (candidate) =>
      (namesMatch(candidate.fighterA, fighterA) && namesMatch(candidate.fighterB, fighterB)) ||
      (namesMatch(candidate.fighterA, fighterB) && namesMatch(candidate.fighterB, fighterA))
  );

  return row ? buildOddsData(row, fighterA) : null;
};
