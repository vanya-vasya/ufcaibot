"use client";

import Image from "next/image";
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

// Placeholder fight cards data
const fightCards: FightCard[] = [
  {
    id: 1,
    fighter1Name: "Gaethje",
    fighter2Name: "Pimblett",
    title: "GAETHJE VS PIMBLETT",
    datetime: "Sun, Jan 25 / 6:00 AM GMT+4 / Main Card",
    venue: "T-Mobile Arena",
    location: "Las Vegas, NV United States",
    fighter1Image: "/images/fighters/fighter-324.png",
    fighter2Image: "/images/fighters/fighter-325.png",
    eventNumber: "324",
  },
  {
    id: 2,
    fighter1Name: "Fighter 1",
    fighter2Name: "Fighter 2",
    title: "TODO: INSERT PROVIDED TEXT",
    datetime: "TODO: Date / Time / Card Type",
    venue: "TODO: Venue Name",
    location: "TODO: City, State Country",
    fighter1Image: "/images/fighters/fighter-324.png",
    fighter2Image: "/images/fighters/fighter-325.png",
    eventNumber: "325",
  },
];

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
const FightCardItem = ({ card, showEventNumber }: { card: FightCard; showEventNumber: boolean }) => {
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';

  return (
    <div className="flex items-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 py-4 relative">
      {/* Event number - big on left/right */}
      {showEventNumber && (
        <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-16 sm:w-20 md:w-24 lg:w-28">
          <span
            className="text-black font-bold"
            style={{
              fontFamily: ufcHeadingFont,
              fontSize: "4rem",
              lineHeight: lineHeights.none,
              letterSpacing: letterSpacing.tight,
            }}
          >
            {card.eventNumber}
          </span>
        </div>
      )}

      {/* Left side - Two fighter images */}
      <div className={`flex items-center gap-1 sm:gap-2 shrink-0 ${showEventNumber ? 'ml-16 sm:ml-20 md:ml-24 lg:ml-28' : ''}`}>
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
      aria-label="Upcoming UFC Fights"
    >
      {/* Container */}
      <div className="relative w-full h-[100px] sm:h-[120px] md:h-[150px] lg:h-[180px]">
        {/* Content wrapper */}
        <div className="absolute inset-0 flex items-center">
          {/* Fight cards container */}
          <div className="flex-1 h-full flex items-center bg-white overflow-hidden">
            {/* Left fight card */}
            <div className="flex-1 h-full flex items-center border-r border-gray-200 relative">
              <FightCardItem card={fightCards[0]} showEventNumber={true} />
            </div>

            {/* Right fight card */}
            <div className="flex-1 h-full flex items-center relative">
              <FightCardItem card={fightCards[1]} showEventNumber={true} />
            </div>
          </div>
        </div>

        {/* UP NEXT label - small, positioned at top */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
          <span
            className="text-black font-bold text-xs sm:text-sm"
            style={{
              fontFamily: ufcHeadingFont,
              fontWeight: fontWeights.bold,
              fontSize: fontSizes.xs.value,
              lineHeight: lineHeights.snug,
              letterSpacing: letterSpacing.wide,
              textTransform: "uppercase",
            }}
          >
            UP NEXT
          </span>
        </div>
      </div>
    </section>
  );
};

export default Features;
