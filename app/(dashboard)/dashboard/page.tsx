"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatedIntro } from "@/components/dashboard/AnimatedIntro";
import { EventSelector } from "@/components/dashboard/EventSelector";
import { FightSelector } from "@/components/dashboard/FightSelector";
import { VSEmblem } from "@/components/dashboard/VSEmblem";
import { UFCArticle } from "@/components/dashboard/UFCArticle";

const N8N_WEBHOOK_URL = "https://vanya-vasya.app.n8n.cloud/webhook/7a104f81-c923-49cd-abf4-562204fc06e9";

// Available UFC events for selection
const UFC_EVENTS = ["UFC 324", "UFC 325"];

// Fights available for each UFC event
const UFC_FIGHTS: Record<string, string[]> = {
  "UFC 324": [
    "JUSTIN GAETHJE VS PADDY PIMBLETT",
    "KAYLA HARRISON VS AMANDA NUNES",
    "SEAN O'MALLEY VS SONG YADONG",
    "WALDO CORTES ACOSTA VS DERRICK LEWIS",
    "ARNOLD ALLEN VS JEAN SILVA",
    "ALEXA GRASSO VS ROSE NAMAJUNAS",
    "UMAR NURMAGOMEDOV VS DEIVESON FIGUEIREDO",
    "ATEBA GAUTIER VS ANDREY PULYAEV",
  ],
  "UFC 325": [
    "ALEXANDER VOLKANOVSKI VS DIEGO LOPES",
  ],
};

interface ArticleData {
  content: string;
  fighterA: string;
  fighterB: string;
  timestamp: string;
  imageUrl?: string;
  statsImageUrl?: string;
}

// Helper function to get stats image URL from fight name
const getStatsImageUrl = (fight: string): string => {
  // Map fight names to their corresponding image files
  const fightImageMap: Record<string, string> = {
    "JUSTIN GAETHJE VS PADDY PIMBLETT": "/generated-fighters/gaethje-vs-pimblett.png",
    "KAYLA HARRISON VS AMANDA NUNES": "/generated-fighters/harrison-vs-nunes.png",
    "SEAN O'MALLEY VS SONG YADONG": "/generated-fighters/o-malley-vs-yadong.png",
    "WALDO CORTES ACOSTA VS DERRICK LEWIS": "/generated-fighters/acosta-vs-lewis.png",
    "ARNOLD ALLEN VS JEAN SILVA": "/generated-fighters/allen-vs-silva.png",
    "ALEXA GRASSO VS ROSE NAMAJUNAS": "/generated-fighters/grasso-vs-namajunas.png",
    "UMAR NURMAGOMEDOV VS DEIVESON FIGUEIREDO": "/generated-fighters/nurmagomedov-vs-figueiredo.png",
    "ATEBA GAUTIER VS ANDREY PULYAEV": "/generated-fighters/gautier-vs-pulyaev.png",
    "ALEXANDER VOLKANOVSKI VS DIEGO LOPES": "/generated-fighters/volkanovski-vs-lopes.png",
  };
  
  return fightImageMap[fight] || "";
};

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
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
        
        // Get the stats image URL for this fight
        const statsImageUrl = getStatsImageUrl(selectedFight);
        console.log("[Dashboard] Stats image URL:", statsImageUrl);
        
        // Set active article to display
        setActiveArticle({
          content,
          fighterA,
          fighterB,
          timestamp,
          imageUrl,
          statsImageUrl,
        });
        
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
          statsImageUrl={activeArticle.statsImageUrl}
          onClose={handleCloseArticle}
        />
      )}
      
      {/* Fighter Input UI - Hidden when article is active */}
      <div
        className={`min-h-screen flex items-center justify-center bg-black dark:bg-black px-4 py-8 transition-opacity duration-500 ${
          activeArticle ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="w-full max-w-6xl mx-auto">
          {/* Mobile: Stack vertically */}
          <div className="flex flex-col lg:hidden space-y-6">
            <EventSelector
              label="Events"
              events={UFC_EVENTS}
              value={selectedEvent}
              onChange={handleEventChange}
            />
            
            <VSEmblem 
              className="mx-auto my-4" 
              onClick={handleFightClick}
              disabled={isLoading || !selectedFight}
              isLoading={isLoading}
            />
            
            <FightSelector
              label="Fights"
              fights={availableFights}
              value={selectedFight}
              onChange={handleFightChange}
            />
          </div>

          {/* Desktop: Side by side */}
          <div className="hidden lg:flex items-start gap-12">
            <div className="flex-1">
              <EventSelector
                label="Events"
                events={UFC_EVENTS}
                value={selectedEvent}
                onChange={handleEventChange}
              />
            </div>

            <VSEmblem 
              className="flex-shrink-0 px-6 mt-10" 
              onClick={handleFightClick}
              disabled={isLoading || !selectedFight}
              isLoading={isLoading}
            />

            <div className="flex-1">
              <FightSelector
                label="Fights"
                fights={availableFights}
                value={selectedFight}
                onChange={handleFightChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        :root {
          --font-ufc-heading: "UFC Sans Condensed", "Arial Narrow", Arial, sans-serif;
        }
      `}</style>
    </>
  );
}
