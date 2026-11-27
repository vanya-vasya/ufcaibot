import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UFCArticle } from "@/components/dashboard/UFCArticle";

const mockToBlob = jest.fn();
const mockPdf = jest.fn((_element: unknown) => ({ toBlob: mockToBlob }));

jest.mock("@react-pdf/renderer", () => ({ pdf: (element: unknown) => mockPdf(element) }));
jest.mock("@/components/pdf/analysis-report", () => ({
  __esModule: true,
  default: () => null,
}));

const renderedReportProps = () =>
  (mockPdf.mock.calls[0][0] as { props: Record<string, unknown> }).props;
jest.mock("@/components/dashboard/AnalysisInfographic", () => ({ AnalysisInfographic: () => null }));

const CONTENT =
  "Block 1: Odds Data\nHolloway is favored.\n\nBlock 2: Fighters Data\nHolloway lands more.\n\nBlock 3: Sentiment Analysis\nMedia agrees.";

const renderArticle = (props: Partial<React.ComponentProps<typeof UFCArticle>> = {}) =>
  render(
    <UFCArticle
      content={CONTENT}
      fighterA="Max Holloway"
      fighterB="Charles Oliveira"
      timestamp="2026-11-27T15:00:00.000Z"
      onClose={jest.fn()}
      productLabel="ULTIMATE"
      {...props}
    />
  );

describe("UFCArticle PDF download", () => {
  let clickSpy: jest.SpyInstance;
  let lastDownloadName = "";

  beforeEach(() => {
    jest.clearAllMocks();
    mockToBlob.mockResolvedValue(new Blob(["pdf"]));
    URL.createObjectURL = jest.fn(() => "blob:report");
    URL.revokeObjectURL = jest.fn();
    clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        lastDownloadName = this.download;
      });
  });

  afterEach(() => clickSpy.mockRestore());

  it("shows a Download PDF button", () => {
    renderArticle();

    expect(screen.getByTestId("download-pdf")).toHaveTextContent("Download PDF");
  });

  it("builds the PDF from the parsed sections and downloads it", async () => {
    renderArticle();

    fireEvent.click(screen.getByTestId("download-pdf"));

    await waitFor(() => expect(clickSpy).toHaveBeenCalledTimes(1));
    expect(renderedReportProps()).toMatchObject({
      fighterA: "Max Holloway",
      fighterB: "Charles Oliveira",
      productLabel: "ULTIMATE",
      sections: [
        { heading: "MATCHUP ANALYSIS", text: "Holloway is favored." },
        { heading: "FIGHTERS ANALYSIS", text: "Holloway lands more." },
        { heading: "SENTIMENT ANALYSIS", text: "Media agrees." },
      ],
    });
    expect(lastDownloadName).toBe("ufcaibot-ultimate-max-holloway-vs-charles-oliveira.pdf");
  });

  it("only includes the sections that are shown for single products", async () => {
    renderArticle({
      sections: ["stats"],
      content: "Block 2: Fighters Data\nHolloway lands more.",
      productLabel: "STATS",
    });

    fireEvent.click(screen.getByTestId("download-pdf"));

    await waitFor(() => expect(mockPdf).toHaveBeenCalled());
    expect(renderedReportProps().sections).toEqual([
      { heading: "FIGHTERS ANALYSIS", text: "Holloway lands more." },
    ]);
  });

  it("re-enables the button when PDF generation fails", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    mockToBlob.mockRejectedValue(new Error("render failed"));
    renderArticle();

    fireEvent.click(screen.getByTestId("download-pdf"));

    await waitFor(() => expect(screen.getByTestId("download-pdf")).not.toBeDisabled());
    expect(clickSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
