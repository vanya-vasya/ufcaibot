"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getPresetStyles, fontSizes, getBreakpoint } from "@/config/ufc-font";

const Hero = () => {
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';
  const heroHeadingStyles = getPresetStyles('heroHeading');
  const heroSubheadingStyles = getPresetStyles('heroSubheading');
  const buttonStyles = getPresetStyles('buttonLarge');

  return (
    <section 
      id="home" 
      className="relative overflow-hidden"
    >
      {/* Background Image - Fullscreen with proper object-fit */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/products/octagon-arena.webp"
          alt="UFC Octagon Arena Background"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={90}
        />
        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 pointer-events-none"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center justify-center content-wrapper">
        <div className="hero-text-container mx-auto max-w-7xl px-3 lg:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center ufc-italic-heading"
            style={{
              ...heroHeadingStyles,
              color: 'white',
              marginBottom: '1rem',
              fontFamily: ufcHeadingFont,
              fontStyle: 'italic',
              fontWeight: 700,
            }}
          >
            AI ENGINE BUILT FOR <br />
            <span style={{ color: 'white' }}>
            FIGHTERS
            </span>
          </motion.h1>
        </div>
      </div>

      <style jsx>{`
        section {
          /* Full viewport height minus header (approximately 70px) */
          min-height: 100vh;
          height: 100vh;
          /* Ensure no overlap - add bottom spacing */
          margin-bottom: 0;
        }

        .content-wrapper {
          /* Push content down from center */
          padding-top: 20vh;
        }

        .hero-text-container {
          /* Center text container */
          width: 100%;
          text-align: center;
        }

        .ufc-italic-heading {
          font-family: ${ufcHeadingFont} !important;
          font-style: italic !important;
          font-weight: 700 !important;
          /* UFC brand oblique angle - matches official UFC typography */
          transform: skewX(-8deg);
          letter-spacing: 0.02em;
        }

        h1 {
          font-size: ${fontSizes['2xl'].value};
        }

        /* Responsive font sizes */
        @media (min-width: 640px) {
          h1 {
            font-size: ${fontSizes['4xl'].value};
          }
        }

        ${getBreakpoint('sm')} {
          h1 {
            font-size: ${fontSizes['5xl'].value};
          }
        }

        @media (min-width: 1024px) {
          h1 {
            font-size: ${fontSizes['6xl'].value};
          }
        }

        /* Laptop-specific breakpoints for consistent display */
        @media (min-width: 1366px) and (max-height: 768px) {
          section {
            height: 100vh;
          }
        }

        @media (min-width: 1440px) and (max-height: 900px) {
          section {
            height: 100vh;
          }
        }

        @media (min-width: 1536px) and (max-height: 864px) {
          section {
            height: 100vh;
          }
        }

        /* Mobile adjustments */
        @media (max-width: 767px) {
          section {
            min-height: 100vh;
            height: auto;
          }
          .content-wrapper {
            padding-top: 18vh;
          }
        }

        /* Tablet adjustments */
        @media (min-width: 768px) and (max-width: 1023px) {
          section {
            min-height: 100vh;
          }
          .content-wrapper {
            padding-top: 19vh;
          }
        }

        /* Desktop adjustments */
        @media (min-width: 1024px) {
          .content-wrapper {
            padding-top: 22vh;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;

