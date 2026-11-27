import { fetchHistoryData } from "./history";
import { generateAnalysisText } from "./llm";
import { fetchNewsData } from "./news";
import { fetchOddsData } from "./odds";
import {
  buildSystemPrompt,
  buildUserPrompt,
  NO_DATA_SENTENCE,
  type PromptInput,
} from "./prompts";
import {
  ANALYSIS_PRODUCTS,
  SECTION_META,
  type AnalysisProductId,
  type AnalysisSection,
} from "./products";

export interface AnalysisResult {
  /** "Block N: Title\n<paragraph>" blocks, parseable by parseContentBlocks. */
  content: string;
  sections: readonly AnalysisSection[];
  sourcesAvailable: Record<AnalysisSection, boolean>;
  /** Whether the user should pay for this result. */
  charge: boolean;
}

/** Ultimate is only billed when at least this many of its three sources had data. */
const ULTIMATE_MIN_SOURCES = 2;

const safely = async <T>(label: string, load: () => Promise<T | null>): Promise<T | null> => {
  try {
    return await load();
  } catch (error) {
    console.error(`[analysis] ${label} source failed`, error);
    return null;
  }
};

const blockHeading = (section: AnalysisSection) =>
  `Block ${SECTION_META[section].blockNumber}: ${SECTION_META[section].blockTitle}`;

/** Guarantees every requested block has its heading so the article parser can split it. */
const ensureBlockHeadings = (text: string, sections: readonly AnalysisSection[]): string => {
  const hasAllHeadings = sections.every((section) =>
    new RegExp(`block\\s*${SECTION_META[section].blockNumber}`, "i").test(text)
  );
  if (hasAllHeadings) return text;
  if (sections.length === 1) return `${blockHeading(sections[0])}\n${text}`;
  return text;
};

const noDataContent = (sections: readonly AnalysisSection[]) =>
  sections.map((section) => `${blockHeading(section)}\n${NO_DATA_SENTENCE}`).join("\n\n");

export const runAnalysis = async (
  product: AnalysisProductId,
  fighterA: string,
  fighterB: string
): Promise<AnalysisResult> => {
  const { sections } = ANALYSIS_PRODUCTS[product];

  const [odds, stats, news] = await Promise.all([
    sections.includes("odds") ? safely("odds", () => fetchOddsData(fighterA, fighterB)) : null,
    sections.includes("stats") ? safely("stats", () => fetchHistoryData(fighterA, fighterB)) : null,
    sections.includes("news") ? safely("news", () => fetchNewsData(fighterA, fighterB)) : null,
  ]);

  const sourcesAvailable: Record<AnalysisSection, boolean> = {
    odds: Boolean(odds),
    stats: Boolean(stats),
    news: Boolean(news),
  };
  const availableCount = sections.filter((section) => sourcesAvailable[section]).length;

  if (availableCount === 0) {
    return { content: noDataContent(sections), sections, sourcesAvailable, charge: false };
  }

  const input: PromptInput = { fighterA, fighterB, odds, stats, news };
  const text = await generateAnalysisText(
    buildSystemPrompt(),
    buildUserPrompt(product, sections, input)
  );

  const requiredSources = product === "ultimate" ? ULTIMATE_MIN_SOURCES : 1;

  return {
    content: ensureBlockHeadings(text, sections),
    sections,
    sourcesAvailable,
    charge: availableCount >= requiredSources,
  };
};
