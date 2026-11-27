"use client";

import { TypewriterPhrases } from "./TypewriterPhrases";
import {
  ANALYSIS_PRODUCTS,
  ANALYSIS_PRODUCT_ORDER,
  type AnalysisProductId,
} from "@/lib/analysis/products";

interface AnalysisProductButtonsProps {
  onSelect: (product: AnalysisProductId) => void;
  disabled?: boolean;
  activeProduct?: AnalysisProductId | null;
}

const headingStyle = {
  fontFamily: "var(--font-ufc-heading)",
  letterSpacing: "0.05em",
} as const;

const ULTIMATE_INCLUDES = ["ODDS", "STATS", "NEWS"] as const;

export const AnalysisProductButtons = ({
  onSelect,
  disabled = false,
  activeProduct = null,
}: AnalysisProductButtonsProps) => {
  const isLoading = activeProduct !== null;

  const handleSelect = (product: AnalysisProductId) => () => {
    if (disabled || isLoading) return;
    onSelect(product);
  };

  return (
    <div className="flex flex-col items-center w-full" data-testid="analysis-products">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.6fr]">
        {ANALYSIS_PRODUCT_ORDER.map((productId) => {
          const product = ANALYSIS_PRODUCTS[productId];
          const isUltimate = productId === "ultimate";
          const isActive = activeProduct === productId;
          const isDisabled = disabled || isLoading;

          return (
            <button
              key={productId}
              type="button"
              onClick={handleSelect(productId)}
              disabled={isDisabled}
              aria-label={
                isActive
                  ? `Processing ${product.label} analysis`
                  : `Start ${product.label} analysis for ${product.cost} tokens`
              }
              aria-busy={isActive}
              data-testid={`analysis-product-${productId}`}
              className={`flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-lg px-4 py-4 text-white transition-all focus:outline-none focus:ring-4 focus:ring-red-500 ${
                isUltimate
                  ? "border-2 border-red-600 bg-red-950/30 shadow-[0_0_32px_rgba(220,38,38,0.45)] hover:bg-red-950/50 sm:col-span-2 lg:col-span-1"
                  : "border border-white/40 hover:border-white/70 hover:bg-white/5"
              } ${isDisabled && !isActive ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {isActive ? (
                <span
                  className="flex flex-col items-center gap-2 text-2xl font-black md:text-3xl"
                  style={headingStyle}
                  role="status"
                  aria-live="polite"
                >
                  <svg
                    className="h-8 w-8 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  ANALYZING
                </span>
              ) : (
                <>
                  <span
                    className="analysis-product-label text-3xl font-black md:text-4xl"
                    style={headingStyle}
                  >
                    {product.label}
                  </span>
                  {isUltimate && (
                    <span
                      className="flex flex-wrap items-center justify-center gap-2"
                      aria-label="Includes odds, stats and news"
                    >
                      {ULTIMATE_INCLUDES.map((name) => (
                        <span
                          key={name}
                          className="rounded border border-red-500/70 px-2 py-0.5 text-xs font-bold text-red-200"
                          style={headingStyle}
                        >
                          {name}
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="text-center text-sm text-gray-400">{product.description}</span>
                  <span className="text-sm font-bold text-gray-200" style={headingStyle}>
                    {`${product.cost} TOKENS`}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <div
        className="mt-12 min-h-[2rem] w-[500px] max-w-full overflow-visible"
        data-testid="typewriter-phrases-container"
        aria-hidden={!isLoading}
      >
        <TypewriterPhrases isActive={isLoading} className="min-h-[2rem]" />
      </div>

      <style jsx>{`
        @keyframes jump {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        .analysis-product-label {
          animation: jump 1s ease-in-out infinite, blink 1.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .analysis-product-label {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
