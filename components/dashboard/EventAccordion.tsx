"use client";

import { useState, useCallback, useRef, KeyboardEvent } from "react";
import { ChevronDown, Calendar, MapPin, Trophy, Zap } from "lucide-react";
import type { UFCEvent, FightCard } from "@/data/ufc-events-2025";
import { 
  formatEventDate, 
  getEventTypeLabel, 
  getCardTypeLabel,
  getTotalFights,
  getFinishCount 
} from "@/data/ufc-events-2025";
import { FightResultCard } from "./FightResultCard";

interface EventAccordionProps {
  event: UFCEvent;
  defaultExpanded?: boolean;
}

/**
 * EventAccordion - Collapsible event card with fight cards inside
 * Features accessible keyboard navigation
 */
export const EventAccordion = ({ event, defaultExpanded = false }: EventAccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const totalFights = getTotalFights(event);
  const finishCount = getFinishCount(event);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        handleToggle();
        break;
      case "ArrowDown":
        if (isExpanded && contentRef.current) {
          e.preventDefault();
          const firstFocusable = contentRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }
        break;
    }
  }, [isExpanded, handleToggle]);

  // Get event type badge color
  const getEventTypeBadgeClass = () => {
    switch (event.eventType) {
      case "ppv":
        return "bg-red-500/20 border-red-500/50 text-red-400";
      case "fight-night":
        return "bg-blue-500/20 border-blue-500/50 text-blue-400";
      case "apex":
        return "bg-zinc-500/20 border-zinc-500/50 text-zinc-400";
      default:
        return "bg-zinc-500/20 border-zinc-500/50 text-zinc-400";
    }
  };

  return (
    <div 
      className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all duration-300"
      data-event-id={event.id}
    >
      {/* Accordion Header */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={`event-content-${event.id}`}
        className={`
          w-full p-4 sm:p-5 text-left transition-colors duration-200
          hover:bg-zinc-800/50 focus:outline-none focus-visible:ring-2 
          focus-visible:ring-yellow-500/50 focus-visible:ring-inset
          ${isExpanded ? "bg-zinc-800/30" : ""}
        `}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Event Info */}
          <div className="flex-1 min-w-0">
            {/* Event Type Badge & Name */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 text-xs font-bold uppercase border rounded ${getEventTypeBadgeClass()}`}>
                {getEventTypeLabel(event.eventType)}
              </span>
              <h3 
                className="text-lg sm:text-xl font-bold text-white truncate"
                style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
              >
                {event.name}
              </h3>
            </div>

            {/* Date & Location */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-500" />
                {formatEventDate(event.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-500" />
                {event.venue}, {event.location}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                {totalFights} Fights
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                {finishCount} Finishes
              </span>
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div 
            className={`
              flex-shrink-0 p-2 rounded-full bg-zinc-800 
              transition-transform duration-300
              ${isExpanded ? "rotate-180" : ""}
            `}
          >
            <ChevronDown className="w-5 h-5 text-zinc-400" />
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      <div
        id={`event-content-${event.id}`}
        ref={contentRef}
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}
        `}
        role="region"
        aria-labelledby={`event-header-${event.id}`}
        hidden={!isExpanded}
      >
        <div className="px-4 sm:px-5 pb-5 pt-2 space-y-6">
          {event.cards.map((card) => (
            <FightCardSection key={card.type} card={card} eventId={event.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * FightCardSection - Renders a fight card (Main, Prelims, etc.) with its fights
 */
const FightCardSection = ({ card, eventId }: { card: FightCard; eventId: string }) => {
  const getCardBorderColor = () => {
    switch (card.type) {
      case "main":
        return "border-l-red-500";
      case "prelims":
        return "border-l-blue-500";
      case "early-prelims":
        return "border-l-zinc-500";
      default:
        return "border-l-zinc-600";
    }
  };

  return (
    <section>
      {/* Card Type Header */}
      <div className={`mb-3 pl-3 border-l-2 ${getCardBorderColor()}`}>
        <h4 
          className="text-sm font-bold text-zinc-300 uppercase tracking-wider"
          style={{ fontFamily: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif' }}
        >
          {getCardTypeLabel(card.type)}
        </h4>
        <p className="text-xs text-zinc-500">{card.fights.length} fights</p>
      </div>

      {/* Fights List */}
      <div 
        className="space-y-3"
        role="list"
        aria-label={`${getCardTypeLabel(card.type)} fights`}
      >
        {card.fights.map((fight) => (
          <FightResultCard key={fight.id} fight={fight} />
        ))}
      </div>
    </section>
  );
};

export default EventAccordion;
