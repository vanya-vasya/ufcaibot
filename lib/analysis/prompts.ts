import type { AnalysisProductId, AnalysisSection } from "./products";
import { SECTION_META } from "./products";
import type { OddsData } from "./odds";
import type { HistoryData } from "./history";
import type { NewsData } from "./news";

export interface PromptInput {
  fighterA: string;
  fighterB: string;
  odds: OddsData | null;
  stats: HistoryData | null;
  news: NewsData | null;
}

export const NO_DATA_SENTENCE = "No data available for this matchup.";

const FORMAT_RULES = `CRITICAL FORMATTING RULES:
- Do NOT output "\\n" or "\\n\\n" as text and do NOT output backslashes or any escape characters.
- Do NOT output leading or trailing hyphens, bullets or "•" markers.
- Do NOT output markdown formatting, quotes or ending characters like "}".
- Do NOT output "Content for", extra section titles or parentheses-based labels such as "(analysis)".
- Do NOT output any characters outside the requested blocks.
- Each block must include statistical analysis and numerical data.
- Each block must be a single compact paragraph of plain English with a maximum of 2 sentences.`;

const BLOCK_GUIDANCE: Record<AnalysisSection, (matchup: string) => string> = {
  odds: (matchup) =>
    `Block 1: It is necessary to indicate in one short sentence which fighter is favored for the upcoming fight between ${matchup}. Next, it should describe bookmaker pricing behavior, discrepancies, and what the implied probabilities suggest about why this fighter is likely to win. It must include statistical analysis and numerical data.`,
  stats: (matchup) =>
    `Block 2: It is necessary to indicate in one short sentence which fighter is favored for the upcoming fight between ${matchup}. Next, it should compare fighter statistics, strengths, weaknesses, style tendencies, and likely paths to victory to explain why this fighter is likely to win. It must include statistical analysis and numerical data. The history dataset ends on the date given in datasetLastFightDate, so treat later fights as unknown.`,
  news: (matchup) =>
    `Block 3: It is necessary to indicate in one short sentence which fighter is favored for the upcoming fight between ${matchup}. Next, it should summarize sentiment from media and experts based on the supplied articles, including expected narratives and public perception, to explain why this fighter is likely to win. It must include statistical analysis and numerical data (for example the share of articles favoring each fighter).`,
};

const SECTION_DATA_LABEL: Record<AnalysisSection, string> = {
  odds: "Odds Data",
  stats: "Fighter Data",
  news: "News Articles",
};

const outputHeading = (section: AnalysisSection) =>
  `Block ${SECTION_META[section].blockNumber}: ${SECTION_META[section].blockTitle}`;

const serialize = (data: unknown): string =>
  data === null ? "NO DATA AVAILABLE" : JSON.stringify(data);

export const buildSystemPrompt = () =>
  "You are an expert sports betting analyst covering UFC and MMA. You only use the data supplied by the user and never invent statistics.";

export const buildUserPrompt = (
  product: AnalysisProductId,
  sections: readonly AnalysisSection[],
  input: PromptInput
): string => {
  const matchup = `${input.fighterA} vs ${input.fighterB}`;
  const dataBySection: Record<AnalysisSection, unknown> = {
    odds: input.odds,
    stats: input.stats,
    news: input.news,
  };

  const dataBlocks = sections
    .map(
      (section) =>
        `${SECTION_DATA_LABEL[section]} (feeds Block ${SECTION_META[section].blockNumber}): ${serialize(dataBySection[section])}`
    )
    .join("\n");

  const formatTemplate = sections
    .map((section) => `${outputHeading(section)}\n[one clean paragraph]`)
    .join("\n\n");

  const guidance = sections.map((section) => BLOCK_GUIDANCE[section](matchup)).join("\n   ");

  const scope =
    product === "ultimate"
      ? "Analyze the following three data sets"
      : "Analyze the following data set";

  return `${scope} for the upcoming fight between ${matchup}.

${dataBlocks}

Your task:

1. Produce exactly ${sections.length} block${sections.length > 1 ? "s" : ""} of output, titled: ${sections.map(outputHeading).join(" | ")}.

2. ${FORMAT_RULES}

3. Guidance for content:
   ${guidance}
   If a data set says NO DATA AVAILABLE, write exactly "${NO_DATA_SENTENCE}" as the paragraph of its block and do not speculate.

4. FINAL STRICT OUTPUT FORMAT (no extra characters, no empty lines, no quotes, no escapes):

${formatTemplate}`;
};
