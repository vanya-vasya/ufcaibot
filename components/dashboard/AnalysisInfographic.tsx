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
  // UFC Fight Night: Emmett vs Vallejos
  "JOSH EMMETT VS KEVIN VALLEJOS": {
    odds: { red: 42, blue: 58 },
    fighters: { red: 40, blue: 60 },
    sentiment: { red: 38, blue: 62 },
  },
  "AMANDA LEMOS VS GILLIAN ROBERTSON": {
    odds: { red: 55, blue: 45 },
    fighters: { red: 58, blue: 42 },
    sentiment: { red: 52, blue: 48 },
  },
  "ION CUTELABA VS OUMAR SY": {
    odds: { red: 40, blue: 60 },
    fighters: { red: 42, blue: 58 },
    sentiment: { red: 38, blue: 62 },
  },
  "BOLAJI OKI VS MANOEL SOUSA": {
    odds: { red: 65, blue: 35 },
    fighters: { red: 62, blue: 38 },
    sentiment: { red: 60, blue: 40 },
  },
  "MARWAN RAHIKI VS HARRY HARDWICK": {
    odds: { red: 38, blue: 62 },
    fighters: { red: 35, blue: 65 },
    sentiment: { red: 40, blue: 60 },
  },
  "CHARLES JOHNSON VS BRUNO SILVA": {
    odds: { red: 45, blue: 55 },
    fighters: { red: 48, blue: 52 },
    sentiment: { red: 42, blue: 58 },
  },
  "ANDRE FILI VS JOSE MIGUEL DELGADO": {
    odds: { red: 60, blue: 40 },
    fighters: { red: 62, blue: 38 },
    sentiment: { red: 58, blue: 42 },
  },
  "VITOR PETRINO VS STEVEN ASPLUND": {
    odds: { red: 65, blue: 35 },
    fighters: { red: 68, blue: 32 },
    sentiment: { red: 62, blue: 38 },
  },
  "PIERA RODRIGUEZ VS SAM HUGHES": {
    odds: { red: 58, blue: 42 },
    fighters: { red: 55, blue: 45 },
    sentiment: { red: 60, blue: 40 },
  },
  "ELIJAH SMITH VS SUYOUNG YOU": {
    odds: { red: 40, blue: 60 },
    fighters: { red: 38, blue: 62 },
    sentiment: { red: 42, blue: 58 },
  },
  "LUAN LACERDA VS HECHER SOSA": {
    odds: { red: 70, blue: 30 },
    fighters: { red: 72, blue: 28 },
    sentiment: { red: 68, blue: 32 },
  },
  "BIA MESQUITA VS MONTSE RENDON": {
    odds: { red: 45, blue: 55 },
    fighters: { red: 42, blue: 58 },
    sentiment: { red: 48, blue: 52 },
  },
};

const TYPE_CONFIG: Record<string, { label: string; sublabel: string; accentClass: string }> = {
  odds: {
    label: "ODDS BREAKDOWN",
    sublabel: "Implied win probability from betting lines",
    accentClass: "text-amber-400",
  },
  fighters: {
    label: "FIGHTER STATS",
    sublabel: "Win probability based on fighter metrics",
    accentClass: "text-blue-400",
  },
  sentiment: {
    label: "FAN SENTIMENT",
    sublabel: "Community prediction & fan vote",
    accentClass: "text-purple-400",
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
  const favoredA = data.red > data.blue;
  const favoredB = data.blue > data.red;
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

        {/* Fighter names + FAVORED badges */}
        <div className="px-6 pt-6 pb-6">
          <p className="text-[10px] font-black tracking-[0.15em] text-white uppercase mb-5">
            WIN PREDICTION
          </p>

          <div className="flex items-center justify-between gap-4">
            {/* Fighter A */}
            <div className={`flex-1 min-w-0 flex flex-col gap-2 transition-opacity duration-300 ${favoredB ? "opacity-30" : "opacity-100"}`}>
              <p
                className={`text-lg sm:text-xl font-black leading-tight ${
                  favoredA ? "text-red-400" : "text-gray-500"
                }`}
                style={{ fontFamily: "var(--font-ufc-heading)" }}
              >
                {fighterA}
              </p>
              {favoredA && (
                <span className="inline-block self-start text-[9px] font-black tracking-widest text-red-500 uppercase bg-red-500/10 border border-red-500/30 rounded px-2 py-0.5">
                  FAVORED
                </span>
              )}
              {isTie && (
                <span className="inline-block self-start text-[9px] font-black tracking-widest text-gray-500 uppercase bg-gray-500/10 border border-gray-500/20 rounded px-2 py-0.5">
                  EVEN
                </span>
              )}
            </div>

            {/* VS divider */}
            <div className="flex-shrink-0">
              <span className="text-gray-700 font-black text-sm">VS</span>
            </div>

            {/* Fighter B */}
            <div className={`flex-1 min-w-0 flex flex-col items-end gap-2 transition-opacity duration-300 ${favoredA ? "opacity-30" : "opacity-100"}`}>
              <p
                className={`text-lg sm:text-xl font-black leading-tight text-right ${
                  favoredB ? "text-blue-400" : "text-gray-500"
                }`}
                style={{ fontFamily: "var(--font-ufc-heading)" }}
              >
                {fighterB}
              </p>
              {favoredB && (
                <span className="inline-block self-end text-[9px] font-black tracking-widest text-blue-500 uppercase bg-blue-500/10 border border-blue-500/30 rounded px-2 py-0.5">
                  FAVORED
                </span>
              )}
              {isTie && (
                <span className="inline-block self-end text-[9px] font-black tracking-widest text-gray-500 uppercase bg-gray-500/10 border border-gray-500/20 rounded px-2 py-0.5">
                  EVEN
                </span>
              )}
            </div>
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
            {isTie ? "EVEN MATCHUP" : favoredA ? fighterA : fighterB}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisInfographic;
