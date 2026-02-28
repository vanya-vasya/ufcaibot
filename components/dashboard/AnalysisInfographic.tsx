"use client";

import { useMemo } from "react";

interface BarData {
  red: number;
  blue: number;
}

interface AnalysisInfographicProps {
  type: "odds" | "fighters" | "sentiment";
  fighterA: string;
  fighterB: string;
  data?: BarData;
}

// Default analysis data for each fight (used when webhook doesn't provide structured data)
const FIGHT_ANALYSIS_DATA: Record<string, { odds: BarData; fighters: BarData; sentiment: BarData }> = {
  "JUSTIN GAETHJE VS PADDY PIMBLETT": {
    odds: { red: 55, blue: 45 },
    fighters: { red: 62, blue: 38 },
    sentiment: { red: 48, blue: 52 },
  },
  "KAYLA HARRISON VS AMANDA NUNES": {
    odds: { red: 35, blue: 65 },
    fighters: { red: 40, blue: 60 },
    sentiment: { red: 38, blue: 62 },
  },
  "SEAN O'MALLEY VS SONG YADONG": {
    odds: { red: 68, blue: 32 },
    fighters: { red: 72, blue: 28 },
    sentiment: { red: 75, blue: 25 },
  },
  "WALDO CORTES ACOSTA VS DERRICK LEWIS": {
    odds: { red: 42, blue: 58 },
    fighters: { red: 38, blue: 62 },
    sentiment: { red: 45, blue: 55 },
  },
  "ARNOLD ALLEN VS JEAN SILVA": {
    odds: { red: 52, blue: 48 },
    fighters: { red: 55, blue: 45 },
    sentiment: { red: 50, blue: 50 },
  },
  "ALEXA GRASSO VS ROSE NAMAJUNAS": {
    odds: { red: 48, blue: 52 },
    fighters: { red: 45, blue: 55 },
    sentiment: { red: 52, blue: 48 },
  },
  "UMAR NURMAGOMEDOV VS DEIVESON FIGUEIREDO": {
    odds: { red: 70, blue: 30 },
    fighters: { red: 65, blue: 35 },
    sentiment: { red: 68, blue: 32 },
  },
  "ATEBA GAUTIER VS ANDREY PULYAEV": {
    odds: { red: 55, blue: 45 },
    fighters: { red: 50, blue: 50 },
    sentiment: { red: 58, blue: 42 },
  },
  "ALEXANDER VOLKANOVSKI VS DIEGO LOPES": {
    odds: { red: 58, blue: 42 },
    fighters: { red: 62, blue: 38 },
    sentiment: { red: 55, blue: 45 },
  },
};

const TYPE_LABELS: Record<string, string> = {
  odds: "ODDS BREAKDOWN",
  fighters: "FIGHTER STATS",
  sentiment: "FAN SENTIMENT",
};

const TYPE_COLORS: Record<string, { gradient: string; accent: string }> = {
  odds: { gradient: "from-amber-500 to-orange-600", accent: "text-amber-400" },
  fighters: { gradient: "from-blue-500 to-indigo-600", accent: "text-blue-400" },
  sentiment: { gradient: "from-purple-500 to-pink-600", accent: "text-purple-400" },
};

export const AnalysisInfographic = ({
  type,
  fighterA,
  fighterB,
  data: providedData,
}: AnalysisInfographicProps) => {
  // Get data from provided prop or default fight data
  const fightKey = `${fighterA} VS ${fighterB}`;
  const fightData = FIGHT_ANALYSIS_DATA[fightKey];
  
  const data = useMemo(() => {
    if (providedData) return providedData;
    if (fightData) return fightData[type];
    // Fallback default
    return { red: 50, blue: 50 };
  }, [providedData, fightData, type]);

  const label = TYPE_LABELS[type];
  const colors = TYPE_COLORS[type];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Card Container */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border border-gray-800 overflow-hidden">
        {/* Background Glow */}
        <div 
          className={`absolute inset-0 opacity-10 bg-gradient-to-r ${colors.gradient}`}
          style={{ filter: "blur(40px)" }}
        />
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <h3 className={`text-sm font-bold tracking-widest ${colors.accent}`}>
            {label}
          </h3>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              {fighterA.split(" ").pop()}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              {fighterB.split(" ").pop()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10">
          {/* Fighter Names */}
          <div className="flex justify-between mb-2">
            <span className="text-red-400 font-bold text-lg">{data.red}%</span>
            <span className="text-blue-400 font-bold text-lg">{data.blue}%</span>
          </div>
          
          {/* Bar Container */}
          <div className="relative h-12 bg-gray-800/50 rounded-xl overflow-hidden">
            {/* Red Bar (Left) */}
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-700 ease-out"
              style={{ width: `${data.red}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Blue Bar (Right) */}
            <div
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-blue-600 to-blue-500 transition-all duration-700 ease-out"
              style={{ width: `${data.blue}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Center Divider */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/20 transform -translate-x-1/2 z-10" />
          </div>

          {/* Fighter Labels */}
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-400 truncate max-w-[45%]">{fighterA}</span>
            <span className="text-gray-400 truncate max-w-[45%] text-right">{fighterB}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisInfographic;

