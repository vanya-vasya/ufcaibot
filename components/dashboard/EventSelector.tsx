"use client";

import { DropdownSelect } from "./DropdownSelect";

/**
 * Event Selector - Dropdown select for UFC events
 * Uses the unified DropdownSelect component
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
  /** Fixed width class (e.g., "w-80", "w-[320px]") */
  widthClass?: string;
}

export const EventSelector = ({
  label,
  events,
  value,
  onChange,
  id,
  widthClass,
}: EventSelectorProps) => {
  return (
    <DropdownSelect
      label={label}
      options={events}
      value={value}
      onChange={onChange}
      placeholder="Choose Event"
      clearable={false}
      searchable={false}
      id={id}
      testId={`event-selector-${label.toLowerCase().replace(/\s+/g, "-")}`}
      widthClass={widthClass}
    />
  );
};

export default EventSelector;
