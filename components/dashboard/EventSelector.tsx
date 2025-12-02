"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Apple-style Wheel Picker / Scrolling Selector
 * 
 * Design Notes:
 * - Smooth inertial scrolling with momentum physics
 * - Snap-to-item behavior after scroll ends
 * - Touch, mouse wheel, and keyboard support
 * - Fade effect for non-selected items (Apple-style depth)
 * - Accessibility: ARIA live regions, keyboard navigation
 */

interface EventSelectorProps {
  /** Label displayed above the selector */
  label: string;
  /** List of event options to display */
  events: string[];
  /** Currently selected event value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Optional ID for accessibility */
  id?: string;
}

// Physics constants for smooth scrolling
const ITEM_HEIGHT = 56; // Height of each item in pixels
const VISIBLE_ITEMS = 5; // Number of visible items
const DECELERATION = 0.95; // Momentum decay factor
const MIN_VELOCITY = 0.5; // Minimum velocity before snapping
const SNAP_DURATION = 300; // Snap animation duration (ms)

export const EventSelector = ({
  label,
  events,
  value,
  onChange,
  id,
}: EventSelectorProps) => {
  const inputId = id || `event-selector-${label.toLowerCase().replace(/\s+/g, "-")}`;
  
  // Find initial index based on value
  const initialIndex = events.indexOf(value) !== -1 ? events.indexOf(value) : 0;
  
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs for scroll physics
  const containerRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);
  const lastTouchYRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  // Sync selectedIndex with value prop
  useEffect(() => {
    const newIndex = events.indexOf(value);
    if (newIndex !== -1 && newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
      setScrollOffset(0);
    }
  }, [value, events, selectedIndex]);

  /**
   * Calculate opacity based on distance from center (Apple-style depth effect)
   * Items closer to center are fully opaque, items further fade out
   */
  const getItemOpacity = useCallback((itemIndex: number): number => {
    const distanceFromSelected = Math.abs(itemIndex - selectedIndex);
    const offsetInfluence = Math.abs(scrollOffset) / ITEM_HEIGHT;
    
    // Adjust for scroll offset
    let adjustedDistance = distanceFromSelected;
    if (scrollOffset > 0 && itemIndex > selectedIndex) {
      adjustedDistance = Math.abs(itemIndex - selectedIndex - offsetInfluence);
    } else if (scrollOffset < 0 && itemIndex < selectedIndex) {
      adjustedDistance = Math.abs(itemIndex - selectedIndex + offsetInfluence);
    }
    
    // Fade out items further from center
    if (adjustedDistance === 0) return 1;
    if (adjustedDistance <= 1) return 0.6;
    if (adjustedDistance <= 2) return 0.35;
    return 0.15;
  }, [selectedIndex, scrollOffset]);

  /**
   * Calculate scale based on distance from center (Apple-style 3D wheel effect)
   */
  const getItemScale = useCallback((itemIndex: number): number => {
    const distanceFromSelected = Math.abs(itemIndex - selectedIndex);
    const offsetInfluence = Math.abs(scrollOffset) / ITEM_HEIGHT;
    
    let adjustedDistance = distanceFromSelected;
    if (scrollOffset > 0 && itemIndex > selectedIndex) {
      adjustedDistance = Math.abs(itemIndex - selectedIndex - offsetInfluence);
    } else if (scrollOffset < 0 && itemIndex < selectedIndex) {
      adjustedDistance = Math.abs(itemIndex - selectedIndex + offsetInfluence);
    }
    
    // Scale down items further from center
    if (adjustedDistance === 0) return 1;
    if (adjustedDistance <= 1) return 0.92;
    if (adjustedDistance <= 2) return 0.85;
    return 0.8;
  }, [selectedIndex, scrollOffset]);

  /**
   * Snap to nearest item with smooth animation
   */
  const snapToNearest = useCallback(() => {
    if (isAnimatingRef.current) return;
    
    // Calculate which item to snap to based on current offset
    const offsetInItems = scrollOffset / ITEM_HEIGHT;
    let targetIndex = selectedIndex;
    
    if (Math.abs(offsetInItems) > 0.3) {
      targetIndex = selectedIndex + Math.round(offsetInItems);
    }
    
    // Clamp to valid range
    targetIndex = Math.max(0, Math.min(events.length - 1, targetIndex));
    
    // Animate snap
    isAnimatingRef.current = true;
    const startOffset = scrollOffset;
    const targetOffset = (targetIndex - selectedIndex) * ITEM_HEIGHT;
    const startTime = performance.now();
    
    const animateSnap = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / SNAP_DURATION, 1);
      
      // Ease-out cubic for smooth snap
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      if (progress < 1) {
        setScrollOffset(startOffset + (targetOffset - startOffset) * easeOut);
        animationFrameRef.current = requestAnimationFrame(animateSnap);
      } else {
        // Animation complete
        setScrollOffset(0);
        setSelectedIndex(targetIndex);
        onChange(events[targetIndex]);
        isAnimatingRef.current = false;
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animateSnap);
  }, [scrollOffset, selectedIndex, events, onChange]);

  /**
   * Apply momentum physics for inertial scrolling
   */
  const applyMomentum = useCallback(() => {
    if (Math.abs(velocityRef.current) < MIN_VELOCITY) {
      snapToNearest();
      return;
    }
    
    // Apply velocity to scroll offset
    setScrollOffset((prev) => {
      const newOffset = prev + velocityRef.current;
      
      // Calculate boundaries
      const maxOffset = -selectedIndex * ITEM_HEIGHT;
      const minOffset = (events.length - 1 - selectedIndex) * ITEM_HEIGHT;
      
      // Add rubber-band effect at boundaries
      if (newOffset < maxOffset) {
        velocityRef.current *= 0.5; // Slow down at boundary
        return maxOffset + (newOffset - maxOffset) * 0.3;
      }
      if (newOffset > minOffset) {
        velocityRef.current *= 0.5;
        return minOffset + (newOffset - minOffset) * 0.3;
      }
      
      return newOffset;
    });
    
    // Apply deceleration
    velocityRef.current *= DECELERATION;
    
    animationFrameRef.current = requestAnimationFrame(applyMomentum);
  }, [selectedIndex, events.length, snapToNearest]);

  /**
   * Handle wheel events for mouse scrolling
   */
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      isAnimatingRef.current = false;
    }
    
    // Apply scroll delta directly
    const delta = e.deltaY * 0.5;
    
    setScrollOffset((prev) => {
      const newOffset = prev + delta;
      
      // Calculate boundaries with some overflow for rubber-band effect
      const maxOffset = -selectedIndex * ITEM_HEIGHT - ITEM_HEIGHT;
      const minOffset = (events.length - 1 - selectedIndex) * ITEM_HEIGHT + ITEM_HEIGHT;
      
      return Math.max(maxOffset, Math.min(minOffset, newOffset));
    });
    
    // Set velocity for momentum
    velocityRef.current = delta * 0.3;
    
    // Start momentum after a delay
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Debounce snap
    setTimeout(() => {
      if (!isDragging) {
        snapToNearest();
      }
    }, 150);
  }, [selectedIndex, events.length, isDragging, snapToNearest]);

  /**
   * Handle touch start for mobile scrolling
   */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    lastTouchYRef.current = e.touches[0].clientY;
    lastTimestampRef.current = performance.now();
    velocityRef.current = 0;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      isAnimatingRef.current = false;
    }
  }, []);

  /**
   * Handle touch move for drag scrolling
   */
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const currentTime = performance.now();
    const deltaY = lastTouchYRef.current - currentY;
    const deltaTime = currentTime - lastTimestampRef.current;
    
    // Calculate velocity
    if (deltaTime > 0) {
      velocityRef.current = (deltaY / deltaTime) * 16; // Normalize to ~60fps
    }
    
    setScrollOffset((prev) => {
      const newOffset = prev + deltaY;
      
      // Rubber-band boundaries
      const maxOffset = -selectedIndex * ITEM_HEIGHT - ITEM_HEIGHT * 2;
      const minOffset = (events.length - 1 - selectedIndex) * ITEM_HEIGHT + ITEM_HEIGHT * 2;
      
      if (newOffset < maxOffset || newOffset > minOffset) {
        return prev + deltaY * 0.3; // Rubber-band resistance
      }
      
      return newOffset;
    });
    
    lastTouchYRef.current = currentY;
    lastTimestampRef.current = currentTime;
  }, [isDragging, selectedIndex, events.length]);

  /**
   * Handle touch end - apply momentum or snap
   */
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    
    if (Math.abs(velocityRef.current) > MIN_VELOCITY) {
      animationFrameRef.current = requestAnimationFrame(applyMomentum);
    } else {
      snapToNearest();
    }
  }, [applyMomentum, snapToNearest]);

  /**
   * Handle keyboard navigation for accessibility
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        if (selectedIndex > 0) {
          const newIndex = selectedIndex - 1;
          setSelectedIndex(newIndex);
          onChange(events[newIndex]);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (selectedIndex < events.length - 1) {
          const newIndex = selectedIndex + 1;
          setSelectedIndex(newIndex);
          onChange(events[newIndex]);
        }
        break;
      case "Home":
        e.preventDefault();
        setSelectedIndex(0);
        onChange(events[0]);
        break;
      case "End":
        e.preventDefault();
        const lastIndex = events.length - 1;
        setSelectedIndex(lastIndex);
        onChange(events[lastIndex]);
        break;
    }
  }, [selectedIndex, events, onChange]);

  /**
   * Handle direct item click
   */
  const handleItemClick = useCallback((index: number) => {
    if (isAnimatingRef.current) return;
    
    // Animate to clicked item
    isAnimatingRef.current = true;
    const targetOffset = (index - selectedIndex) * ITEM_HEIGHT;
    const startOffset = scrollOffset;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / SNAP_DURATION, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      if (progress < 1) {
        setScrollOffset(startOffset + (targetOffset - startOffset) * easeOut);
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setScrollOffset(0);
        setSelectedIndex(index);
        onChange(events[index]);
        isAnimatingRef.current = false;
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [selectedIndex, scrollOffset, events, onChange]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Calculate container height
  const containerHeight = ITEM_HEIGHT * VISIBLE_ITEMS;

  return (
    <div
      className="flex flex-col space-y-3 w-full"
      data-testid={`event-selector-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Label */}
      <label
        htmlFor={inputId}
        className="text-lg md:text-xl font-semibold text-white dark:text-white"
        style={{
          fontFamily: "var(--font-ufc-heading)",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </label>

      {/* Wheel Picker Container */}
      <div
        ref={containerRef}
        id={inputId}
        role="listbox"
        aria-label={`${label} selector`}
        aria-activedescendant={`${inputId}-option-${selectedIndex}`}
        tabIndex={0}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        className="relative overflow-hidden rounded-xl bg-zinc-900/90 border-2 border-zinc-700 select-none cursor-ns-resize focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/30"
        style={{
          height: containerHeight,
          touchAction: "none", // Prevent browser scroll interference
        }}
      >
        {/* Gradient overlays for depth effect */}
        <div
          className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-zinc-900 to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Selection highlight bar */}
        <div
          className="absolute left-0 right-0 bg-zinc-800/60 border-y border-zinc-600/50 pointer-events-none"
          style={{
            top: (VISIBLE_ITEMS - 1) / 2 * ITEM_HEIGHT,
            height: ITEM_HEIGHT,
          }}
          aria-hidden="true"
        />

        {/* Scrollable items container */}
        <div
          className="relative transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${
              ((VISIBLE_ITEMS - 1) / 2) * ITEM_HEIGHT - selectedIndex * ITEM_HEIGHT - scrollOffset
            }px)`,
          }}
        >
          {events.map((event, index) => (
            <div
              key={event}
              id={`${inputId}-option-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => handleItemClick(index)}
              className="flex items-center justify-center px-4 transition-all duration-100 ease-out cursor-pointer"
              style={{
                height: ITEM_HEIGHT,
                opacity: getItemOpacity(index),
                transform: `scale(${getItemScale(index)})`,
                fontFamily: "var(--font-ufc-heading)",
                letterSpacing: "0.05em",
              }}
            >
              <span
                className={`text-xl md:text-2xl font-bold transition-colors duration-100 ${
                  index === selectedIndex
                    ? "text-white"
                    : "text-zinc-400"
                }`}
              >
                {event}
              </span>
            </div>
          ))}
        </div>

        {/* ARIA live region for screen readers */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {`Selected: ${events[selectedIndex]}`}
        </div>
      </div>

      {/* Hint text for non-touch devices */}
      <p
        className="text-xs text-zinc-500 text-center"
        aria-hidden="true"
      >
        Scroll or use ↑↓ keys to select
      </p>
    </div>
  );
};

export default EventSelector;

