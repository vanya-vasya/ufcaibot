"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

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

  // Parse content into sections
  const parseContent = (text: string) => {
    const sections = [];
    const lines = text.split("\n").filter((line) => line.trim());

    let currentSection = { type: "text", content: "" };

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("#")) {
        if (currentSection.content) {
          sections.push(currentSection);
        }
        currentSection = {
          type: "heading",
          content: trimmedLine.replace(/^#+\s*/, ""),
        };
        sections.push(currentSection);
        currentSection = { type: "text", content: "" };
      } else if (trimmedLine.startsWith(">")) {
        if (currentSection.content) {
          sections.push(currentSection);
        }
        currentSection = {
          type: "quote",
          content: trimmedLine.replace(/^>\s*/, ""),
        };
        sections.push(currentSection);
        currentSection = { type: "text", content: "" };
      } else if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
        if (currentSection.content) {
          sections.push(currentSection);
        }
        currentSection = {
          type: "subheading",
          content: trimmedLine.replace(/\*\*/g, ""),
        };
        sections.push(currentSection);
        currentSection = { type: "text", content: "" };
      } else {
        currentSection.content += (currentSection.content ? " " : "") + trimmedLine;
      }
    }

    if (currentSection.content) {
      sections.push(currentSection);
    }

    return sections;
  };

  const contentSections = parseContent(content);

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
          {/* Hero Section */}
          <header className="mb-8 border-b border-red-600 pb-6">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
                Fight Analysis
              </span>
            </div>

            <h1
              id="article-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-ufc-heading)" }}
            >
              {fighterA} <span className="text-red-600">VS</span> {fighterB}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">UFC AI Bot</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <time dateTime={timestamp}>{formattedDate}</time>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            {contentSections.map((section, index) => {
              switch (section.type) {
                case "heading":
                  return (
                    <h2
                      key={index}
                      className="text-3xl sm:text-4xl font-bold text-white mt-12 mb-6 first:mt-0"
                      style={{ fontFamily: "var(--font-ufc-heading)" }}
                    >
                      {section.content}
                    </h2>
                  );

                case "subheading":
                  return (
                    <h3
                      key={index}
                      className="text-2xl sm:text-3xl font-bold text-red-500 mt-8 mb-4"
                      style={{ fontFamily: "var(--font-ufc-heading)" }}
                    >
                      {section.content}
                    </h3>
                  );

                case "quote":
                  return (
                    <blockquote
                      key={index}
                      className="border-l-4 border-red-600 pl-6 py-4 my-8 italic text-xl text-gray-300 bg-gray-900/50"
                    >
                      "{section.content}"
                    </blockquote>
                  );

                case "text":
                  return (
                    <p
                      key={index}
                      className="text-gray-300 leading-relaxed mb-6 text-lg"
                    >
                      {section.content}
                    </p>
                  );

                default:
                  return null;
              }
            })}
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
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded transition-colors duration-200"
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

