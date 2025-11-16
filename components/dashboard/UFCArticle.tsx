"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { parseContentBlocks } from "@/lib/parseContentBlocks";

interface UFCArticleProps {
  content: string;
  fighterA: string;
  fighterB: string;
  timestamp: string;
  onClose: () => void;
}

export const UFCArticle = ({
  content,
  fighterA,
  fighterB,
  timestamp,
  onClose,
}: UFCArticleProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  // Format date
  const formattedDate = new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Parse content into Block 1, Block 2, Block 3
  const contentBlocks = parseContentBlocks(content);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-title"
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-6 right-6 z-50 p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors duration-200"
        aria-label="Close article"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Article Container */}
      <div
        className={`h-full overflow-y-auto transition-transform duration-500 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section - Black Background */}
          <header className="mb-8 pb-6 px-6 py-8 bg-black border border-gray-800 rounded-lg">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-wider">
                Fight Analysis
              </span>
            </div>

            <h1
              id="article-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-ufc-heading)" }}
            >
              {fighterA} <span className="text-white">VS</span> {fighterB}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">UFC AI Bot</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <time dateTime={timestamp}>{formattedDate}</time>
            </div>
          </header>

          {/* Article Content - Three Blocks */}
          <div className="space-y-12">
            {/* Block 1 */}
            <section>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-ufc-heading)" }}
              >
                ODDS ANALYSIS
              </h2>
              {contentBlocks.block1 ? (
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {contentBlocks.block1}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No content for ODDS ANALYSIS</p>
              )}
            </section>

            {/* Block 2 */}
            <section>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-ufc-heading)" }}
              >
                FIGHTER ANALYSIS
              </h2>
              {contentBlocks.block2 ? (
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {contentBlocks.block2}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No content for FIGHTER ANALYSIS</p>
              )}
            </section>

            {/* Block 3 */}
            <section>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-ufc-heading)" }}
              >
                SENTIMENT ANALYSIS
              </h2>
              {contentBlocks.block3 ? (
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {contentBlocks.block3}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No content for SENTIMENT ANALYSIS</p>
              )}
            </section>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-500">
                <p>Analysis generated by UFC AI Bot</p>
                <p className="mt-1">
                  Powered by advanced AI and real-time data analysis
                </p>
              </div>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-black border-2 border-white hover:bg-gray-900 text-white font-bold uppercase tracking-wider rounded transition-colors duration-200"
                style={{ fontFamily: "var(--font-ufc-heading)" }}
              >
                New Analysis
              </button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

