"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatedIntro } from "@/components/dashboard/AnimatedIntro";
import { EventSelector } from "@/components/dashboard/EventSelector";
import { FightSelector } from "@/components/dashboard/FightSelector";
import { VSEmblem } from "@/components/dashboard/VSEmblem";
import { UFCArticle } from "@/components/dashboard/UFCArticle";
import { DashboardTabs, type TabValue } from "@/components/dashboard/DashboardTabs";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { PastEventsList } from "@/components/dashboard/PastEventsList";

const N8N_WEBHOOK_URL = "https://vanya-vasya.app.n8n.cloud/webhook/7a104f81-c923-49cd-abf4-562204fc06e9";

// Available UFC events for selection
const UFC_EVENTS = ["UFC 326", "UFC FIGHT NIGHT: EMMETT VS VALLEJOS"];

// Fights available for each UFC event
const UFC_FIGHTS: Record<string, string[]> = {
  "UFC 326": [
    "MAX HOLLOWAY VS CHARLES OLIVEIRA",
    "CODY GARBRANDT VS XIAO LONG",
    "CAIO BORRALHO VS REINIER DE RIDDER",
    "ROB FONT VS RAUL ROSAS JR.",
    "GREGORY RODRIGUES VS BRUNNO FERREIRA",
    "DREW DOBER VS MICHAEL JOHNSON",
    "RICKY TURCIOS VS ALBERTO MONTES",
    "DONTE JOHNSON VS DUŠKO TODOROVIĆ",
    "CODY DURDEN VS NYAMJARGAL TUMENDEMBEREL",
    "SUMUDAERJI VS JESUS AGUILAR",
    "LUKE FERNANDEZ VS RODOLFO BELLATO",
    "JOOSANG YOO VS GASTON BOLANOS",
  ],
  "UFC FIGHT NIGHT: EMMETT VS VALLEJOS": [
    "JOSH EMMETT VS KEVIN VALLEJOS",
    "AMANDA LEMOS VS GILLIAN ROBERTSON",
    "ION CUTELABA VS OUMAR SY",
    "BOLAJI OKI VS MANOEL SOUSA",
    "MARWAN RAHIKI VS HARRY HARDWICK",
    "CHARLES JOHNSON VS BRUNO SILVA",
    "ANDRE FILI VS JOSE MIGUEL DELGADO",
    "VITOR PETRINO VS STEVEN ASPLUND",
    "PIERA RODRIGUEZ VS SAM HUGHES",
    "ELIJAH SMITH VS SUYOUNG YOU",
    "LUAN LACERDA VS HECHER SOSA",
    "BIA MESQUITA VS MONTSE RENDON",
  ],
};

interface ArticleData {
  content: string;
  fighterA: string;
  fighterB: string;
  timestamp: string;
  imageUrl?: string;
}

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  // Tab state - default to "upcoming"
  const [activeTab, setActiveTab] = useState<TabValue>("upcoming");
  // Events selector - default to first event
  const [selectedEvent, setSelectedEvent] = useState(UFC_EVENTS[0]);
  // Fights selector - will be populated based on selected event
  const [selectedFight, setSelectedFight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
   * Handle Fight button click
   * IMPORTANT: Only uses data from the Fights panel (selectedFight)
   * Does NOT use any data from the Events panel
   */
  const handleFightClick = useCallback(async () => {
    // Only check for selectedFight - ignoring Events panel
    if (!selectedFight) {
      console.log("Please select a fight");
      return;
    }

    setIsLoading(true);

    try {
      // ONLY use the selected fight - ignore Events panel entirely
      const message = selectedFight;

      // Parse fighters from the fight string (format: "FIGHTER A VS FIGHTER B")
      const fighters = selectedFight.split(" VS ");
      const fighterA = fighters[0]?.trim() || "";
      const fighterB = fighters[1]?.trim() || "";

      console.log("[Dashboard] Sending fight analysis for:", message);
      console.log("[Dashboard] Fighter A:", fighterA);
      console.log("[Dashboard] Fighter B:", fighterB);

      // Send to N8N webhook - ONLY fight data, no event data
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          fight: selectedFight,
          fighterA,
          fighterB,
        }),
      });

      // Capture HTTP 200 OK responses
      if (response.status === 200) {
        const responseBody = await response.json();
        const timestamp = new Date().toISOString();
        
        // Extract content from response
        const content = typeof responseBody === 'string' 
          ? responseBody 
          : responseBody.content || responseBody.analysis || JSON.stringify(responseBody, null, 2);
        
        // Generate AI image of the fighters
        let imageUrl: string | undefined;
        try {
          console.log("[Dashboard] Starting fighter image generation for:", fighterA, "vs", fighterB);
          const imageResponse = await fetch('/api/generate-fighter-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fighterA,
              fighterB,
            }),
          });

          console.log("[Dashboard] Image API response status:", imageResponse.status);

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            imageUrl = imageData.imageUrl;
            console.log("[Dashboard] Fighter image generated successfully:", imageUrl);
          } else {
            const errorText = await imageResponse.text();
            console.error("[Dashboard] Failed to generate fighter image. Status:", imageResponse.status);
            console.error("[Dashboard] Error response:", errorText);
          }
        } catch (imageError) {
          console.error("[Dashboard] Exception while generating fighter image:", imageError);
          // Continue without image if generation fails
        }
        
        // Set active article to display
        setActiveArticle({
          content,
          fighterA,
          fighterB,
          timestamp,
          imageUrl,
        });

        // Deduct 100 credits and record transaction
        try {
          const deductRes = await fetch("/api/user/deduct-credits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fight: selectedFight, fighterA, fighterB }),
          });
          if (deductRes.ok) {
            // Notify UsageProgress to re-fetch balance
            window.dispatchEvent(new CustomEvent("credits:updated"));
          }
        } catch (deductErr) {
          console.error("[Dashboard] Failed to deduct credits:", deductErr);
        }

        console.log("[Dashboard] Analysis completed successfully for:", message);
      } else {
        throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      console.error("Failed to start fight analysis:", error);
      
    } finally {
      setIsLoading(false);
    }
  }, [selectedFight]);

  const handleCloseArticle = useCallback(() => {
    setActiveArticle(null);
    setSelectedEvent(UFC_EVENTS[0]);
    const firstFight = UFC_FIGHTS[UFC_EVENTS[0]]?.[0] || "";
    setSelectedFight(firstFight);
  }, []);

  return (
    <>
      {showIntro && <AnimatedIntro onComplete={handleIntroComplete} />}
      
      {/* Show Article Overlay when active */}
      {activeArticle && (
        <UFCArticle
          content={activeArticle.content}
          fighterA={activeArticle.fighterA}
          fighterB={activeArticle.fighterB}
          timestamp={activeArticle.timestamp}
          imageUrl={activeArticle.imageUrl}
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
              <div className="w-full max-w-6xl mx-auto">
                {/* Mobile: Stack vertically */}
                <div className="flex flex-col lg:hidden space-y-4 items-center">
                  <EventSelector
                    label="Events"
                    events={UFC_EVENTS}
                    value={selectedEvent}
                    onChange={handleEventChange}
                    widthClass="w-[300px]"
                  />
                  
                  <VSEmblem 
                    className="mx-auto my-2" 
                    onClick={handleFightClick}
                    disabled={isLoading || !selectedFight}
                    isLoading={isLoading}
                  />
                  
                  <FightSelector
                    label="Fights"
                    fights={availableFights}
                    value={selectedFight}
                    onChange={handleFightChange}
                    widthClass="w-[300px]"
                  />
                </div>

                {/* Desktop: Side by side */}
                <div className="hidden lg:flex items-start justify-center gap-8">
                  <div className="w-[340px] flex-shrink-0">
                    <EventSelector
                      label="Events"
                      events={UFC_EVENTS}
                      value={selectedEvent}
                      onChange={handleEventChange}
                      widthClass="w-full"
                    />
                  </div>

                  <VSEmblem 
                    className="flex-shrink-0 px-4 mt-8 w-[180px]" 
                    onClick={handleFightClick}
                    disabled={isLoading || !selectedFight}
                    isLoading={isLoading}
                  />

                  <div className="w-[340px] flex-shrink-0">
                    <FightSelector
                      label="Fights"
                      fights={availableFights}
                      value={selectedFight}
                      onChange={handleFightChange}
                      widthClass="w-full"
                    />
                  </div>
                </div>
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
    </>
  );
}
