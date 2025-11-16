"use client";

import { useState, useCallback } from "react";
import { AnimatedIntro } from "@/components/dashboard/AnimatedIntro";
import { FighterInput } from "@/components/dashboard/FighterInput";
import { VSEmblem } from "@/components/dashboard/VSEmblem";

const N8N_WEBHOOK_URL = "https://vanya-vasya.app.n8n.cloud/webhook/7a104f81-c923-49cd-abf4-562204fc06e9";

interface SuccessResponse {
  timestamp: string;
  message: string;
  responseBody: any;
}

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [fighterA, setFighterA] = useState("");
  const [fighterB, setFighterB] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successResponses, setSuccessResponses] = useState<SuccessResponse[]>([]);

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
        
        setSuccessResponses((prev) => [
          {
            timestamp,
            message,
            responseBody,
          },
          ...prev,
        ]);
        
        console.log("Fight analysis started successfully:", message);
      } else {
        throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      console.error("Failed to start fight analysis:", error);
      
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

        {/* Success Response Display */}
        {successResponses.length > 0 && (
          <div className="w-full max-w-6xl mx-auto mt-8 px-4">
            <div 
              className="bg-green-950/30 border-2 border-green-500 rounded-lg p-6"
              role="region"
              aria-label="Success responses"
            >
              <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <span className="text-3xl" aria-hidden="true">✓</span>
                Success
              </h2>
              
              <div className="space-y-4">
                {successResponses.map((success, index) => (
                  <div 
                    key={`${success.timestamp}-${index}`}
                    className="bg-black/40 border border-green-600/30 rounded-md p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <p className="text-green-300 font-semibold">
                        {success.message}
                      </p>
                      <time 
                        className="text-sm text-green-400/70"
                        dateTime={success.timestamp}
                      >
                        {new Date(success.timestamp).toLocaleString()}
                      </time>
                    </div>
                    
                    <div className="mt-3">
                      <pre className="text-sm text-green-100 bg-black/60 rounded p-3 overflow-x-auto">
                        <code>{JSON.stringify(success.responseBody, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
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
