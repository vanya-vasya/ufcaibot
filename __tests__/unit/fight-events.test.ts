import {
  PAST_EVENTS,
  UPCOMING_EVENTS,
  UPCOMING_EVENT_NAMES,
  UPCOMING_FIGHTS_BY_EVENT,
  getEventNameForFight,
  getFightLabel,
} from "@/data/fight-events";

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
    expect(getEventNameForFight("RENATO MOICANO VS TOM NOLAN")).toBe("MMA FIGHT NIGHT: MOICANO VS NOLAN");
    expect(getEventNameForFight("NOBODY VS NOBODY")).toBeUndefined();
  });

  it("builds a unique label for every upcoming fight", () => {
    const labels = Object.values(UPCOMING_FIGHTS_BY_EVENT).flat();
    expect(new Set(labels).size).toBe(labels.length);
  });
});
