"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import Link from "next/link";
import { getPresetStyles } from "@/config/ufc-font";

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
    title: "Every Round. Every Pattern", 
    description: "We rebuild fighter history into prediction fuel: opponent quality, style matchups, pace, strike differential, takedown and control metrics, durability, and finishing threats",
    subdescription: "Round-by-round performance and cardio trends reveal how fighters behave across a full fight, not just highlights. So matchup edges become clear before you commit",
    image: "/images/products/fighters-team-lineup.png",
    type: "image",
    darkTheme: true,
    gradientConfig: {
      direction: "right",
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

const Products = () => {
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';
  const sectionHeadingStyles = getPresetStyles('h2');
  const productTitleStyles = getPresetStyles('productTitle');

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
      const intensityPercent = Math.round(intensity * 100);
      gradientStops = `from-[var(--gradient-bg-color)] via-[rgba(10,10,10,${intensity * 0.6})] to-transparent`;
    } else {
      // Standard gradient: stronger overlay
      gradientStops = `from-[var(--gradient-bg-color)] via-[rgba(10,10,10,${intensity * 0.8})] lg:via-[rgba(10,10,10,${intensity * 0.6})] to-transparent`;
    }

    return { gradientStyles, gradientStops };
  };

  return (
    <section id="products" className="relative">
      {products.map((product, index) => {
        const isDarkTheme = product.darkTheme;
        const isAlternate = index % 2 === 1;
        const gradientConfig = product.gradientConfig;
        
        return (
          <div
            key={product.title}
            className={`
              relative
              ${isDarkTheme ? 'bg-[#0a0a0a]' : 'bg-white'}
              ${isDarkTheme ? 'min-h-screen' : 'py-16 md:py-24 lg:py-32'}
              ${isDarkTheme ? 'flex items-center' : ''}
              overflow-hidden
            `}
          >
            {/* Fullscreen Image (only for dark theme) */}
            {isDarkTheme && gradientConfig && (
              <motion.div
                initial={{ opacity: 0, x: gradientConfig.direction === 'left' ? 100 : -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`absolute top-0 ${gradientConfig.direction === 'left' ? 'right-0' : 'left-0'} bottom-0 w-full lg:w-[55%] xl:w-[50%] h-full`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={product.image}
                    alt={`${product.title} demonstration`}
                    fill
                    className="object-cover object-center"
                    loading={index === 0 ? "eager" : "lazy"}
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  
                  {/* Configurable gradient overlay */}
                  {(() => {
                    const { gradientStyles, gradientStops } = getGradientStyle(gradientConfig);
                    const gradientDirection = gradientConfig.direction === 'left' ? 'bg-gradient-to-r' : 'bg-gradient-to-l';
                    
                    return (
                      <div 
                        className={`absolute inset-0 ${gradientDirection} ${gradientStops} pointer-events-none`}
                        style={gradientStyles}
                      ></div>
                    );
                  })()}
                </div>
              </motion.div>
            )}

            {/* Content Container */}
            <div className={`${isDarkTheme ? 'relative z-10 w-full' : ''} ${isDarkTheme ? '' : 'container mx-auto px-4'}`}>
              {isDarkTheme ? (
                // Dark theme layout
                <div className="container mx-auto px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`max-w-7xl mx-auto ${index === 0 || index === 2 ? '' : 'flex justify-end'}`}
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
                          {product.title}
                        </h3>
                        
                        <div className="space-y-4">
                          <p 
                            className="text-base md:text-lg lg:text-xl leading-relaxed text-white"
                            style={{ fontFamily: ufcHeadingFont }}
                          >
                            {product.description}
                          </p>
                          
                          {product.subdescription && (
                            <p 
                              className="text-base md:text-lg lg:text-xl leading-relaxed text-white"
                              style={{ fontFamily: ufcHeadingFont }}
                            >
                              {product.subdescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                // Light theme - original layout
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`
                    max-w-7xl mx-auto
                    grid grid-cols-1 lg:grid-cols-2 
                    gap-12 lg:gap-16 xl:gap-24 
                    items-center
                    ${isAlternate ? 'lg:grid-flow-dense' : ''}
                  `}
                >
                  {/* Text content */}
                  <div className={`space-y-6 lg:space-y-8 ${isAlternate ? 'lg:col-start-2' : ''}`}>
                    <div className="space-y-6">
                      <h3 
                        className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                        style={{ 
                          color: '#000000',
                          fontFamily: ufcHeadingFont
                        }}
                      >
                        {product.title}
                      </h3>
                      
                      <div className="space-y-4">
                        <p 
                          className="text-base md:text-lg lg:text-xl leading-relaxed text-slate-600"
                          style={{ fontFamily: ufcHeadingFont }}
                        >
                          {product.description}
                        </p>
                        
                        {product.subdescription && (
                          <p 
                            className="text-base md:text-lg lg:text-xl leading-relaxed text-slate-600"
                            style={{ fontFamily: ufcHeadingFont }}
                          >
                            {product.subdescription}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image content */}
                  <div className={`${isAlternate ? 'lg:col-start-1' : ''}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl"
                    >
                      <Image
                        src={product.image}
                        alt={`${product.title} demonstration`}
                        width={700}
                        height={500}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Products;
