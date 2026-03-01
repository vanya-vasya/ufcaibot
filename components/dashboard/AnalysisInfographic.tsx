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

// Default analysis data for UFC 326 fights (used when webhook doesn't provide structured data)
const FIGHT_ANALYSIS_DATA: Record<string, { odds: BarData; fighters: BarData; sentiment: BarData }> = {
  "MAX HOLLOWAY VS CHARLES OLIVEIRA": {
    odds: { red: 45, blue: 55 },
    fighters: { red: 48, blue: 52 },
    sentiment: { red: 52, blue: 48 },
  },
  "CODY GARBRANDT VS XIAO LONG": {
    odds: { red: 50, blue: 50 },
    fighters: { red: 48, blue: 52 },
    sentiment: { red: 52, blue: 48 },
  },
  "CAIO BORRALHO VS REINIER DE RIDDER": {
    odds: { red: 62, blue: 38 },
    fighters: { red: 60, blue: 40 },
    sentiment: { red: 58, blue: 42 },
  },
  "ROB FONT VS RAUL ROSAS JR.": {
    odds: { red: 40, blue: 60 },
    fighters: { red: 42, blue: 58 },
    sentiment: { red: 38, blue: 62 },
  },
  "GREGORY RODRIGUES VS BRUNNO FERREIRA": {
    odds: { red: 58, blue: 42 },
    fighters: { red: 60, blue: 40 },
    sentiment: { red: 55, blue: 45 },
  },
  "DREW DOBER VS MICHAEL JOHNSON": {
    odds: { red: 55, blue: 45 },
    fighters: { red: 52, blue: 48 },
    sentiment: { red: 50, blue: 50 },
  },
  "RICKY TURCIOS VS ALBERTO MONTES": {
    odds: { red: 65, blue: 35 },
    fighters: { red: 68, blue: 32 },
    sentiment: { red: 62, blue: 38 },
  },
  "DONTE JOHNSON VS DUŠKO TODOROVIĆ": {
    odds: { red: 45, blue: 55 },
    fighters: { red: 48, blue: 52 },
    sentiment: { red: 50, blue: 50 },
  },
  "CODY DURDEN VS NYAMJARGAL TUMENDEMBEREL": {
    odds: { red: 52, blue: 48 },
    fighters: { red: 50, blue: 50 },
    sentiment: { red: 55, blue: 45 },
  },
  "SUMUDAERJI VS JESUS AGUILAR": {
    odds: { red: 60, blue: 40 },
    fighters: { red: 58, blue: 42 },
    sentiment: { red: 62, blue: 38 },
  },
  "LUKE FERNANDEZ VS RODOLFO BELLATO": {
    odds: { red: 38, blue: 62 },
    fighters: { red: 40, blue: 60 },
    sentiment: { red: 42, blue: 58 },
  },
  "JOOSANG YOO VS GASTON BOLANOS": {
    odds: { red: 55, blue: 45 },
    fighters: { red: 52, blue: 48 },
    sentiment: { red: 58, blue: 42 },
  },
};

const TYPE_CONFIG: Record<
  string,
  { label: string; sublabel: string; accentClass: string; barColorA: string; barColorB: string }
> = {
  odds: {
    label: "ODDS BREAKDOWN",
    sublabel: "Implied win probability from betting lines",
    accentClass: "text-amber-400",
    barColorA: "from-red-700 to-red-500",
    barColorB: "from-blue-700 to-blue-500",
  },
  fighters: {
    label: "FIGHTER STATS",
    sublabel: "Win probability based on fighter metrics",
    accentClass: "text-blue-400",
    barColorA: "from-red-700 to-red-500",
    barColorB: "from-blue-700 to-blue-500",
  },
  sentiment: {
    label: "FAN SENTIMENT",
    sublabel: "Community prediction & fan vote",
    accentClass: "text-purple-400",
    barColorA: "from-red-700 to-red-500",
    barColorB: "from-blue-700 to-blue-500",
  },
};

export const AnalysisInfographic = ({
  type,
  fighterA,
  fighterB,
  data: providedData,
}: AnalysisInfographicProps) => {
  const fightKey = `${fighterA} VS ${fighterB}`;
  const fightData = FIGHT_ANALYSIS_DATA[fightKey];

  const data = useMemo(() => {
    if (providedData) return providedData;
    if (fightData) return fightData[type];
    return { red: 50, blue: 50 };
  }, [providedData, fightData, type]);

  const config = TYPE_CONFIG[type];
  const favoredA = data.red >= data.blue;
  const isTie = data.red === data.blue;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative bg-gradient-to-b from-gray-950 to-black rounded-2xl border border-gray-800 overflow-hidden">

        {/* Type Banner */}
        <div className="bg-gray-900/80 border-b border-gray-800 px-6 py-2.5 flex items-center justify-between">
          <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${config.accentClass}`}>
            {config.label}
          </span>
          <span className="text-[10px] text-gray-600 hidden sm:block">
            {config.sublabel}
          </span>
        </div>

        {/* Win Probability Header */}
        <div className="px-6 pt-1 pb-1">
          <p className="text-[10px] font-black tracking-[0.15em] text-white uppercase pt-4 pb-3">
            WIN PROBABILITY
          </p>
        </div>

        {/* Big Percentages */}
        <div className="px-6 pb-5">
          <div className="flex items-end justify-between gap-3 mb-5">
            {/* Fighter A */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-5xl sm:text-6xl font-black leading-none transition-colors ${
                  favoredA ? "text-red-400" : "text-gray-500"
                }`}
              >
                {data.red}%
              </p>
              <p className="text-xs text-gray-400 mt-2 truncate font-medium" style={{ fontFamily: "var(--font-ufc-heading)" }}>
                {fighterA}
              </p>
              {favoredA && !isTie && (
                <span className="inline-block mt-1.5 text-[9px] font-black tracking-widest text-red-500 uppercase bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5">
                  FAVORED
                </span>
              )}
            </div>

            {/* VS divider */}
            <div className="flex-shrink-0 pb-6">
              <span className="text-gray-700 font-black text-base">VS</span>
            </div>

            {/* Fighter B */}
            <div className="flex-1 min-w-0 text-right">
              <p
                className={`text-5xl sm:text-6xl font-black leading-none transition-colors ${
                  !favoredA ? "text-blue-400" : "text-gray-500"
                }`}
              >
                {data.blue}%
              </p>
              <p className="text-xs text-gray-400 mt-2 truncate font-medium text-right" style={{ fontFamily: "var(--font-ufc-heading)" }}>
                {fighterB}
              </p>
              {!favoredA && !isTie && (
                <div className="flex justify-end">
                  <span className="inline-block mt-1.5 text-[9px] font-black tracking-widest text-blue-500 uppercase bg-blue-500/10 border border-blue-500/20 rounded px-1.5 py-0.5">
                    FAVORED
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Split Bar — always fills 100%, no gray gaps */}
          <div className="flex h-3 rounded-full overflow-hidden">
            <div
              className={`bg-gradient-to-r ${config.barColorA} transition-all duration-700 ease-out`}
              style={{ width: `${data.red}%` }}
            />
            <div
              className={`bg-gradient-to-l ${config.barColorB} transition-all duration-700 ease-out flex-1`}
            />
          </div>

          {/* Percentage ticks */}
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] text-gray-700">0%</span>
            <span className="text-[9px] text-gray-700">50%</span>
            <span className="text-[9px] text-gray-700">100%</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-800 bg-gray-900/40 flex items-center justify-between">
          <span className="text-[10px] text-gray-600 uppercase tracking-widest">
            {isTie ? "Even matchup" : "Prediction"}
          </span>
          <span
            className={`text-xs font-bold truncate max-w-[60%] text-right ${
              isTie ? "text-gray-400" : favoredA ? "text-red-400" : "text-blue-400"
            }`}
            style={{ fontFamily: "var(--font-ufc-heading)" }}
          >
            {isTie ? "50 / 50" : favoredA ? fighterA : fighterB}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisInfographic;
