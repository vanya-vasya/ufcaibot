import prismadb from "@/lib/prismadb";
import { normalizeName } from "./names";

const NAME_SIMILARITY_THRESHOLD = 0.5;
const RECENT_FIGHTS_LIMIT = 6;

interface ProfileRow {
  fullName: string;
  nickname: string | null;
  heightFt: number | null;
  weightLbs: number | null;
  stance: string | null;
  wins: number | null;
  losses: number | null;
  draws: number | null;
  belt: boolean;
  avgRounds: number | null;
  avgFightTime: number | null;
  knockdowns: number | null;
  strikes: number | null;
  takedowns: number | null;
  submissions: number | null;
  control: number | null;
  sigStrPct: number | null;
  headPct: number | null;
  bodyPct: number | null;
  legPct: number | null;
  distancePct: number | null;
  clinchPct: number | null;
  groundPct: number | null;
  subAttempts: number | null;
  reversals: number | null;
  weightClass: string | null;
  fightingStyle: string | null;
}

interface FightRow {
  redFighter: string;
  blueFighter: string;
  date: Date;
  winner: string | null;
  titleBout: boolean;
  weightClass: string | null;
  redOdds: number | null;
  blueOdds: number | null;
  finish: string | null;
  finishDetails: string | null;
  finishRound: number | null;
  totalFightTimeSecs: number | null;
  details: Record<string, string | number>;
  redSimilarity: number;
  blueSimilarity: number;
}

export interface FighterFightSummary {
  date: string;
  opponent: string;
  result: "win" | "loss" | "draw/no contest";
  method: string | null;
  round: number | null;
  weightClass: string | null;
  titleBout: boolean;
  openingOddsAmerican: number | null;
}

export interface FighterHistory {
  requestedName: string;
  profile: (Omit<ProfileRow, "fullName"> & { name: string }) | null;
  recentFights: FighterFightSummary[];
  careerSnapshotBeforeLastRecordedFight: Record<string, string | number> | null;
}

export interface HistoryData {
  fighters: [FighterHistory | null, FighterHistory | null];
  datasetLastFightDate: string | null;
}

const SNAPSHOT_FIELDS = [
  "Wins",
  "Losses",
  "Draws",
  "WinsByKO",
  "WinsBySubmission",
  "WinsByDecisionUnanimous",
  "WinsByDecisionSplit",
  "WinsByDecisionMajority",
  "CurrentWinStreak",
  "CurrentLoseStreak",
  "LongestWinStreak",
  "AvgSigStrLanded",
  "AvgSigStrPct",
  "AvgSubAtt",
  "AvgTDLanded",
  "AvgTDPct",
  "HeightCms",
  "ReachCms",
  "Stance",
  "Age",
] as const;

const findProfile = async (name: string): Promise<ProfileRow | null> => {
  const needle = normalizeName(name);
  const rows = await prismadb.$queryRaw<ProfileRow[]>`
    SELECT "fullName", "nickname", "heightFt", "weightLbs", "stance", "wins", "losses", "draws",
           "belt", "avgRounds", "avgFightTime", "knockdowns", "strikes", "takedowns",
           "submissions", "control", "sigStrPct", "headPct", "bodyPct", "legPct",
           "distancePct", "clinchPct", "groundPct", "subAttempts", "reversals",
           "weightClass", "fightingStyle"
    FROM "FighterProfile"
    WHERE lower("fullName") % ${needle}
      AND similarity(lower("fullName"), ${needle}) >= ${NAME_SIMILARITY_THRESHOLD}
    ORDER BY similarity(lower("fullName"), ${needle}) DESC, COALESCE("wins", 0) + COALESCE("losses", 0) DESC
    LIMIT 1
  `;
  return rows[0] ?? null;
};

const findRecentFights = (name: string): Promise<FightRow[]> => {
  const needle = normalizeName(name);
  return prismadb.$queryRaw<FightRow[]>`
    SELECT "redFighter", "blueFighter", "date", "winner", "titleBout", "weightClass",
           "redOdds", "blueOdds", "finish", "finishDetails", "finishRound",
           "totalFightTimeSecs", "details",
           similarity(lower("redFighter"), ${needle})::float8 AS "redSimilarity",
           similarity(lower("blueFighter"), ${needle})::float8 AS "blueSimilarity"
    FROM "FightHistory"
    WHERE (lower("redFighter") % ${needle}
           AND similarity(lower("redFighter"), ${needle}) >= ${NAME_SIMILARITY_THRESHOLD})
       OR (lower("blueFighter") % ${needle}
           AND similarity(lower("blueFighter"), ${needle}) >= ${NAME_SIMILARITY_THRESHOLD})
    ORDER BY "date" DESC
    LIMIT ${RECENT_FIGHTS_LIMIT}
  `;
};

const toFightSummary = (fight: FightRow): { side: "Red" | "Blue"; summary: FighterFightSummary } => {
  const side = fight.redSimilarity >= fight.blueSimilarity ? "Red" : "Blue";
  const winner = fight.winner?.toLowerCase();
  const result =
    winner === side.toLowerCase()
      ? "win"
      : winner === "red" || winner === "blue"
        ? "loss"
        : "draw/no contest";

  const method = [fight.finish, fight.finishDetails].filter(Boolean).join(" - ");

  return {
    side,
    summary: {
      date: fight.date.toISOString().slice(0, 10),
      opponent: side === "Red" ? fight.blueFighter : fight.redFighter,
      result,
      method: method || null,
      round: fight.finishRound,
      weightClass: fight.weightClass,
      titleBout: fight.titleBout,
      openingOddsAmerican: side === "Red" ? fight.redOdds : fight.blueOdds,
    },
  };
};

const toSnapshot = (fight: FightRow, side: "Red" | "Blue") => {
  const snapshot: Record<string, string | number> = {};
  SNAPSHOT_FIELDS.forEach((field) => {
    const value = fight.details[`${side}${field}`];
    if (value !== undefined) snapshot[field] = value;
  });
  return Object.keys(snapshot).length > 0 ? snapshot : null;
};

const loadFighterHistory = async (name: string): Promise<FighterHistory | null> => {
  const [profile, fights] = await Promise.all([findProfile(name), findRecentFights(name)]);
  if (!profile && fights.length === 0) return null;

  const summaries = fights.map(toFightSummary);
  const profileSummary = profile
    ? (({ fullName, ...rest }) => ({ name: fullName, ...rest }))(profile)
    : null;

  return {
    requestedName: name,
    profile: profileSummary,
    recentFights: summaries.map(({ summary }) => summary),
    careerSnapshotBeforeLastRecordedFight: fights[0]
      ? toSnapshot(fights[0], summaries[0].side)
      : null,
  };
};

const getDatasetLastFightDate = async (): Promise<string | null> => {
  const latest = await prismadb.fightHistory.findFirst({
    orderBy: { date: "desc" },
    select: { date: true },
  });
  return latest ? latest.date.toISOString().slice(0, 10) : null;
};

export const fetchHistoryData = async (
  fighterA: string,
  fighterB: string
): Promise<HistoryData | null> => {
  const [first, second, datasetLastFightDate] = await Promise.all([
    loadFighterHistory(fighterA),
    loadFighterHistory(fighterB),
    getDatasetLastFightDate(),
  ]);

  if (!first && !second) return null;
  return { fighters: [first, second], datasetLastFightDate };
};
