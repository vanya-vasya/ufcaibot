"use client";

import { motion } from "framer-motion";
import { TrendingUp, Brain, Zap, Target } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Real-Time Analytics",
    description: "Live odds streaming and probability calculations from multiple sportsbooks worldwide.",
    accent: "#D20A0A",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Machine learning models trained on thousands of fights to predict outcomes.",
    accent: "#FFD700",
  },
  {
    icon: Target,
    title: "Precision Matchups",
    description: "Style analysis, reach advantages, and historical performance breakdowns.",
    accent: "#00D4FF",
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description: "Get notified when value bets appear or line movements signal opportunity.",
    accent: "#22C55E",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const Features = () => {
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';

  return (
    <section
      id="features"
      className="relative bg-black py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      {/* Subtle grid background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(210,10,10,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: ufcHeadingFont }}
          >
            Fight-Ready Intelligence
          </h2>
          <p
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
            style={{ fontFamily: ufcHeadingFont }}
          >
            Everything you need to gain an edge before the octagon lights up
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto"
        >
          {features.map((feature) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group relative"
              >
                <div
                  className="relative h-full bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.08]"
                >
                  {/* Icon container */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${feature.accent}15`,
                      border: `1px solid ${feature.accent}30`,
                    }}
                  >
                    <IconComponent
                      className="w-7 h-7"
                      style={{ color: feature.accent }}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Content */}
                  <h3
                    className="text-xl lg:text-2xl font-bold text-white mb-3"
                    style={{ fontFamily: ufcHeadingFont }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-gray-400 leading-relaxed text-base"
                    style={{ fontFamily: ufcHeadingFont }}
                  >
                    {feature.description}
                  </p>

                  {/* Hover glow effect */}
                  <div
                    className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(400px at 50% 0%, ${feature.accent}10, transparent 70%)`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

