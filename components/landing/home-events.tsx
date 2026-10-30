"use client";

import { useCallback, useState } from "react";
import { DashboardTabs, type TabValue } from "@/components/dashboard/DashboardTabs";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { PastEventsList } from "@/components/dashboard/PastEventsList";

const HomeEvents = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("upcoming");

  const handleTabChange = useCallback((tab: TabValue) => {
    setActiveTab(tab);
  }, []);

  return (
    <section
      id="events"
      aria-label="MMA News and Events"
      className="bg-black"
      style={{
        ["--font-ufc-heading" as string]:
          '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif',
      }}
    >
      <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <div
        role="tabpanel"
        id="tabpanel-upcoming"
        aria-labelledby="tab-upcoming"
        hidden={activeTab !== "upcoming"}
      >
        {activeTab === "upcoming" && (
          <div className="bg-black pt-8 sm:pt-10 md:pt-12 lg:pt-14 pb-10 sm:pb-12 md:pb-14 lg:pb-16">
            <section aria-label="MMA News">
              <NewsFeed animationDuration={800} />
            </section>
          </div>
        )}
      </div>

      <div
        role="tabpanel"
        id="tabpanel-past"
        aria-labelledby="tab-past"
        hidden={activeTab !== "past"}
      >
        {activeTab === "past" && (
          <div className="bg-black px-4 py-8 sm:py-10 md:py-12">
            <div className="max-w-5xl mx-auto">
              <PastEventsList initialLimit={5} showLoadMore />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeEvents;
