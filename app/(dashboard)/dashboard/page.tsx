"use client";

import { useState, useCallback } from "react";
import { AnimatedIntro } from "@/components/dashboard/AnimatedIntro";
import { FighterInput } from "@/components/dashboard/FighterInput";
import { VSEmblem } from "@/components/dashboard/VSEmblem";
import { UFCArticle } from "@/components/dashboard/UFCArticle";

const N8N_WEBHOOK_URL = "https://vanya-vasya.app.n8n.cloud/webhook/7a104f81-c923-49cd-abf4-562204fc06e9";

interface ArticleData {
  content: string;
  fighterA: string;
  fighterB: string;
  timestamp: string;
  imageUrl?: string;
}

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [fighterA, setFighterA] = useState("");
  const [fighterB, setFighterB] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeArticle, setActiveArticle] = useState<ArticleData | null>(null);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleFighterAChange = useCallback((value: string) => {
    setFighterA(value);
  }, []);

  const handleFighterBChange = useCallback((value: string) => {
    setFighterB(value);
  }, []);

  const handleFightClick = useCallback(async () => {
    if (!fighterA || !fighterB) {
      console.log("Both fighter names are required");
      return;
    }

    setIsLoading(true);

    try {
      // Construct simple message: "FIGHTER A VS FIGHTER B"
      const message = `${fighterA} VS ${fighterB}`;

      // Send to N8N webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
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
        
        // Generate AI image of the two fighters
        let imageUrl: string | undefined;
        try {
          console.log("Generating fighter image...");
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

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            imageUrl = imageData.imageUrl;
            console.log("Fighter image generated successfully:", imageUrl);
          } else {
            console.error("Failed to generate fighter image:", await imageResponse.text());
          }
        } catch (imageError) {
          console.error("Failed to generate fighter image:", imageError);
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
        
        console.log("Fight analysis completed successfully:", message);
      } else {
        throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      console.error("Failed to start fight analysis:", error);
      
    } finally {
      setIsLoading(false);
    }
  }, [fighterA, fighterB]);

  const handleCloseArticle = useCallback(() => {
    setActiveArticle(null);
    setFighterA("");
    setFighterB("");
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
      
      {/* Fighter Input UI - Hidden when article is active */}
      <div
        className={`min-h-screen flex items-center justify-center bg-black dark:bg-black px-4 py-8 transition-opacity duration-500 ${
          activeArticle ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="w-full max-w-6xl mx-auto">
          {/* Mobile: Stack vertically */}
          <div className="flex flex-col lg:hidden space-y-6">
            <FighterInput
              label="Fighter A"
              value={fighterA}
              onChange={handleFighterAChange}
              placeholder="Enter Fighter A Name"
            />
            
            <VSEmblem 
              className="mx-auto my-4" 
              onClick={handleFightClick}
              disabled={isLoading}
              isLoading={isLoading}
            />
            
            <FighterInput
              label="Fighter B"
              value={fighterB}
              onChange={handleFighterBChange}
              placeholder="Enter Fighter B Name"
            />
          </div>

          {/* Desktop: Side by side */}
          <div className="hidden lg:flex items-center gap-12">
            <div className="flex-1">
              <FighterInput
                label="Fighter A"
                value={fighterA}
                onChange={handleFighterAChange}
                placeholder="Enter Fighter A Name"
              />
            </div>

            <VSEmblem 
              className="flex-shrink-0 px-6" 
              onClick={handleFightClick}
              disabled={isLoading}
              isLoading={isLoading}
            />

            <div className="flex-1">
              <FighterInput
                label="Fighter B"
                value={fighterB}
                onChange={handleFighterBChange}
                placeholder="Enter Fighter B Name"
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
