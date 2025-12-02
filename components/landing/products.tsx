"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { getPresetStyles } from "@/config/ufc-font";

// Fighter profile data - 5 templates
const fighterProfiles = [
  {
    id: 1,
    ranking: "#3 Bantamweight Division",
    status: "Active",
    nickname: "NO MERCY",
    name: "PETR YAN",
    division: "Bantamweight Division",
    record: "19-5-0 (W-L-D)",
    stats: {
      knockouts: 7,
      submissions: 1,
      firstRoundFinishes: 3,
    },
    image: "/images/fighters/fighter-324.png",
  },
  {
    id: 2,
    ranking: "#1 Featherweight Division",
    status: "Champion",
    nickname: "THE GREAT",
    name: "ALEXANDER VOLKANOVSKI",
    division: "Featherweight Division",
    record: "26-4-0 (W-L-D)",
    stats: {
      knockouts: 13,
      submissions: 3,
      firstRoundFinishes: 5,
    },
    image: "/images/fighters/fighter-volkanovski.png",
  },
  {
    id: 3,
    ranking: "#4 Featherweight Division",
    status: "Active",
    nickname: "TAINHA",
    name: "DIEGO LOPES",
    division: "Featherweight Division",
    record: "27-6-0 (W-L-D)",
    stats: {
      knockouts: 6,
      submissions: 15,
      firstRoundFinishes: 8,
    },
    image: "/images/fighters/fighter-lopes.png",
  },
  {
    id: 4,
    ranking: "#2 Lightweight Division",
    status: "Active",
    nickname: "THE HIGHLIGHT",
    name: "JUSTIN GAETHJE",
    division: "Lightweight Division",
    record: "25-5-0 (W-L-D)",
    stats: {
      knockouts: 20,
      submissions: 0,
      firstRoundFinishes: 12,
    },
    image: "/images/fighters/fighter-325.png",
  },
  {
    id: 5,
    ranking: "#8 Welterweight Division",
    status: "Active",
    nickname: "BORZ",
    name: "KHAMZAT CHIMAEV",
    division: "Welterweight Division",
    record: "14-0-0 (W-L-D)",
    stats: {
      knockouts: 6,
      submissions: 6,
      firstRoundFinishes: 10,
    },
    image: "/images/fighters/fighter-324.png",
  },
];

// Standard product sections
const products = [
  {
    title: "Live Odds. Real Edge",
    description: "We stream real-time prices from multiple sportsbooks and regional markets, convert every line into implied probabilities, and expose the hidden overround",
    subdescription: "Our engine flags line moves, cross-book discrepancies, and mispriced underdogs the moment they appear. So you always know where the value is for upcoming bouts",
    image: "/images/products/fighter-faceoff-odds.png",
    type: "image",
    darkTheme: true,
    gradientConfig: {
      direction: "left",
      intensity: 0.9,
    }
  },
  {
    title: "Global News. Decoded",
    description: "A multilingual media sweep tracks camp updates, injuries, weight-cut notes, travel issues, expert picks, and local press sentiment from each fighter's home market",
    subdescription: "We translate the noise into a live sentiment score and fuse it with odds and history. Delivering a single, confidence-rated call on who's likelier to win (and when to pass)",
    image: "/images/products/fighter-press-conference.png",
    type: "image",
    darkTheme: true,
    gradientConfig: {
      direction: "left",
      intensity: 0.85,
      softEdge: true,
    }
  },
];

// Fighter Stats Component
const StatBlock = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center text-center">
    <span 
      className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-none"
      style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
    >
      {value}
    </span>
    <div className="w-10 h-1 bg-[#d20a0a] mt-2 mb-2" />
    <span 
      className="text-[10px] md:text-xs uppercase tracking-wider text-gray-300 font-medium whitespace-nowrap"
      style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
    >
      {label}
    </span>
  </div>
);

// Fighter Profile Card Component
const FighterProfileCard = ({ 
  fighter, 
  isActive 
}: { 
  fighter: typeof fighterProfiles[0];
  isActive: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex"
    >
      {/* Left Content Section */}
      <div className="relative z-20 w-full lg:w-[55%] xl:w-[50%] flex flex-col justify-center px-6 md:px-10 lg:px-16 py-12 lg:py-0">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          <span 
            className="inline-block px-3 py-1 text-xs md:text-sm font-medium text-gray-200 bg-[#2a2a2a] rounded"
            style={{ fontFamily: '"UFC Sans", Arial, sans-serif' }}
          >
            {fighter.ranking}
          </span>
          <span 
            className="inline-block px-3 py-1 text-xs md:text-sm font-medium text-gray-200 bg-[#2a2a2a] rounded"
            style={{ fontFamily: '"UFC Sans", Arial, sans-serif' }}
          >
            {fighter.status}
          </span>
        </div>

        {/* Nickname */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl italic text-[#d4af37] mb-2 md:mb-4 font-bold tracking-wide"
          style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
        >
          &ldquo;{fighter.nickname}&rdquo;
        </motion.p>

        {/* Fighter Name */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-none mb-4 md:mb-6 uppercase tracking-tight"
          style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
        >
          {fighter.name}
        </motion.h2>

        {/* Division and Record */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 md:mb-10 lg:mb-12"
        >
          <p 
            className="text-base md:text-lg lg:text-xl text-white font-semibold mb-1"
            style={{ fontFamily: '"UFC Sans", Arial, sans-serif' }}
          >
            {fighter.division}
          </p>
          <p 
            className="text-base md:text-lg lg:text-xl text-white font-bold"
            style={{ fontFamily: '"UFC Sans", Arial, sans-serif' }}
          >
            {fighter.record}
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-start gap-4 md:gap-6 lg:gap-10"
        >
          <StatBlock value={fighter.stats.knockouts} label="WINS BY KNOCKOUT" />
          <div className="w-px h-20 md:h-24 bg-gray-600 self-center" />
          <StatBlock value={fighter.stats.submissions} label="WINS BY SUBMISSION" />
          <div className="w-px h-20 md:h-24 bg-gray-600 self-center" />
          <StatBlock value={fighter.stats.firstRoundFinishes} label="FIRST ROUND FINISHES" />
        </motion.div>
      </div>

      {/* Right Image Section */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[55%] xl:w-[60%]">
        <div className="relative w-full h-full">
          <Image
            src={fighter.image}
            alt={fighter.name}
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          {/* Gradient overlay from left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1c] via-[#1c1c1c]/70 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay for fighter carousel
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % fighterProfiles.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  // Helper function to generate gradient CSS
  const getGradientStyle = (config: { direction: string; intensity: number; softEdge?: boolean }, bgColor: string = '#0a0a0a') => {
    const intensity = config.intensity;
    const softEdge = config.softEdge || false;
    
    // CSS variables for configurability
    const gradientStyles = {
      '--gradient-intensity': intensity.toString(),
      '--gradient-bg-color': bgColor,
    } as React.CSSProperties;

    // Define gradient stops based on whether it's a soft edge or standard gradient
    let gradientStops: string;
    
    if (softEdge) {
      // Soft edge: more gradual fade with extended transparent area
      gradientStops = `from-[var(--gradient-bg-color)] via-[rgba(10,10,10,${intensity * 0.6})] to-transparent`;
    } else {
      // Standard gradient: stronger overlay
      gradientStops = `from-[var(--gradient-bg-color)] via-[rgba(10,10,10,${intensity * 0.8})] lg:via-[rgba(10,10,10,${intensity * 0.6})] to-transparent`;
    }

    return { gradientStyles, gradientStops };
  };

  return (
    <section id="products" className="relative">
      {/* First Product - Live Odds */}
      <div
        className="relative bg-[#0a0a0a] min-h-screen flex items-center overflow-hidden"
      >
        {/* Fullscreen Image */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-0 right-0 bottom-0 w-full lg:w-[55%] xl:w-[50%] h-full"
        >
          <div className="relative w-full h-full">
            <Image
              src={products[0].image}
              alt={`${products[0].title} demonstration`}
              fill
              className="object-cover object-center"
              loading="eager"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            
            {/* Gradient overlay */}
            {(() => {
              const { gradientStyles, gradientStops } = getGradientStyle(products[0].gradientConfig!);
              return (
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${gradientStops} pointer-events-none`}
                  style={gradientStyles}
                />
              );
            })()}
          </div>
        </motion.div>

        {/* Content Container */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              <div className="lg:w-[55%] xl:w-[50%] space-y-6 lg:space-y-8 py-16 lg:py-24">
                <div className="space-y-6">
                  <h3 
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                    style={{ 
                      color: '#ffffff',
                      fontFamily: ufcHeadingFont
                    }}
                  >
                    {products[0].title}
                  </h3>
                  
                  <div className="space-y-4">
                    <p 
                      className="text-base md:text-lg lg:text-xl leading-relaxed text-white"
                      style={{ fontFamily: ufcHeadingFont }}
                    >
                      {products[0].description}
                    </p>
                    
                    <p 
                      className="text-base md:text-lg lg:text-xl leading-relaxed text-white"
                      style={{ fontFamily: ufcHeadingFont }}
                    >
                      {products[0].subdescription}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fighter Profile Section - "Every Round. Every Pattern" */}
      <div className="relative bg-[#1c1c1c] min-h-screen overflow-hidden">
        {/* Section Header */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-8 md:pt-12 lg:pt-16 px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            <h3 
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: ufcHeadingFont }}
            >
              Every Round. Every Pattern
            </h3>
            <p 
              className="text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl"
              style={{ fontFamily: ufcHeadingFont }}
            >
              Fighter history rebuilt into prediction fuel: opponent quality, style matchups, pace, and finishing threats
            </p>
          </motion.div>
        </div>

        {/* Fighter Cards Container */}
        <div className="relative h-screen min-h-[700px] md:min-h-[750px] lg:min-h-[800px]">
          <AnimatePresence mode="wait">
            {fighterProfiles.map((fighter, index) => (
              index === activeIndex && (
                <FighterProfileCard
                  key={fighter.id}
                  fighter={fighter}
                  isActive={index === activeIndex}
                />
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
          {fighterProfiles.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-[#d20a0a] w-8"
                  : "bg-gray-500 hover:bg-gray-400"
              }`}
              aria-label={`View fighter ${index + 1}`}
              tabIndex={0}
            />
          ))}
        </div>
      </div>

      {/* Third Product - Global News */}
      <div
        className="relative bg-[#0a0a0a] min-h-screen flex items-center overflow-hidden"
      >
        {/* Fullscreen Image */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-0 right-0 bottom-0 w-full lg:w-[55%] xl:w-[50%] h-full"
        >
          <div className="relative w-full h-full">
            <Image
              src={products[1].image}
              alt={`${products[1].title} demonstration`}
              fill
              className="object-cover object-center"
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            
            {/* Gradient overlay */}
            {(() => {
              const { gradientStyles, gradientStops } = getGradientStyle(products[1].gradientConfig!);
              return (
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${gradientStops} pointer-events-none`}
                  style={gradientStyles}
                />
              );
            })()}
          </div>
        </motion.div>

        {/* Content Container */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              <div className="lg:w-[55%] xl:w-[50%] space-y-6 lg:space-y-8 py-16 lg:py-24">
                <div className="space-y-6">
                  <h3 
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                    style={{ 
                      color: '#ffffff',
                      fontFamily: ufcHeadingFont
                    }}
                  >
                    {products[1].title}
                  </h3>
                  
                  <div className="space-y-4">
                    <p 
                      className="text-base md:text-lg lg:text-xl leading-relaxed text-white"
                      style={{ fontFamily: ufcHeadingFont }}
                    >
                      {products[1].description}
                    </p>
                    
                    <p 
                      className="text-base md:text-lg lg:text-xl leading-relaxed text-white"
                      style={{ fontFamily: ufcHeadingFont }}
                    >
                      {products[1].subdescription}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
