"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { fontWeights, lineHeights, letterSpacing } from "@/config/ufc-font";

const UFC_HEADING_FONT = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';

interface PricingTier {
  id: string;
  name: string;
  description?: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  tokens: string;
  tokenRate?: string;
  generations?: string;
  features: string[];
  popular: boolean;
  color: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: "Tracker",
    name: "For a Quick Start",
    price: "£20",
    tokens: "100 Tokens",
    discount: "Standard Rate",
    features: [
      "Macros Generations"
    ],
    popular: false,
    color: "from-purple-600 to-pink-600",
  },
  {
    id: "master-chef",
    name: "For Regular Use",
    price: "£40",
    tokens: "220 Tokens",
    discount: "10% Token Discount",
    features: [
      "Recipe Generations"
    ],
    popular: true,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "master-nutritionist",
    name: "Maximum Value Package",
    price: "£60",
    tokens: "360 Tokens",
    discount: "20% Token Discount",
    features: [
      "Consulting Generations"
    ],
    popular: false,
    color: "from-blue-600 to-violet-600",
  },
  {
    id: "custom",
    name: "Custom Amount",
    price: "",
    tokens: "",
    tokenRate: "£0.20 per token",
    features: [
      "Pay Exactly What You Want"
    ],
    popular: false,
    color: "from-orange-500 to-red-600",
  }
];

const Pricing = () => {
  const [customAmount, setCustomAmount] = useState("");

  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-[#0a0a0a]"
    >
      <div className="container relative mx-auto px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
            style={{ 
              color: '#ffffff',
              fontFamily: UFC_HEADING_FONT,
            }}
          >
            Pay-As-You-Go
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl text-base md:text-lg lg:text-xl leading-relaxed text-white"
            style={{ 
              fontFamily: UFC_HEADING_FONT,
            }}
          >
            Just pay-as-you-go tokens, with bigger packs for better value
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`relative rounded-2xl p-6 bg-[#1a1a1a] shadow-lg border-0 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col ${
                tier.popular 
                  ? "ring-2 ring-white ring-opacity-50" 
                  : ""
              }`}
              style={{
                boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div 
                    className="bg-white text-black px-4 py-1 rounded-full text-sm"
                    style={{
                      fontFamily: UFC_HEADING_FONT,
                      fontWeight: fontWeights.semibold,
                    }}
                  >
                    Popular
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col flex-1 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <h3 
                    className="text-xl font-bold text-white"
                    style={{
                      fontFamily: UFC_HEADING_FONT,
                      fontWeight: fontWeights.bold,
                      lineHeight: lineHeights.snug,
                      letterSpacing: letterSpacing.normal,
                    }}
                  >
                    {tier.name}
                  </h3>
                  {tier.description && (
                    <p 
                      className="text-white text-sm"
                      style={{
                        fontFamily: UFC_HEADING_FONT,
                        fontWeight: fontWeights.normal,
                        lineHeight: lineHeights.normal,
                        letterSpacing: letterSpacing.normal,
                      }}
                    >
                      {tier.description}
                    </p>
                  )}
                </div>

                {/* Price */}
                {tier.id !== "custom" && (
                  <div className="text-center space-y-1">
                    <div 
                      className="text-4xl font-bold text-white"
                      style={{
                        fontFamily: UFC_HEADING_FONT,
                        fontWeight: fontWeights.bold,
                        lineHeight: lineHeights.tight,
                        letterSpacing: letterSpacing.normal,
                      }}
                    >
                      {tier.price}
                    </div>
                    {tier.tokens && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <p 
                            className="text-white font-semibold"
                            style={{
                              fontFamily: UFC_HEADING_FONT,
                              fontWeight: fontWeights.semibold,
                              lineHeight: lineHeights.normal,
                              letterSpacing: letterSpacing.normal,
                            }}
                          >
                            {tier.tokens}
                          </p>
                          {tier.discount && (
                            <span 
                              className={`text-xs px-2 py-1 rounded-full ${
                                tier.discount === "Standard Rate" 
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-white/20 text-white"
                              }`}
                              style={{
                                fontFamily: UFC_HEADING_FONT,
                                fontWeight: fontWeights.semibold,
                              }}
                            >
                              {tier.discount}
                            </span>
                          )}
                        </div>
                        {tier.tokenRate && (
                          <p 
                            className="text-white/70 text-xs"
                            style={{
                              fontFamily: UFC_HEADING_FONT,
                              fontWeight: fontWeights.normal,
                              lineHeight: lineHeights.normal,
                              letterSpacing: letterSpacing.normal,
                            }}
                          >
                            {tier.tokenRate}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Amount Input */}
                {tier.id === "custom" && (
                  <div className="text-center space-y-1">
                    <div className="relative">
                      <label htmlFor={`custom-amount-${tier.id}`} className="sr-only">
                        Enter custom amount in pounds
                      </label>
                      <span 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 font-semibold pointer-events-none" 
                        style={{ 
                          color: '#fff',
                          fontFamily: UFC_HEADING_FONT,
                        }}
                      >
                        £
                      </span>
                      <input
                        id={`custom-amount-${tier.id}`}
                        type="number"
                        placeholder="25"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border-2 rounded-lg text-center text-2xl font-bold transition-all duration-200 bg-[#2a2a2a] focus:outline-none focus:ring-2"
                        style={{
                          fontFamily: UFC_HEADING_FONT,
                          fontWeight: fontWeights.bold,
                          borderColor: '#666',
                          color: '#fff',
                        }}
                        onFocus={(e) => {
                          const target = e.target as HTMLInputElement;
                          target.style.borderColor = '#888';
                          target.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.2)';
                        }}
                        onBlur={(e) => {
                          const target = e.target as HTMLInputElement;
                          target.style.borderColor = '#666';
                          target.style.boxShadow = 'none';
                        }}
                        onMouseOver={(e) => {
                          const target = e.target as HTMLInputElement;
                          if (document.activeElement !== target) {
                            target.style.borderColor = '#777';
                          }
                        }}
                        onMouseOut={(e) => {
                          const target = e.target as HTMLInputElement;
                          if (document.activeElement !== target) {
                            target.style.borderColor = '#666';
                          }
                        }}
                        aria-describedby={`token-rate-${tier.id}`}
                      />
                    </div>
                    <div className="space-y-2 mt-2">
                      {tier.tokenRate && (
                        <p 
                          id={`token-rate-${tier.id}`}
                          className="text-white/70 text-xs"
                          style={{
                            fontFamily: UFC_HEADING_FONT,
                            fontWeight: fontWeights.normal,
                            lineHeight: lineHeights.normal,
                            letterSpacing: letterSpacing.normal,
                          }}
                        >
                          {tier.tokenRate}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-auto pt-4">
                  <Link href="/dashboard">
                    <button
                      className="w-full px-6 py-3 bg-black border-2 border-white hover:bg-gray-900 text-white font-bold uppercase tracking-wider rounded transition-colors duration-200"
                      style={{
                        fontFamily: UFC_HEADING_FONT,
                      }}
                    >
                      {tier.id === "custom" ? "Choose Amount" : "Begin"}
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
