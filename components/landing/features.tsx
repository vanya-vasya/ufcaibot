"use client";

import Image from "next/image";
import Link from "next/link";
import { UPCOMING_EVENTS } from "@/data/fight-events";
import { fontSizes, fontWeights, lineHeights, letterSpacing } from "@/config/ufc-font";

// Fight card data type
type FightCard = {
  id: number;
  fighter1Name: string;
  fighter2Name: string;
  title: string;
  datetime: string;
  venue: string;
  location: string;
  fighter1Image: string;
  fighter2Image: string;
  eventNumber: string;
};

const lastName = (fullName: string) => fullName.trim().split(/\s+/).slice(-1)[0];

// Banner cards come from data/fight-events.ts: the first two upcoming events with a `banner`
const fightCards: FightCard[] = UPCOMING_EVENTS.filter((event) => event.banner)
  .slice(0, 2)
  .map((event, index) => {
    const banner = event.banner!;
    const mainEvent = event.fights[0];
    return {
      id: index + 1,
      fighter1Name: lastName(mainEvent.fighterA),
      fighter2Name: lastName(mainEvent.fighterB),
      title: `${lastName(mainEvent.fighterA)} VS ${lastName(mainEvent.fighterB)}`.toUpperCase(),
      datetime: banner.datetime,
      venue: banner.venue,
      location: banner.location,
      fighter1Image: banner.imageA,
      fighter2Image: banner.imageB,
      eventNumber: banner.eventNumber,
    };
  });

// Fighter image component
const FighterImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div
      className="relative w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 lg:w-32 lg:h-36 
                 rounded-sm overflow-hidden flex items-center justify-center bg-black"
      aria-label={`${alt} fighter photo`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
      />
    </div>
  );
};

// Single fight card component
const FightCardItem = ({ card, showEventNumber, showUpNext }: { card: FightCard; showEventNumber: boolean; showUpNext?: boolean }) => {
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';

  return (
    <div className="flex items-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 py-4 relative">
      {/* UFC Event number badge - styled like official UFC logo */}
      {showEventNumber && (
        <div className={`absolute left-0 top-0 bottom-0 flex items-center justify-center ${showUpNext ? 'w-32 sm:w-40 md:w-48 lg:w-56' : 'w-16 sm:w-20 md:w-24 lg:w-28'}`}>
          <div 
            className="flex flex-col items-center justify-center"
            style={{
              transform: "skewX(-8deg)",
            }}
          >
            {/* UFC Text */}
            <span
              className="text-black font-black tracking-tighter"
              style={{
                fontFamily: ufcHeadingFont,
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                lineHeight: "0.9",
                letterSpacing: "-0.02em",
                fontStyle: "italic",
              }}
            >
              MMA
            </span>
            {/* Event Number */}
            <span
              className="text-black font-black tracking-tighter"
              style={{
                fontFamily: ufcHeadingFont,
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                lineHeight: "1",
                letterSpacing: "-0.01em",
                fontStyle: "italic",
                marginTop: "-2px",
              }}
            >
              {card.eventNumber}
            </span>
          </div>
        </div>
      )}

      {/* Left side - Two fighter images */}
      <div className={`flex items-center gap-1 sm:gap-2 shrink-0 ${showEventNumber ? (showUpNext ? 'ml-32 sm:ml-40 md:ml-48 lg:ml-56' : 'ml-16 sm:ml-20 md:ml-24 lg:ml-28') : ''}`}>
        <FighterImage src={card.fighter1Image} alt={card.fighter1Name} />
        <FighterImage src={card.fighter2Image} alt={card.fighter2Name} />
      </div>

      {/* Right side - Text block */}
      <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
        <h3
          className="text-black font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-wide truncate"
          style={{
            fontFamily: ufcHeadingFont,
            fontWeight: fontWeights.bold,
            lineHeight: lineHeights.snug,
            letterSpacing: letterSpacing.normal,
            textTransform: "uppercase",
          }}
        >
          {card.title}
        </h3>
        <p
          className="text-black text-xs sm:text-sm truncate opacity-80"
          style={{
            fontFamily: ufcHeadingFont,
            fontWeight: fontWeights.normal,
            lineHeight: lineHeights.normal,
            letterSpacing: letterSpacing.normal,
          }}
        >
          {card.datetime}
        </p>
        <p
          className="text-black text-xs sm:text-sm truncate opacity-70"
          style={{
            fontFamily: ufcHeadingFont,
            fontWeight: fontWeights.normal,
            lineHeight: lineHeights.normal,
            letterSpacing: letterSpacing.normal,
          }}
        >
          {card.venue}
        </p>
        <p
          className="text-black text-xs sm:text-sm truncate opacity-70"
          style={{
            fontFamily: ufcHeadingFont,
            fontWeight: fontWeights.normal,
            lineHeight: lineHeights.normal,
            letterSpacing: letterSpacing.normal,
          }}
        >
          {card.location}
        </p>
      </div>
    </div>
  );
};

const Features = () => {
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';

  return (
    <section
      id="features"
      className="relative w-full bg-white"
      aria-label="Upcoming MMA Fights"
    >
      <Link href="/dashboard" className="block w-full">
        {/* Container */}
        <div className="relative w-full h-[100px] sm:h-[120px] md:h-[150px] lg:h-[180px] cursor-pointer">
          {/* Content wrapper */}
          <div className="absolute inset-0 flex items-center">
            {/* Fight cards container */}
            <div className="flex-1 h-full flex items-center bg-white overflow-hidden">
              {/* Left fight card */}
              <div className="flex-1 h-full flex items-center relative">
                {fightCards[0] && <FightCardItem card={fightCards[0]} showEventNumber={true} showUpNext={true} />}
              </div>

              {/* Right fight card */}
              <div className="flex-1 h-full flex items-center relative">
                {fightCards[1] && <FightCardItem card={fightCards[1]} showEventNumber={true} showUpNext={true} />}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default Features;
