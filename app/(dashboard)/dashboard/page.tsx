"use client";

import { useState, useCallback } from "react";
import { AnimatedIntro } from "@/components/dashboard/AnimatedIntro";
import { FighterInput } from "@/components/dashboard/FighterInput";
import { VSEmblem } from "@/components/dashboard/VSEmblem";
import { generateFightMessage } from "@/lib/fight-message-generator";

const N8N_WEBHOOK_URL = "https://vanya-vasya.app.n8n.cloud/webhook/7a104f81-c923-49cd-abf4-562204fc06e9";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [fighterA, setFighterA] = useState("");
  const [fighterB, setFighterB] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      alert("Please enter both fighter names");
      return;
    }

    setIsLoading(true);

    try {
      // Generate the fight message
      const message = generateFightMessage(fighterA, fighterB);

      // Send to N8N webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          fighterA,
          fighterB,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fight analysis started successfully:", data);
      
      // Show success feedback
      alert(`Fight analysis started successfully!\n\n${message}`);
      
    } catch (error) {
      console.error("Failed to start fight analysis:", error);
      
      // Show error feedback
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to start fight analysis: ${errorMessage}`);
      
    } finally {
      setIsLoading(false);
    }
  }, [fighterA, fighterB]);

  return (
    <>
      {showIntro && <AnimatedIntro onComplete={handleIntroComplete} />}
      
      <div className="min-h-screen flex items-center justify-center bg-black dark:bg-black px-4 py-8">
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
