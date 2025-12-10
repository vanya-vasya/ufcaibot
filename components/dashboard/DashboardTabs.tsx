"use client";

import { useCallback, useRef, KeyboardEvent } from "react";
import { fontWeights, lineHeights, letterSpacing } from "@/config/ufc-font";

type TabValue = "upcoming" | "past";

interface DashboardTabsProps {
  /** Currently active tab */
  activeTab: TabValue;
  /** Callback when tab changes */
  onTabChange: (tab: TabValue) => void;
}

/**
 * Dashboard Tabs - Segmented control for Upcoming/Past events
 * Placed directly below the header, split evenly with a vertical divider
 * Includes accessible tab semantics and keyboard navigation
 */
export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const upcomingRef = useRef<HTMLButtonElement>(null);
  const pastRef = useRef<HTMLButtonElement>(null);
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';

  const handleTabClick = useCallback(
    (tab: TabValue) => {
      onTabChange(tab);
    },
    [onTabChange]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, currentTab: TabValue) => {
      const tabs: TabValue[] = ["upcoming", "past"];
      const currentIndex = tabs.indexOf(currentTab);

      let newIndex: number | null = null;

      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case "Home":
          event.preventDefault();
          newIndex = 0;
          break;
        case "End":
          event.preventDefault();
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      if (newIndex !== null) {
        const newTab = tabs[newIndex];
        onTabChange(newTab);
        // Focus the new tab
        if (newTab === "upcoming") {
          upcomingRef.current?.focus();
        } else {
          pastRef.current?.focus();
        }
      }
    },
    [onTabChange]
  );

  return (
    <div className="w-full bg-black border-b border-zinc-800">
      <div
        role="tablist"
        aria-label="Event timeline"
        className="mx-auto max-w-[1350px] flex"
      >
        {/* Upcoming Tab */}
        <button
          ref={upcomingRef}
          role="tab"
          id="tab-upcoming"
          aria-selected={activeTab === "upcoming"}
          aria-controls="tabpanel-upcoming"
          tabIndex={activeTab === "upcoming" ? 0 : -1}
          onClick={() => handleTabClick("upcoming")}
          onKeyDown={(e) => handleKeyDown(e, "upcoming")}
          className={`
            dashboard-tab flex-1 py-3 px-4 text-center transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black
            ${activeTab === "upcoming" 
              ? "dashboard-tab-active text-white border-b-2 border-white" 
              : "dashboard-tab-inactive text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent"
            }
          `}
        >
          <span className="dashboard-tab-text">Upcoming</span>
        </button>

        {/* Vertical Divider */}
        <div 
          className="w-px bg-zinc-700 my-2" 
          role="separator" 
          aria-orientation="vertical"
        />

        {/* Past Tab */}
        <button
          ref={pastRef}
          role="tab"
          id="tab-past"
          aria-selected={activeTab === "past"}
          aria-controls="tabpanel-past"
          tabIndex={activeTab === "past" ? 0 : -1}
          onClick={() => handleTabClick("past")}
          onKeyDown={(e) => handleKeyDown(e, "past")}
          className={`
            dashboard-tab flex-1 py-3 px-4 text-center transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black
            ${activeTab === "past" 
              ? "dashboard-tab-active text-white border-b-2 border-white" 
              : "dashboard-tab-inactive text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent"
            }
          `}
        >
          <span className="dashboard-tab-text">Past</span>
        </button>
      </div>

      <style jsx>{`
        .dashboard-tab-text {
          font-family: ${ufcHeadingFont};
          font-weight: ${fontWeights.bold};
          font-size: 14px;
          line-height: ${lineHeights.snug};
          letter-spacing: ${letterSpacing.wide};
          text-transform: uppercase;
        }

        .dashboard-tab-active .dashboard-tab-text {
          font-weight: ${fontWeights.bold};
        }

        .dashboard-tab:hover .dashboard-tab-text {
          transform: scale(1.02);
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .dashboard-tab,
          .dashboard-tab-text {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardTabs;

export type { TabValue };
