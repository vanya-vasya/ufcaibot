"use client";

import { useEffect, useState } from "react";

interface AnimatedIntroProps {
  onComplete: () => void;
  text?: string;
  duration?: number;
}

export const AnimatedIntro = ({ 
  onComplete, 
  text = "AI ENGINE FOR FIGHTERS",
  duration = 3200 
}: AnimatedIntroProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isGlowing, setIsGlowing] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start glow effect
    const glowTimer = setTimeout(() => {
      setIsGlowing(true);
    }, 100);

    // Start fade out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration * 0.6);

    // Complete and unmount
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration + 100);

    return () => {
      clearTimeout(glowTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      data-testid="animated-intro"
      style={{
        opacity: isFadingOut ? 0 : 1,
        transition: `opacity ${duration * 0.4}ms ease-out`,
      }}
    >
      <h1
        className="text-6xl md:text-8xl lg:text-9xl font-bold px-4"
        style={{
          fontFamily: 'var(--font-ufc-heading)',
          fontWeight: 600,
          letterSpacing: '0.02em',
          textTransform: 'none',
          color: '#FFFFFF',
          textShadow: isGlowing 
            ? '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4)' 
            : 'none',
          transition: 'text-shadow 300ms ease-in',
        }}
      >
        {text}
      </h1>
    </div>
  );
};

