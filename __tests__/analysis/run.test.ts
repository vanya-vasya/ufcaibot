import { runAnalysis } from "@/lib/analysis/run";
import { fetchOddsData } from "@/lib/analysis/odds";
import { fetchHistoryData } from "@/lib/analysis/history";
import { fetchNewsData } from "@/lib/analysis/news";
import { generateAnalysisText } from "@/lib/analysis/llm";

jest.mock("@/lib/analysis/odds", () => ({ fetchOddsData: jest.fn() }));
jest.mock("@/lib/analysis/history", () => ({ fetchHistoryData: jest.fn() }));
jest.mock("@/lib/analysis/news", () => ({ fetchNewsData: jest.fn() }));
jest.mock("@/lib/analysis/llm", () => ({ generateAnalysisText: jest.fn() }));

const mockOdds = fetchOddsData as jest.Mock;
const mockHistory = fetchHistoryData as jest.Mock;
const mockNews = fetchNewsData as jest.Mock;
const mockLlm = generateAnalysisText as jest.Mock;

const ODDS = { bookmakerCount: 3 };
const HISTORY = { fighters: [null, null] };
const NEWS = { articles: [{ title: "t" }] };

describe("runAnalysis", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    mockLlm.mockResolvedValue("Block 1: Odds Data\nHolloway is favored.");
  });

  it("only loads the source that belongs to a single product", async () => {
    mockOdds.mockResolvedValue(ODDS);

    const result = await runAnalysis("odds", "Max Holloway", "Charles Oliveira");

    expect(mockOdds).toHaveBeenCalledTimes(1);
    expect(mockHistory).not.toHaveBeenCalled();
    expect(mockNews).not.toHaveBeenCalled();
    expect(result.sections).toEqual(["odds"]);
    expect(result.charge).toBe(true);
    expect(result.content).toBe("Block 1: Odds Data\nHolloway is favored.");
  });

  it("adds the block heading when the model leaves it out", async () => {
    mockHistory.mockResolvedValue(HISTORY);
    mockLlm.mockResolvedValue("Holloway is favored on the numbers.");

    const result = await runAnalysis("stats", "Max Holloway", "Charles Oliveira");

    expect(result.content).toBe("Block 2: Fighters Data\nHolloway is favored on the numbers.");
  });

  it("skips the model and does not charge when a single product has no data", async () => {
    mockNews.mockResolvedValue(null);

    const result = await runAnalysis("news", "Max Holloway", "Charles Oliveira");

    expect(mockLlm).not.toHaveBeenCalled();
    expect(result.charge).toBe(false);
    expect(result.content).toContain("Block 3: Sentiment Analysis");
    expect(result.content).toContain("No data available");
  });

  it("treats a failing source as missing data instead of failing the request", async () => {
    mockOdds.mockRejectedValue(new Error("quota exceeded"));

    const result = await runAnalysis("odds", "Max Holloway", "Charles Oliveira");

    expect(result.sourcesAvailable.odds).toBe(false);
    expect(result.charge).toBe(false);
  });

  it("charges ultimate when at least two of three sources have data", async () => {
    mockOdds.mockResolvedValue(ODDS);
    mockHistory.mockResolvedValue(HISTORY);
    mockNews.mockResolvedValue(null);

    const result = await runAnalysis("ultimate", "Max Holloway", "Charles Oliveira");

    expect(mockLlm).toHaveBeenCalledTimes(1);
    expect(result.sections).toEqual(["odds", "stats", "news"]);
    expect(result.sourcesAvailable).toEqual({ odds: true, stats: true, news: false });
    expect(result.charge).toBe(true);
  });

  it("generates but does not charge ultimate with only one source", async () => {
    mockNews.mockResolvedValue(NEWS);

    const result = await runAnalysis("ultimate", "Max Holloway", "Charles Oliveira");

    expect(mockLlm).toHaveBeenCalledTimes(1);
    expect(result.charge).toBe(false);
  });

  it("does not call the model for ultimate when every source is empty", async () => {
    const result = await runAnalysis("ultimate", "Max Holloway", "Charles Oliveira");

    expect(mockLlm).not.toHaveBeenCalled();
    expect(result.charge).toBe(false);
    expect(result.content.match(/No data available/g)).toHaveLength(3);
  });
});
