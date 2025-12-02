"use client";

import { useMemo } from "react";

interface FighterStats {
  wins: number;
  losses: number;
  knockouts: number;
  submissions: number;
  reach: string;
  height: string;
}

interface FighterComparisonProps {
  fighterA: string;
  fighterB: string;
}

// Fighter stats data (simplified for demonstration)
const FIGHTER_STATS: Record<string, FighterStats> = {
  "JUSTIN GAETHJE": { wins: 25, losses: 5, knockouts: 20, submissions: 0, reach: '70"', height: '5\'11"' },
  "PADDY PIMBLETT": { wins: 21, losses: 3, knockouts: 5, submissions: 10, reach: '73"', height: '5\'10"' },
  "KAYLA HARRISON": { wins: 17, losses: 1, knockouts: 2, submissions: 8, reach: '68"', height: '5\'8"' },
  "AMANDA NUNES": { wins: 23, losses: 5, knockouts: 13, submissions: 4, reach: '69"', height: '5\'8"' },
  "SEAN O'MALLEY": { wins: 18, losses: 2, knockouts: 12, submissions: 0, reach: '72"', height: '5\'11"' },
  "SONG YADONG": { wins: 21, losses: 7, knockouts: 8, submissions: 1, reach: '67"', height: '5\'8"' },
  "WALDO CORTES ACOSTA": { wins: 10, losses: 2, knockouts: 6, submissions: 2, reach: '75"', height: '6\'3"' },
  "DERRICK LEWIS": { wins: 28, losses: 12, knockouts: 23, submissions: 0, reach: '79"', height: '6\'3"' },
  "ARNOLD ALLEN": { wins: 20, losses: 2, knockouts: 6, submissions: 3, reach: '72"', height: '5\'8"' },
  "JEAN SILVA": { wins: 14, losses: 2, knockouts: 10, submissions: 2, reach: '72"', height: '5\'8"' },
  "ALEXA GRASSO": { wins: 16, losses: 4, knockouts: 2, submissions: 5, reach: '63"', height: '5\'5"' },
  "ROSE NAMAJUNAS": { wins: 12, losses: 6, knockouts: 4, submissions: 5, reach: '65"', height: '5\'5"' },
  "UMAR NURMAGOMEDOV": { wins: 18, losses: 0, knockouts: 3, submissions: 8, reach: '70"', height: '5\'7"' },
  "DEIVESON FIGUEIREDO": { wins: 24, losses: 3, knockouts: 10, submissions: 7, reach: '68"', height: '5\'5"' },
  "ATEBA GAUTIER": { wins: 8, losses: 1, knockouts: 5, submissions: 2, reach: '74"', height: '6\'0"' },
  "ANDREY PULYAEV": { wins: 12, losses: 3, knockouts: 6, submissions: 4, reach: '73"', height: '6\'0"' },
  "ALEXANDER VOLKANOVSKI": { wins: 26, losses: 4, knockouts: 13, submissions: 3, reach: '71"', height: '5\'6"' },
  "DIEGO LOPES": { wins: 25, losses: 6, knockouts: 4, submissions: 14, reach: '73"', height: '5\'10"' },
};

// Default stats for unknown fighters
const DEFAULT_STATS: FighterStats = {
  wins: 10,
  losses: 2,
  knockouts: 5,
  submissions: 2,
  reach: '70"',
  height: '5\'10"',
};

interface StatBarProps {
  label: string;
  valueA: number | string;
  valueB: number | string;
  isNumeric?: boolean;
}

const StatBar = ({ label, valueA, valueB, isNumeric = true }: StatBarProps) => {
  const numA = typeof valueA === "number" ? valueA : parseInt(valueA) || 0;
  const numB = typeof valueB === "number" ? valueB : parseInt(valueB) || 0;
  const total = numA + numB || 1;
  const percentA = isNumeric ? (numA / total) * 100 : 50;
  const percentB = isNumeric ? (numB / total) * 100 : 50;

  return (
    <div className="mb-4">
      {/* Values Row */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-red-400 font-bold text-lg w-16">{valueA}</span>
        <span className="text-gray-400 text-xs uppercase tracking-wider">{label}</span>
        <span className="text-blue-400 font-bold text-lg w-16 text-right">{valueB}</span>
      </div>
      
      {/* Bar */}
      <div className="flex h-2 gap-1 rounded-full overflow-hidden bg-gray-800">
        <div
          className="bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
          style={{ width: `${percentA}%` }}
        />
        <div
          className="bg-gradient-to-l from-blue-600 to-blue-500 transition-all duration-500"
          style={{ width: `${percentB}%` }}
        />
      </div>
    </div>
  );
};

export const FighterComparisonInfographic = ({
  fighterA,
  fighterB,
}: FighterComparisonProps) => {
  const statsA = useMemo(() => FIGHTER_STATS[fighterA] || DEFAULT_STATS, [fighterA]);
  const statsB = useMemo(() => FIGHTER_STATS[fighterB] || DEFAULT_STATS, [fighterB]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Card Container */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 overflow-hidden">
        {/* Background Glow */}
        <div 
          className="absolute inset-0 opacity-10 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"
          style={{ filter: "blur(60px)" }}
        />
        
        {/* Header */}
        <div className="relative z-10 text-center mb-6">
          <h3 className="text-sm font-bold tracking-widest text-purple-400 mb-3">
            FIGHTER COMPARISON
          </h3>
          <div className="flex items-center justify-center gap-4">
            <div className="text-right flex-1">
              <p className="text-red-400 font-bold text-xl truncate">{fighterA}</p>
              <p className="text-gray-500 text-sm">{statsA.height} | {statsA.reach}</p>
            </div>
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">VS</span>
            </div>
            <div className="text-left flex-1">
              <p className="text-blue-400 font-bold text-xl truncate">{fighterB}</p>
              <p className="text-gray-500 text-sm">{statsB.height} | {statsB.reach}</p>
            </div>
          </div>
        </div>

        {/* Stats Comparison */}
        <div className="relative z-10 space-y-1">
          <StatBar label="WINS" valueA={statsA.wins} valueB={statsB.wins} />
          <StatBar label="LOSSES" valueA={statsA.losses} valueB={statsB.losses} />
          <StatBar label="KO/TKO" valueA={statsA.knockouts} valueB={statsB.knockouts} />
          <StatBar label="SUBMISSIONS" valueA={statsA.submissions} valueB={statsB.submissions} />
        </div>

        {/* Win Rate */}
        <div className="relative z-10 mt-6 pt-4 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-red-400">
                {Math.round((statsA.wins / (statsA.wins + statsA.losses)) * 100)}%
              </p>
              <p className="text-xs text-gray-500 uppercase">Win Rate</p>
            </div>
            <div className="flex-shrink-0 h-12 w-px bg-gray-700" />
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-blue-400">
                {Math.round((statsB.wins / (statsB.wins + statsB.losses)) * 100)}%
              </p>
              <p className="text-xs text-gray-500 uppercase">Win Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FighterComparisonInfographic;

