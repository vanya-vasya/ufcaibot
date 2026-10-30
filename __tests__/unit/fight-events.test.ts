import {
  PAST_EVENTS,
  UPCOMING_EVENTS,
  UPCOMING_EVENT_NAMES,
  UPCOMING_FIGHTS_BY_EVENT,
  getEventNameForFight,
  getFightLabel,
} from "@/data/fight-events";
import { UFC326_FIGHTER_STATS } from "@/data/ufc326-fighter-stats";
import { UFC_FN_EMMETT_VS_VALLEJOS_FIGHTER_STATS } from "@/data/ufc-fn-emmett-vs-vallejos-fighter-stats";
import { UFC_FN_EVLOEV_VS_MURPHY_FIGHTER_STATS } from "@/data/ufc-fn-evloev-vs-murphy-fighter-stats";
import { UFC_FN_ADESANYA_VS_PYFER_FIGHTER_STATS } from "@/data/ufc-fn-adesanya-vs-pyfer-fighter-stats";

const ALL_FIGHTER_STATS: Record<string, unknown> = {
  ...UFC326_FIGHTER_STATS,
  ...UFC_FN_EMMETT_VS_VALLEJOS_FIGHTER_STATS,
  ...UFC_FN_EVLOEV_VS_MURPHY_FIGHTER_STATS,
  ...UFC_FN_ADESANYA_VS_PYFER_FIGHTER_STATS,
};

describe("fight-events (single source of truth)", () => {
  it("has unique event ids and names", () => {
    const upcomingIds = UPCOMING_EVENTS.map((e) => e.id);
    const pastIds = PAST_EVENTS.map((e) => e.id);
    expect(new Set(upcomingIds).size).toBe(upcomingIds.length);
    expect(new Set(pastIds).size).toBe(pastIds.length);
    expect(new Set(UPCOMING_EVENT_NAMES).size).toBe(UPCOMING_EVENT_NAMES.length);
  });

  it("builds uppercase 'A VS B' labels", () => {
    expect(getFightLabel({ fighterA: "Max Holloway", fighterB: "Charles Oliveira" })).toBe(
      "MAX HOLLOWAY VS CHARLES OLIVEIRA"
    );
  });

  it("exposes fights for every upcoming event", () => {
    UPCOMING_EVENTS.forEach((event) => {
      expect(event.fights.length).toBeGreaterThan(0);
      expect(UPCOMING_FIGHTS_BY_EVENT[event.name]).toHaveLength(event.fights.length);
    });
  });

  it("maps a fight back to its tournament", () => {
    expect(getEventNameForFight("MAX HOLLOWAY VS CHARLES OLIVEIRA")).toBe("MMA 326");
    expect(getEventNameForFight("NOBODY VS NOBODY")).toBeUndefined();
  });

  it("has comparison stats for every upcoming fight", () => {
    const missing = Object.values(UPCOMING_FIGHTS_BY_EVENT)
      .flat()
      .filter((label) => !(label in ALL_FIGHTER_STATS));
    expect(missing).toEqual([]);
  });
});
