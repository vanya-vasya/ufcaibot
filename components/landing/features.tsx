"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// Fight card data type
type FightCard = {
  id: number;
  fighter1Name: string;
  fighter2Name: string;
  title: string;
  datetime: string;
  venue: string;
  location: string;
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
  },
  {
    id: 2,
    fighter1Name: "Fighter 1",
    fighter2Name: "Fighter 2",
    title: "TODO: INSERT PROVIDED TEXT",
    datetime: "TODO: Date / Time / Card Type",
    venue: "TODO: Venue Name",
    location: "TODO: City, State Country",
  },
];

// Fighter icon placeholder component
const FighterIconPlaceholder = ({ name }: { name: string }) => {
  return (
    <div
      className="relative w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 lg:w-32 lg:h-36 
                 bg-gradient-to-b from-gray-600 to-gray-800 rounded-sm overflow-hidden
                 flex items-end justify-center"
      aria-label={`${name} fighter photo placeholder`}
    >
      {/* Silhouette placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-20 sm:w-20 sm:h-24 bg-gray-500/30 rounded-full mt-4" />
      </div>
      {/* Fighter silhouette shape */}
      <div className="absolute bottom-0 w-full h-3/4 bg-gradient-to-t from-gray-700/80 to-transparent" />
    </div>
  );
};

// Single fight card component
const FightCardItem = ({ card }: { card: FightCard }) => {
  return (
    <div className="flex items-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 py-4">
      {/* Left side - Two fighter icons */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <FighterIconPlaceholder name={card.fighter1Name} />
        <FighterIconPlaceholder name={card.fighter2Name} />
      </div>

      {/* Right side - Text block */}
      <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
        <h3 className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-wide truncate">
          {card.title}
        </h3>
        <p className="text-gray-300 text-xs sm:text-sm truncate">
          {card.datetime}
        </p>
        <p className="text-gray-400 text-xs sm:text-sm truncate">
          {card.venue}
        </p>
        <p className="text-gray-400 text-xs sm:text-sm truncate">
          {card.location}
        </p>
      </div>
    </div>
  );
};

const Features = () => {
  const handlePrevClick = () => {
    // TODO: Implement carousel navigation
    console.log("Previous card");
  };

  const handleNextClick = () => {
    // TODO: Implement carousel navigation
    console.log("Next card");
  };

  return (
    <section
      id="features"
      className="relative w-full bg-gray-100"
      aria-label="Upcoming UFC Fights"
    >
      {/* Reduced height container - approximately 1/3 of original */}
      <div className="relative w-full h-[100px] sm:h-[120px] md:h-[150px] lg:h-[180px]">
        {/* Navigation arrows and content wrapper */}
        <div className="absolute inset-0 flex items-center">
          {/* Left navigation arrow */}
          <button
            onClick={handlePrevClick}
            className="shrink-0 w-8 sm:w-10 md:w-12 h-full flex items-center justify-center
                       bg-white hover:bg-gray-50 transition-colors border-r border-gray-200"
            aria-label="Previous fight card"
            tabIndex={0}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>

          {/* Fight cards container */}
          <div className="flex-1 h-full flex items-center bg-gradient-to-r from-gray-200 to-gray-300 overflow-hidden">
            {/* Left fight card */}
            <div className="flex-1 h-full flex items-center border-r border-gray-300/50">
              <FightCardItem card={fightCards[0]} />
            </div>

            {/* Right fight card (same layout - copy) */}
            <div className="flex-1 h-full flex items-center">
              <FightCardItem card={fightCards[1]} />
            </div>
          </div>

          {/* Right navigation arrow */}
          <button
            onClick={handleNextClick}
            className="shrink-0 w-8 sm:w-10 md:w-12 h-full flex items-center justify-center
                       bg-white hover:bg-gray-50 transition-colors border-l border-gray-200"
            aria-label="Next fight card"
            tabIndex={0}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
