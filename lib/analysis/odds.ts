import { getOrSetCache, ONE_HOUR_MS } from "./cache";
import { namesMatch } from "./names";

const ODDS_ENDPOINT =
  "https://api.the-odds-api.com/v4/sports/mma_mixed_martial_arts/odds/";
const ODDS_CACHE_KEY = "odds:mma_mixed_martial_arts:h2h:us";

interface RawOutcome {
  name: string;
  price: number;
}

interface RawEvent {
  id: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: {
    key: string;
    title: string;
    markets: { key: string; outcomes: RawOutcome[] }[];
  }[];
}

export interface FighterOdds {
  fighter: string;
  averageDecimalOdds: number;
  bestDecimalOdds: number;
  impliedProbabilityPct: number;
}

export interface OddsData {
  commenceTime: string;
  bookmakerCount: number;
  fighters: [FighterOdds, FighterOdds];
  bookmakers: { bookmaker: string; prices: Record<string, number> }[];
}

const round = (value: number, digits = 2) => Number(value.toFixed(digits));

const fetchAllEvents = async (): Promise<RawEvent[]> => {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) throw new Error("ODDS_API_KEY is not configured");

  const url = new URL(ODDS_ENDPOINT);
  url.search = new URLSearchParams({
    regions: "us",
    markets: "h2h",
    oddsFormat: "decimal",
    apiKey,
  }).toString();

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`The Odds API responded ${response.status}`);
  return (await response.json()) as RawEvent[];
};

const findEvent = (events: RawEvent[], fighterA: string, fighterB: string) =>
  events.find(
    (event) =>
      (namesMatch(event.home_team, fighterA) && namesMatch(event.away_team, fighterB)) ||
      (namesMatch(event.home_team, fighterB) && namesMatch(event.away_team, fighterA))
  );

const summarizeEvent = (event: RawEvent, fighterA: string, fighterB: string): OddsData | null => {
  const h2hByBookmaker = event.bookmakers
    .map((bookmaker) => ({
      bookmaker: bookmaker.title,
      outcomes: bookmaker.markets.find((market) => market.key === "h2h")?.outcomes ?? [],
    }))
    .filter((entry) => entry.outcomes.length >= 2);

  if (h2hByBookmaker.length === 0) return null;

  const names = [event.home_team, event.away_team];
  const impliedByFighter: number[][] = [[], []];
  const pricesByFighter: number[][] = [[], []];

  h2hByBookmaker.forEach(({ outcomes }) => {
    const prices = names.map((name) => outcomes.find((o) => o.name === name)?.price);
    if (prices.some((price) => !price)) return;
    const inverse = prices.map((price) => 1 / (price as number));
    const overround = inverse[0] + inverse[1];
    names.forEach((_, index) => {
      pricesByFighter[index].push(prices[index] as number);
      impliedByFighter[index].push(inverse[index] / overround);
    });
  });

  if (pricesByFighter[0].length === 0) return null;

  const average = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length;
  const toFighterOdds = (index: number): FighterOdds => ({
    fighter: names[index],
    averageDecimalOdds: round(average(pricesByFighter[index])),
    bestDecimalOdds: round(Math.max(...pricesByFighter[index])),
    impliedProbabilityPct: round(average(impliedByFighter[index]) * 100, 1),
  });

  const ordered = namesMatch(names[0], fighterA) ? [0, 1] : [1, 0];

  return {
    commenceTime: event.commence_time,
    bookmakerCount: pricesByFighter[0].length,
    fighters: [toFighterOdds(ordered[0]), toFighterOdds(ordered[1])],
    bookmakers: h2hByBookmaker.slice(0, 8).map(({ bookmaker, outcomes }) => ({
      bookmaker,
      prices: Object.fromEntries(outcomes.map((o) => [o.name, o.price])),
    })),
  };
};

/** Fetches (and caches for one hour) the whole MMA market, then picks this fight. */
export const fetchOddsData = async (
  fighterA: string,
  fighterB: string
): Promise<OddsData | null> => {
  const events = await getOrSetCache(ODDS_CACHE_KEY, ONE_HOUR_MS, fetchAllEvents);
  const event = findEvent(events, fighterA, fighterB);
  return event ? summarizeEvent(event, fighterA, fighterB) : null;
};
