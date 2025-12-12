"use client";

import { Trophy, Crown, Award } from "lucide-react";
import type { FightResult } from "@/data/ufc-events-2025";

interface FightResultCardProps {
  fight: FightResult;
}

/**
 * FightResultCard - Displays a single fight result with Fighter A vs Fighter B
 * Winner is highlighted with gold accent
 */
export const FightResultCard = ({ fight }: FightResultCardProps) => {
  const isWinnerA = fight.winner === "A";
  const isWinnerB = fight.winner === "B";
  const isDraw = fight.winner === "draw";
  const isNoContest = fight.winner === "nc";

  return (
    <div 
      className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors"
      role="listitem"
    >
      {/* Title Bout / Bonuses Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {fight.isTitleBout && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-xs font-bold rounded uppercase">
            <Crown className="w-3 h-3" />
            Title Bout
          </span>
        )}
        {fight.bonuses?.map((bonus) => (
          <span 
            key={bonus}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-bold rounded uppercase"
          >
            <Award className="w-3 h-3" />
            {bonus}
          </span>
        ))}
        <span className="ml-auto text-xs text-zinc-500 uppercase tracking-wide">
          {fight.weightClass}
        </span>
      </div>

      {/* Fighters VS Layout */}
      <div className="flex items-center justify-between gap-2">
        {/* Fighter A */}
        <div 
          className={`flex-1 text-left ${isWinnerA ? "" : "opacity-70"}`}
        >
          <div className="flex items-center gap-2">
            {isWinnerA && (
              <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0" aria-label="Winner" />
            )}
            <div className="min-w-0">
              <p 
                className={`font-bold truncate ${
                  isWinnerA 
                    ? "text-yellow-400" 
                    : "text-white"
                }`}
                style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
              >
                {fight.fighterA.name.toUpperCase()}
                {fight.fighterA.isChampion && (
                  <span className="ml-1 text-yellow-500">(C)</span>
                )}
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>{fight.fighterA.country}</span>
                {fight.fighterA.rank && (
                  <span className="text-zinc-400">{fight.fighterA.rank}</span>
                )}
              </div>
            </div>
          </div>
          {isWinnerA && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded uppercase">
              Winner
            </span>
          )}
        </div>

        {/* VS Divider */}
        <div className="flex-shrink-0 px-3">
          <span 
            className="text-lg font-bold text-zinc-500"
            style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
          >
            VS
          </span>
        </div>

        {/* Fighter B */}
        <div 
          className={`flex-1 text-right ${isWinnerB ? "" : "opacity-70"}`}
        >
          <div className="flex items-center justify-end gap-2">
            <div className="min-w-0">
              <p 
                className={`font-bold truncate ${
                  isWinnerB 
                    ? "text-yellow-400" 
                    : "text-white"
                }`}
                style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
              >
                {fight.fighterB.isChampion && (
                  <span className="mr-1 text-yellow-500">(C)</span>
                )}
                {fight.fighterB.name.toUpperCase()}
              </p>
              <div className="flex items-center justify-end gap-2 text-xs text-zinc-500">
                {fight.fighterB.rank && (
                  <span className="text-zinc-400">{fight.fighterB.rank}</span>
                )}
                <span>{fight.fighterB.country}</span>
              </div>
            </div>
            {isWinnerB && (
              <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0" aria-label="Winner" />
            )}
          </div>
          {isWinnerB && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded uppercase">
              Winner
            </span>
          )}
        </div>
      </div>

      {/* Fight Result Stats */}
      <div className="mt-4 pt-3 border-t border-zinc-800">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {/* Method */}
          <div className="text-center">
            <span className="block text-xs text-zinc-500 uppercase">Method</span>
            <span className="text-white font-medium">
              {isDraw ? "Draw" : isNoContest ? "No Contest" : fight.method}
            </span>
          </div>
          {/* Round */}
          <div className="text-center">
            <span className="block text-xs text-zinc-500 uppercase">Round</span>
            <span className="text-white font-medium">{fight.round}</span>
          </div>
          {/* Time */}
          <div className="text-center">
            <span className="block text-xs text-zinc-500 uppercase">Time</span>
            <span className="text-white font-medium">{fight.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FightResultCard;
