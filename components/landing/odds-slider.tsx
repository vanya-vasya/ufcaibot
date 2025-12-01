"use client";

import { fontSizes, fontWeights, lineHeights, letterSpacing } from "@/config/ufc-font";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Fighter odds data
 */
export interface FighterOdds {
  surname: string;
  odds: number; // American odds format (e.g., -150, +200)
}

/**
 * Fight odds entry
 */
export interface FightOdds {
  id: string;
  fighterA: FighterOdds;
  fighterB: FighterOdds;
  updatedAt: Date;
}

/**
 * Fighter status based on odds comparison
 */
export type FighterStatus = "favorite" | "underdog" | "even";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Determine fighter status based on odds comparison
 * Lower odds (more negative or less positive) = favorite
 * Higher odds = underdog
 * Equal odds = even
 */
export const getFighterStatus = (
  fighterOdds: number,
  opponentOdds: number
): FighterStatus => {
  if (fighterOdds === opponentOdds) {
    return "even";
  }
  // In American odds: -200 is more favored than -100, and -100 is more favored than +100
  // Lower algebraic value = more favored
  return fighterOdds < opponentOdds ? "favorite" : "underdog";
};

/**
 * Format odds for display with sign
 */
export const formatOdds = (odds: number): string => {
  return odds >= 0 ? `+${odds}` : `${odds}`;
};

/**
 * Format date with timezone awareness
 * Uses en-US locale with Asia/Tbilisi timezone as specified
 */
export const formatUpdatedAt = (date: Date): string => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tbilisi",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    // Fallback for invalid dates
    return "";
  }
};

/**
 * Get indicator symbol for fighter status
 */
export const getStatusIndicator = (status: FighterStatus): string => {
  switch (status) {
    case "favorite":
      return "▲";
    case "underdog":
      return "▼";
    case "even":
      return "=";
  }
};

// ============================================================================
// SAMPLE DATA
// ============================================================================

export const sampleOddsData: FightOdds[] = [
  {
    id: "fight-1",
    fighterA: { surname: "JONES", odds: -250 },
    fighterB: { surname: "MIOCIC", odds: +200 },
    updatedAt: new Date(),
  },
  {
    id: "fight-2",
    fighterA: { surname: "MAKHACHEV", odds: -180 },
    fighterB: { surname: "OLIVEIRA", odds: +155 },
    updatedAt: new Date(),
  },
  {
    id: "fight-3",
    fighterA: { surname: "PEREIRA", odds: -145 },
    fighterB: { surname: "PROCHAZKA", odds: +125 },
    updatedAt: new Date(),
  },
  {
    id: "fight-4",
    fighterA: { surname: "VOLKANOVSKI", odds: +110 },
    fighterB: { surname: "TOPURIA", odds: -130 },
    updatedAt: new Date(),
  },
  {
    id: "fight-5",
    fighterA: { surname: "ADESANYA", odds: -115 },
    fighterB: { surname: "STRICKLAND", odds: -105 },
    updatedAt: new Date(),
  },
  {
    id: "fight-6",
    fighterA: { surname: "PANTOJA", odds: -200 },
    fighterB: { surname: "ERCEG", odds: +170 },
    updatedAt: new Date(),
  },
  {
    id: "fight-7",
    fighterA: { surname: "GRASSO", odds: +100 },
    fighterB: { surname: "SHEVCHENKO", odds: +100 },
    updatedAt: new Date(),
  },
  {
    id: "fight-8",
    fighterA: { surname: "POIRIER", odds: +165 },
    fighterB: { surname: "GAETHJE", odds: -185 },
    updatedAt: new Date(),
  },
];

// ============================================================================
// FIGHT ODDS ITEM COMPONENT
// ============================================================================

interface FightOddsItemProps {
  fight: FightOdds;
}

const FightOddsItem = ({ fight }: FightOddsItemProps) => {
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';
  
  const fighterAStatus = getFighterStatus(fight.fighterA.odds, fight.fighterB.odds);
  const fighterBStatus = getFighterStatus(fight.fighterB.odds, fight.fighterA.odds);

  return (
    <span 
      className="odds-item"
      role="listitem"
      aria-label={`${fight.fighterA.surname} ${formatOdds(fight.fighterA.odds)} versus ${fight.fighterB.surname} ${formatOdds(fight.fighterB.odds)}`}
    >
      <span 
        className={`fighter-name ${fighterAStatus}`}
        style={{ fontFamily: ufcHeadingFont }}
        aria-label={`${fight.fighterA.surname}, ${fighterAStatus}`}
      >
        <span className="status-indicator" aria-hidden="true">
          {getStatusIndicator(fighterAStatus)}
        </span>
        {fight.fighterA.surname}
        <span className="fighter-odds">{formatOdds(fight.fighterA.odds)}</span>
      </span>
      <span className="vs-separator" aria-hidden="true">vs</span>
      <span 
        className={`fighter-name ${fighterBStatus}`}
        style={{ fontFamily: ufcHeadingFont }}
        aria-label={`${fight.fighterB.surname}, ${fighterBStatus}`}
      >
        <span className="status-indicator" aria-hidden="true">
          {getStatusIndicator(fighterBStatus)}
        </span>
        {fight.fighterB.surname}
        <span className="fighter-odds">{formatOdds(fight.fighterB.odds)}</span>
      </span>
      <span className="item-divider" aria-hidden="true">|</span>
    </span>
  );
};

// ============================================================================
// ODDS SLIDER COMPONENT
// ============================================================================

interface OddsSliderProps {
  oddsData?: FightOdds[];
}

const OddsSlider = ({ oddsData = sampleOddsData }: OddsSliderProps) => {
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';

  // Double the content for seamless infinite loop
  const duplicatedData = [...oddsData, ...oddsData];

  return (
    <section
      id="odds-slider"
      className="odds-slider-section"
      aria-label="Live betting odds ticker"
      role="region"
    >
      <div className="odds-slider-container">
        <div className="live-label" aria-hidden="true">
          <span className="live-dot"></span>
          LIVE
        </div>
        <div 
          className="marquee-wrapper" 
          role="list"
          aria-label="Current fight odds"
        >
          <div className="marquee-content">
            {duplicatedData.map((fight, index) => (
              <FightOddsItem key={`${fight.id}-${index}`} fight={fight} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .odds-slider-section {
          width: 100%;
          background-color: #000000;
          overflow: hidden;
        }

        .odds-slider-container {
          display: flex;
          align-items: center;
          max-width: 100%;
          margin: 0 auto;
          padding: 12px 0;
          position: relative;
        }

        .live-label {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 16px;
          font-family: ${ufcHeadingFont};
          font-weight: ${fontWeights.bold};
          font-size: ${fontSizes.sm.value};
          line-height: ${lineHeights.snug};
          letter-spacing: ${letterSpacing.wider};
          text-transform: uppercase;
          color: #ff3333;
          white-space: nowrap;
          flex-shrink: 0;
          z-index: 10;
          background: linear-gradient(90deg, #000000 80%, transparent);
          padding-right: 24px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background-color: #ff3333;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.85);
          }
        }

        .marquee-wrapper {
          flex: 1;
          overflow: hidden;
          mask-image: linear-gradient(
            90deg,
            transparent,
            black 2%,
            black 98%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent,
            black 2%,
            black 98%,
            transparent
          );
        }

        .marquee-content {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
          will-change: transform;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Pause animation on hover for desktop */
        @media (hover: hover) {
          .marquee-wrapper:hover .marquee-content {
            animation-play-state: paused;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .marquee-content {
            animation: none;
          }
          .live-dot {
            animation: none;
          }
        }

        /* Light mode support */
        @media (prefers-color-scheme: light) {
          .odds-slider-section {
            background-color: #000000;
          }
        }
      `}</style>

      <style jsx global>{`
        .odds-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          font-family: ${ufcHeadingFont};
          font-size: ${fontSizes.sm.value};
          line-height: ${lineHeights.snug};
          letter-spacing: ${letterSpacing.wide};
        }

        .fighter-name {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          text-transform: uppercase;
          transition: opacity 0.2s ease;
        }

        .fighter-name.favorite {
          color: #ffffff;
          font-weight: ${fontWeights.bold};
        }

        .fighter-name.underdog {
          color: #888888;
          font-weight: ${fontWeights.normal};
        }

        .fighter-name.even {
          color: #cccccc;
          font-weight: ${fontWeights.medium};
        }

        .status-indicator {
          font-size: 0.65em;
          margin-right: 2px;
        }

        .fighter-name.favorite .status-indicator {
          color: #4ade80;
        }

        .fighter-name.underdog .status-indicator {
          color: #f87171;
        }

        .fighter-name.even .status-indicator {
          color: #fbbf24;
        }

        .fighter-odds {
          margin-left: 4px;
          font-size: 0.9em;
          opacity: 0.9;
        }

        .fighter-name.favorite .fighter-odds {
          color: #4ade80;
        }

        .fighter-name.underdog .fighter-odds {
          color: #f87171;
        }

        .fighter-name.even .fighter-odds {
          color: #fbbf24;
        }

        .vs-separator {
          color: #666666;
          font-weight: ${fontWeights.normal};
          font-size: 0.85em;
          text-transform: lowercase;
          margin: 0 4px;
        }

        .item-divider {
          color: #333333;
          margin-left: 8px;
          font-weight: ${fontWeights.light};
        }

        /* High contrast mode */
        @media (prefers-contrast: more) {
          .fighter-name.favorite {
            color: #ffffff;
          }
          .fighter-name.underdog {
            color: #aaaaaa;
          }
          .fighter-name.even {
            color: #dddddd;
          }
          .vs-separator,
          .item-divider {
            color: #888888;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .odds-item {
            padding: 0 8px;
            font-size: ${fontSizes.xs.value};
          }
          .status-indicator {
            font-size: 0.6em;
          }
        }

        @media (min-width: 1024px) {
          .odds-item {
            padding: 0 16px;
            font-size: ${fontSizes.base.value};
          }
        }
      `}</style>
    </section>
  );
};

export default OddsSlider;

