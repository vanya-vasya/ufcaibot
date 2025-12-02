"use client";

import { useCallback } from "react";

/**
 * Fight Selector - Clickable fight options matching EventSelector design
 * Clean, frameless design with same styling as Events panel
 */

interface FightSelectorProps {
  /** Label displayed above the selector */
  label: string;
  /** List of fight options to display */
  fights: string[];
  /** Currently selected fight value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Optional ID for accessibility */
  id?: string;
}

export const FightSelector = ({
  label,
  fights,
  value,
  onChange,
  id,
}: FightSelectorProps) => {
  const inputId = id || `fight-selector-${label.toLowerCase().replace(/\s+/g, "-")}`;

  /**
   * Handle click on a fight option
   */
  const handleFightClick = useCallback(
    (fight: string) => {
      onChange(fight);
    },
    [onChange]
  );

  /**
   * Handle keyboard navigation for accessibility
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, fight: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChange(fight);
      }
    },
    [onChange]
  );

  return (
    <div
      className="flex flex-col space-y-3 w-full"
      data-testid={`fight-selector-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Label - matches EventSelector label styling */}
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

      {/* Fight options - simple clickable text items matching Events design */}
      <div
        role="listbox"
        aria-labelledby={`${inputId}-label`}
        aria-activedescendant={`${inputId}-option-${fights.indexOf(value)}`}
        className="flex flex-col"
      >
        {fights.map((fight, index) => {
          const isSelected = fight === value;
          
          return (
            <div
              key={fight}
              id={`${inputId}-option-${index}`}
              role="option"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => handleFightClick(fight)}
              onKeyDown={(e) => handleKeyDown(e, fight)}
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
                {fight}
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

export default FightSelector;

