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
}

export const EventSelector = ({
  label,
  events,
  value,
  onChange,
  id,
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
    />
  );
};

export default EventSelector;
