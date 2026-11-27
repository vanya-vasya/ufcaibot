export type AnalysisSection = "odds" | "stats" | "news";

export type AnalysisProductId = "odds" | "stats" | "news" | "ultimate";

export interface AnalysisProduct {
  id: AnalysisProductId;
  label: string;
  description: string;
  cost: number;
  sections: readonly AnalysisSection[];
}

export interface SectionMeta {
  blockNumber: 1 | 2 | 3;
  blockTitle: string;
  heading: string;
}

export const ALL_SECTIONS: readonly AnalysisSection[] = ["odds", "stats", "news"];

export const SECTION_META: Record<AnalysisSection, SectionMeta> = {
  odds: { blockNumber: 1, blockTitle: "Odds Data", heading: "MATCHUP ANALYSIS" },
  stats: { blockNumber: 2, blockTitle: "Fighters Data", heading: "FIGHTERS ANALYSIS" },
  news: { blockNumber: 3, blockTitle: "Sentiment Analysis", heading: "SENTIMENT ANALYSIS" },
};

export const ANALYSIS_PRODUCTS: Record<AnalysisProductId, AnalysisProduct> = {
  odds: {
    id: "odds",
    label: "ODDS",
    description: "Bookmaker lines and implied win probabilities",
    cost: 10,
    sections: ["odds"],
  },
  stats: {
    id: "stats",
    label: "STATS",
    description: "Fight history and career statistics",
    cost: 5,
    sections: ["stats"],
  },
  news: {
    id: "news",
    label: "NEWS",
    description: "Media coverage and sentiment",
    cost: 15,
    sections: ["news"],
  },
  ultimate: {
    id: "ultimate",
    label: "ULTIMATE",
    description: "Odds, stats and news combined",
    cost: 25,
    sections: ALL_SECTIONS,
  },
};

export const ANALYSIS_PRODUCT_ORDER: readonly AnalysisProductId[] = [
  "odds",
  "stats",
  "news",
  "ultimate",
];

export const isAnalysisProductId = (value: unknown): value is AnalysisProductId =>
  typeof value === "string" && value in ANALYSIS_PRODUCTS;
