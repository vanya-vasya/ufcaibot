"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatedIntro } from "@/components/dashboard/AnimatedIntro";
import { EventSelector } from "@/components/dashboard/EventSelector";
import { FightSelector } from "@/components/dashboard/FightSelector";
import { AnalysisProductButtons } from "@/components/dashboard/AnalysisProductButtons";
import { UFCArticle } from "@/components/dashboard/UFCArticle";
import { DashboardTabs, type TabValue } from "@/components/dashboard/DashboardTabs";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { PastEventsList } from "@/components/dashboard/PastEventsList";
import { useProModal } from "@/hooks/use-pro-modal";
import { UPCOMING_EVENT_NAMES, UPCOMING_FIGHTS_BY_EVENT } from "@/data/fight-events";
import {
  ANALYSIS_PRODUCTS,
  type AnalysisProductId,
  type AnalysisSection,
} from "@/lib/analysis/products";

const NOT_CHARGED_NOTICE =
  "We could not find enough data for this matchup, so no tokens were charged.";

// Events and fights come from the single source of truth: data/fight-events.ts
const UFC_EVENTS = UPCOMING_EVENT_NAMES;
const UFC_FIGHTS = UPCOMING_FIGHTS_BY_EVENT;

interface ArticleData {
  content: string;
  fighterA: string;
  fighterB: string;
  timestamp: string;
  sections: readonly AnalysisSection[];
  notice?: string;
}

interface AnalyzeResponse {
  content: string;
  sections: AnalysisSection[];
  charged: boolean;
}

export default function HomePage() {
  const proModal = useProModal();
  const [showIntro, setShowIntro] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  // Tab state - default to "upcoming"
  const [activeTab, setActiveTab] = useState<TabValue>("upcoming");
  // Events selector - default to first event
  const [selectedEvent, setSelectedEvent] = useState(UFC_EVENTS[0]);
  // Fights selector - will be populated based on selected event
  const [selectedFight, setSelectedFight] = useState("");
  const [activeProduct, setActiveProduct] = useState<AnalysisProductId | null>(null);
  const [activeArticle, setActiveArticle] = useState<ArticleData | null>(null);

  // Get available fights for the currently selected event
  const availableFights = useMemo(() => {
    return UFC_FIGHTS[selectedEvent] || [];
  }, [selectedEvent]);

  // Reset selected fight when event changes (select first fight of new event)
  useEffect(() => {
    const fights = UFC_FIGHTS[selectedEvent] || [];
    if (fights.length > 0) {
      setSelectedFight(fights[0]);
    } else {
      setSelectedFight("");
    }
  }, [selectedEvent]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    // Small tick to let React unmount the overlay before fading in content
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setContentVisible(true));
    });
  }, []);

  const handleTabChange = useCallback((tab: TabValue) => {
    setActiveTab(tab);
  }, []);

  const handleEventChange = useCallback((value: string) => {
    setSelectedEvent(value);
  }, []);

  const handleFightChange = useCallback((value: string) => {
    setSelectedFight(value);
  }, []);

  /**
   * Handle a product button click (ODDS / STATS / NEWS / ULTIMATE).
   * Only uses data from the Fights panel (selectedFight); the server checks and
   * deducts credits, so the client-side balance check is just an early exit.
   */
  const handleAnalyze = useCallback(
    async (product: AnalysisProductId) => {
      if (!selectedFight || activeProduct) return;

      const { cost } = ANALYSIS_PRODUCTS[product];

      try {
        const creditsRes = await fetch("/api/user/credits");
        if (creditsRes.ok) {
          const { remaining } = await creditsRes.json();
          if (remaining < cost) {
            proModal.onOpen();
            return;
          }
        }
      } catch {
        // If the credits check fails, the server-side guard decides.
      }

      setActiveProduct(product);

      try {
        const [fighterA = "", fighterB = ""] = selectedFight
          .split(" VS ")
          .map((name) => name.trim());

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product, fighterA, fighterB }),
        });

        if (response.status === 402) {
          proModal.onOpen();
          return;
        }
        if (!response.ok) {
          throw new Error(`Analysis request failed: ${response.status}`);
        }

        const result: AnalyzeResponse = await response.json();

        setActiveArticle({
          content: result.content,
          fighterA,
          fighterB,
          timestamp: new Date().toISOString(),
          sections: result.sections,
          notice: result.charged ? undefined : NOT_CHARGED_NOTICE,
        });

        if (result.charged) {
          window.dispatchEvent(new CustomEvent("credits:updated"));
        }
      } catch (error) {
        console.error("[Dashboard] Failed to run analysis:", error);
      } finally {
        setActiveProduct(null);
      }
    },
    [selectedFight, activeProduct, proModal]
  );

  const handleCloseArticle = useCallback(() => {
    setActiveArticle(null);
    setSelectedEvent(UFC_EVENTS[0]);
    const firstFight = UFC_FIGHTS[UFC_EVENTS[0]]?.[0] || "";
    setSelectedFight(firstFight);
  }, []);

  return (
    <>
      {showIntro && <AnimatedIntro onComplete={handleIntroComplete} />}

      <div
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: "opacity 400ms ease-in",
          pointerEvents: contentVisible ? "auto" : "none",
        }}
      >
      {/* Show Article Overlay when active */}
      {activeArticle && (
        <UFCArticle
          content={activeArticle.content}
          fighterA={activeArticle.fighterA}
          fighterB={activeArticle.fighterB}
          timestamp={activeArticle.timestamp}
          sections={activeArticle.sections}
          notice={activeArticle.notice}
          onClose={handleCloseArticle}
        />
      )}
      
      {/* Dashboard Tabs - Placed directly below header */}
      <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Tab Panels */}
      <div 
        role="tabpanel" 
        id="tabpanel-upcoming"
        aria-labelledby="tab-upcoming"
        hidden={activeTab !== "upcoming"}
      >
        {activeTab === "upcoming" && (
          <div className="min-h-screen bg-black dark:bg-black">
            {/* MMA News Feed - positioned between Upcoming/Past tabs and Events/Fights selectors */}
            <section 
              className={`pt-8 sm:pt-10 md:pt-12 lg:pt-14 pb-10 sm:pb-12 md:pb-14 lg:pb-16 transition-opacity duration-500 ${
                activeArticle ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              aria-label="MMA News"
            >
              <NewsFeed animationDuration={800} />
            </section>

            {/* Events and Fights Selection Block */}
            <section
              className={`py-8 sm:py-10 md:py-12 lg:py-14 px-4 transition-opacity duration-500 ${
                activeArticle ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              aria-label="Fight Selection"
            >
              <div className="w-full max-w-6xl mx-auto space-y-10">
                <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
                  <div className="w-[300px] lg:w-[340px] flex-shrink-0">
                    <EventSelector
                      label="Events"
                      events={UFC_EVENTS}
                      value={selectedEvent}
                      onChange={handleEventChange}
                      widthClass="w-full"
                    />
                  </div>

                  <div className="w-[300px] lg:w-[340px] flex-shrink-0">
                    <FightSelector
                      label="Fights"
                      fights={availableFights}
                      value={selectedFight}
                      onChange={handleFightChange}
                      widthClass="w-full"
                    />
                  </div>
                </div>

                <AnalysisProductButtons
                  onSelect={handleAnalyze}
                  disabled={!selectedFight}
                  activeProduct={activeProduct}
                />
              </div>
            </section>
          </div>
        )}
      </div>

      <div 
        role="tabpanel" 
        id="tabpanel-past"
        aria-labelledby="tab-past"
        hidden={activeTab !== "past"}
      >
        {activeTab === "past" && (
          <div className="min-h-screen bg-black dark:bg-black px-4 py-8 sm:py-10 md:py-12">
            <div className="max-w-5xl mx-auto">
              <PastEventsList initialLimit={5} showLoadMore />
            </div>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        :root {
          --font-ufc-heading: "UFC Sans Condensed", "Arial Narrow", Arial, sans-serif;
        }
      `}</style>
      </div>
    </>
  );
}
