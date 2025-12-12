"use client";

import { useState, useCallback, useMemo } from "react";
import { Calendar, Filter, ChevronDown } from "lucide-react";
import { UFC_EVENTS_2025, type UFCEvent } from "@/data/ufc-events-2025";
import { EventAccordion } from "./EventAccordion";

type EventTypeFilter = "all" | "ppv" | "fight-night" | "apex";

interface PastEventsListProps {
  /** Initial number of events to show (default: 5) */
  initialLimit?: number;
  /** Show load more button (default: true) */
  showLoadMore?: boolean;
}

/**
 * PastEventsList - Displays list of past UFC 2025 events with filtering
 * Features accordion dropdowns, event type filtering, and responsive design
 */
export const PastEventsList = ({ 
  initialLimit = 5,
  showLoadMore = true 
}: PastEventsListProps) => {
  const [displayLimit, setDisplayLimit] = useState(initialLimit);
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter events based on selected type
  const filteredEvents = useMemo(() => {
    if (eventTypeFilter === "all") {
      return UFC_EVENTS_2025;
    }
    return UFC_EVENTS_2025.filter((event) => event.eventType === eventTypeFilter);
  }, [eventTypeFilter]);

  // Events to display (limited)
  const displayedEvents = useMemo(() => {
    return filteredEvents.slice(0, displayLimit);
  }, [filteredEvents, displayLimit]);

  const hasMoreEvents = displayLimit < filteredEvents.length;

  const handleLoadMore = useCallback(() => {
    setDisplayLimit((prev) => prev + 5);
  }, []);

  const handleFilterChange = useCallback((filter: EventTypeFilter) => {
    setEventTypeFilter(filter);
    setDisplayLimit(initialLimit);
    setIsFilterOpen(false);
  }, [initialLimit]);

  const handleToggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  // Get filter button label
  const getFilterLabel = () => {
    switch (eventTypeFilter) {
      case "ppv":
        return "PPV Events";
      case "fight-night":
        return "Fight Night";
      case "apex":
        return "UFC APEX";
      default:
        return "All Events";
    }
  };

  // Stats summary
  const totalEvents = filteredEvents.length;
  const totalFights = filteredEvents.reduce((sum, event) => {
    return sum + event.cards.reduce((cardSum, card) => cardSum + card.fights.length, 0);
  }, 0);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 
              className="text-2xl sm:text-3xl font-bold text-white"
              style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
            >
              UFC 2025 RESULTS
            </h2>
            <p className="text-sm text-zinc-400 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {totalEvents} Events • {totalFights} Total Fights
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={handleToggleFilter}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsFilterOpen(false);
              }}
              aria-expanded={isFilterOpen}
              aria-haspopup="listbox"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-white text-sm transition-colors"
            >
              <Filter className="w-4 h-4 text-zinc-400" />
              <span>{getFilterLabel()}</span>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Filter Options */}
            {isFilterOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10 overflow-hidden"
                role="listbox"
                aria-label="Filter by event type"
              >
                <FilterOption
                  label="All Events"
                  value="all"
                  isSelected={eventTypeFilter === "all"}
                  onClick={() => handleFilterChange("all")}
                />
                <FilterOption
                  label="PPV Events"
                  value="ppv"
                  isSelected={eventTypeFilter === "ppv"}
                  onClick={() => handleFilterChange("ppv")}
                  badgeClass="bg-red-500/20 text-red-400"
                />
                <FilterOption
                  label="Fight Night"
                  value="fight-night"
                  isSelected={eventTypeFilter === "fight-night"}
                  onClick={() => handleFilterChange("fight-night")}
                  badgeClass="bg-blue-500/20 text-blue-400"
                />
                <FilterOption
                  label="UFC APEX"
                  value="apex"
                  isSelected={eventTypeFilter === "apex"}
                  onClick={() => handleFilterChange("apex")}
                  badgeClass="bg-zinc-600/30 text-zinc-400"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events List */}
      {displayedEvents.length > 0 ? (
        <div className="space-y-4" role="list" aria-label="Past UFC events">
          {displayedEvents.map((event, index) => (
            <EventAccordion 
              key={event.id} 
              event={event}
              defaultExpanded={index === 0} // Expand first event by default
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-zinc-400 text-lg">No events found for this filter.</p>
        </div>
      )}

      {/* Load More Button */}
      {showLoadMore && hasMoreEvents && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-white font-bold uppercase tracking-wider rounded-lg transition-colors"
            style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
          >
            Load More Events
            <span className="ml-2 text-zinc-400">
              ({filteredEvents.length - displayLimit} remaining)
            </span>
          </button>
        </div>
      )}

      {/* Bottom Summary */}
      {!hasMoreEvents && displayedEvents.length > 0 && (
        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-500">
            Showing all {displayedEvents.length} events from 2025
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * FilterOption - Individual filter option in dropdown
 */
const FilterOption = ({
  label,
  value,
  isSelected,
  onClick,
  badgeClass,
}: {
  label: string;
  value: string;
  isSelected: boolean;
  onClick: () => void;
  badgeClass?: string;
}) => (
  <button
    role="option"
    aria-selected={isSelected}
    onClick={onClick}
    className={`
      w-full px-4 py-2.5 text-left text-sm flex items-center justify-between
      transition-colors hover:bg-zinc-700
      ${isSelected ? "bg-zinc-700 text-yellow-400" : "text-white"}
    `}
  >
    <span>{label}</span>
    {isSelected && (
      <span className="text-yellow-400">✓</span>
    )}
    {badgeClass && !isSelected && (
      <span className={`px-1.5 py-0.5 text-xs rounded ${badgeClass}`}>
        •
      </span>
    )}
  </button>
);

export default PastEventsList;
