"use client";

import { useCallback } from "react";

/**
 * Simple Event Selector - Two clickable event options
 * Clean, frameless design aligned with FighterInput layout
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

export const EventSelector = ({
  label,
  events,
  value,
  onChange,
  id,
}: EventSelectorProps) => {
  const inputId = id || `event-selector-${label.toLowerCase().replace(/\s+/g, "-")}`;

  /**
   * Handle click on an event option
   */
  const handleEventClick = useCallback(
    (event: string) => {
      onChange(event);
    },
    [onChange]
  );

  /**
   * Handle keyboard navigation for accessibility
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, event: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChange(event);
      }
    },
    [onChange]
  );

  return (
    <div
      className="flex flex-col space-y-3 w-full"
      data-testid={`event-selector-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Label - matches FighterInput label styling */}
      <label
        id={`${inputId}-label`}
        className="text-lg md:text-xl font-semibold text-white dark:text-white"
        style={{
          fontFamily: "var(--font-ufc-heading)",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </label>

      {/* Event options - simple clickable text items */}
      <div
        role="listbox"
        aria-labelledby={`${inputId}-label`}
        aria-activedescendant={`${inputId}-option-${events.indexOf(value)}`}
        className="flex flex-col"
      >
        {events.map((event, index) => {
          const isSelected = event === value;
          
          return (
            <div
              key={event}
              id={`${inputId}-option-${index}`}
              role="option"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => handleEventClick(event)}
              onKeyDown={(e) => handleKeyDown(e, event)}
              className={`
                px-4 py-3 cursor-pointer transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-zinc-500/50 rounded-lg
                ${isSelected 
                  ? "text-white" 
                  : "text-zinc-500 hover:text-zinc-300"
                }
              `}
              style={{
                fontFamily: "var(--font-ufc-heading)",
                letterSpacing: "0.02em",
              }}
            >
              <span className="text-lg md:text-xl font-semibold">
                {event}
              </span>
            </div>
          );
        })}
      </div>

      {/* ARIA live region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {`Selected: ${value}`}
      </div>
    </div>
  );
};

export default EventSelector;
