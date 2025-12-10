"use client";

import { DropdownSelect } from "./DropdownSelect";

/**
 * Fight Selector - Dropdown select for UFC fights
 * Uses the unified DropdownSelect component with search enabled for large lists
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
  /** Fixed width class (e.g., "w-80", "w-[320px]") */
  widthClass?: string;
}

export const FightSelector = ({
  label,
  fights,
  value,
  onChange,
  id,
  widthClass,
}: FightSelectorProps) => {
  return (
    <DropdownSelect
      label={label}
      options={fights}
      value={value}
      onChange={onChange}
      placeholder="Choose Fight"
      clearable={true}
      searchable={fights.length >= 5}
      searchThreshold={5}
      id={id}
      testId={`fight-selector-${label.toLowerCase().replace(/\s+/g, "-")}`}
      widthClass={widthClass}
    />
  );
};

export default FightSelector;
