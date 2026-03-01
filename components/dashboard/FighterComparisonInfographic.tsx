"use client";

import { useMemo } from "react";
import type { ParsedFighterStats } from "@/lib/parseChartData";
import { UFC326_FIGHTER_STATS, type FighterMatchupStats } from "@/data/ufc326-fighter-stats";
import { UFC_FN_EMMETT_VS_VALLEJOS_FIGHTER_STATS } from "@/data/ufc-fn-emmett-vs-vallejos-fighter-stats";
import { UFC_FN_EVLOEV_VS_MURPHY_FIGHTER_STATS } from "@/data/ufc-fn-evloev-vs-murphy-fighter-stats";

const ALL_FIGHTER_STATS = {
  ...UFC326_FIGHTER_STATS,
  ...UFC_FN_EMMETT_VS_VALLEJOS_FIGHTER_STATS,
  ...UFC_FN_EVLOEV_VS_MURPHY_FIGHTER_STATS,
};

interface FighterComparisonProps {
  fighterA: string;
  fighterB: string;
  parsedStatsA?: ParsedFighterStats;
  parsedStatsB?: ParsedFighterStats;
}

interface StatRowProps {
  label: string;
  valueA: string | number;
  valueB: string | number;
  numericA?: number;
  numericB?: number;
  highlight?: boolean;
}

const StatRow = ({ label, valueA, valueB, numericA, numericB, highlight = false }: StatRowProps) => {
  const hasBar = numericA !== undefined && numericB !== undefined;
  const total = hasBar ? (numericA + numericB || 1) : 1;
  const percentA = hasBar ? (numericA / total) * 100 : 50;
  const percentB = hasBar ? (numericB / total) * 100 : 50;

  return (
    <div className={`py-3 ${highlight ? "border-t border-gray-800/60" : ""}`}>
      {/* Values + Label row */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className={`font-bold text-base w-[38%] text-left ${
          hasBar && numericA > numericB ? "text-red-400" : "text-gray-300"
        }`}>
          {valueA}
        </span>
        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase text-center flex-shrink-0 min-w-[24%]">
          {label}
        </span>
        <span className={`font-bold text-base w-[38%] text-right ${
          hasBar && numericB > numericA ? "text-blue-400" : "text-gray-300"
        }`}>
          {valueB}
        </span>
      </div>

      {/* Progress bar */}
      {hasBar && (
        <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-800">
          <div
            className="bg-gradient-to-r from-red-700 to-red-500 transition-all duration-500"
            style={{ width: `${percentA}%` }}
          />
          <div className="flex-1" />
          <div
            className="bg-gradient-to-l from-blue-700 to-blue-500 transition-all duration-500"
            style={{ width: `${percentB}%` }}
          />
        </div>
      )}
    </div>
  );
};

const DEFAULT_STATS: FighterMatchupStats = {
  record: "—",
  lastFight: "—",
  country: "—",
  height: "—",
  weight: "—",
  reach: "—",
  legReach: "—",
  wins: 10,
  losses: 2,
  draws: 0,
  knockouts: 5,
  submissions: 2,
};

export const FighterComparisonInfographic = ({
  fighterA,
  fighterB,
  parsedStatsA,
  parsedStatsB,
}: FighterComparisonProps) => {
  const fightKey = `${fighterA} VS ${fighterB}`;
  const matchup = ALL_FIGHTER_STATS[fightKey];

  const statsA = useMemo<FighterMatchupStats>(() => {
    const base = matchup?.fighterA ?? DEFAULT_STATS;
    return {
      ...base,
      wins: parsedStatsA?.wins ?? base.wins,
      losses: parsedStatsA?.losses ?? base.losses,
      knockouts: parsedStatsA?.knockouts ?? base.knockouts,
      submissions: parsedStatsA?.submissions ?? base.submissions,
    };
  }, [matchup, parsedStatsA]);

  const statsB = useMemo<FighterMatchupStats>(() => {
    const base = matchup?.fighterB ?? DEFAULT_STATS;
    return {
      ...base,
      wins: parsedStatsB?.wins ?? base.wins,
      losses: parsedStatsB?.losses ?? base.losses,
      knockouts: parsedStatsB?.knockouts ?? base.knockouts,
      submissions: parsedStatsB?.submissions ?? base.submissions,
    };
  }, [matchup, parsedStatsB]);

  const winRateA = statsA.wins + statsA.losses > 0
    ? Math.round((statsA.wins / (statsA.wins + statsA.losses)) * 100)
    : 0;
  const winRateB = statsB.wins + statsB.losses > 0
    ? Math.round((statsB.wins / (statsB.wins + statsB.losses)) * 100)
    : 0;

  const reachNumA = parseFloat(statsA.reach) || 0;
  const reachNumB = parseFloat(statsB.reach) || 0;
  const heightNumA = parseFloat(statsA.height) || 0;
  const heightNumB = parseFloat(statsB.height) || 0;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative bg-gradient-to-b from-gray-950 to-black rounded-2xl border border-gray-800 overflow-hidden">

        {/* Weight Class Banner */}
        {matchup?.weightClass && (
          <div className="bg-gray-900/80 border-b border-gray-800 px-6 py-2 text-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
              {matchup.weightClass}
            </span>
          </div>
        )}

        {/* Fighter Names Header */}
        <div className="relative px-6 pt-5 pb-4 border-b border-gray-800">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-red-400 font-bold text-xl leading-tight truncate" style={{ fontFamily: "var(--font-ufc-heading)" }}>
                {fighterA}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">{statsA.country}</p>
            </div>

            <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700">
              <span className="text-white font-black text-sm tracking-wider">VS</span>
            </div>

            <div className="flex-1 min-w-0 text-right">
              <p className="text-blue-400 font-bold text-xl leading-tight truncate" style={{ fontFamily: "var(--font-ufc-heading)" }}>
                {fighterB}
              </p>
              <p className="text-gray-500 text-xs mt-0.5 text-right">{statsB.country}</p>
            </div>
          </div>
        </div>

        {/* Matchup Stats */}
        <div className="px-6 py-2 divide-y divide-gray-800/40">
          {/* Header row */}
          <div className="flex items-center justify-between py-2 mb-1">
            <span className="text-[10px] font-black tracking-[0.15em] text-white uppercase">
              MATCHUP STATS
            </span>
          </div>

          <StatRow
            label="RECORD"
            valueA={statsA.record}
            valueB={statsB.record}
            numericA={statsA.wins}
            numericB={statsB.wins}
          />
          <StatRow
            label="LAST FIGHT"
            valueA={statsA.lastFight}
            valueB={statsB.lastFight}
          />
          <StatRow
            label="HEIGHT"
            valueA={statsA.height}
            valueB={statsB.height}
            numericA={heightNumA}
            numericB={heightNumB}
          />
          <StatRow
            label="WEIGHT"
            valueA={statsA.weight}
            valueB={statsB.weight}
          />
          <StatRow
            label="REACH"
            valueA={statsA.reach}
            valueB={statsB.reach}
            numericA={reachNumA}
            numericB={reachNumB}
          />
          <StatRow
            label="LEG REACH"
            valueA={statsA.legReach}
            valueB={statsB.legReach}
          />
          <StatRow
            label="KO / TKO"
            valueA={statsA.knockouts}
            valueB={statsB.knockouts}
            numericA={statsA.knockouts}
            numericB={statsB.knockouts}
          />
          <StatRow
            label="SUBMISSIONS"
            valueA={statsA.submissions}
            valueB={statsB.submissions}
            numericA={statsA.submissions}
            numericB={statsB.submissions}
          />
        </div>

        {/* Win Rate Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/40">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className={`text-2xl font-bold ${winRateA >= winRateB ? "text-red-400" : "text-gray-400"}`}>
                {winRateA}%
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Win Rate</p>
            </div>
            <div className="h-10 w-px bg-gray-700 mx-4" />
            <div className="text-center flex-1">
              <p className={`text-2xl font-bold ${winRateB >= winRateA ? "text-blue-400" : "text-gray-400"}`}>
                {winRateB}%
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Win Rate</p>
            </div>
          </div>

          {/* Win Rate bar */}
          <div className="mt-3 flex h-2 rounded-full overflow-hidden bg-gray-800">
            <div
              className="bg-gradient-to-r from-red-700 to-red-500 transition-all duration-700"
              style={{ width: `${winRateA}%` }}
            />
            <div className="flex-1" />
            <div
              className="bg-gradient-to-l from-blue-700 to-blue-500 transition-all duration-700"
              style={{ width: `${winRateB}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FighterComparisonInfographic;
