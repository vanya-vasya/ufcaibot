import { render, screen, fireEvent } from "@testing-library/react";
import { AnalysisProductButtons } from "@/components/dashboard/AnalysisProductButtons";

describe("AnalysisProductButtons", () => {
  it("renders the four products with their prices", () => {
    render(<AnalysisProductButtons onSelect={jest.fn()} />);

    ["odds", "stats", "news", "ultimate"].forEach((id) => {
      expect(screen.getByTestId(`analysis-product-${id}`)).toBeInTheDocument();
    });
    expect(screen.getByTestId("analysis-product-odds")).toHaveTextContent("ODDS");
    expect(screen.getByTestId("analysis-product-stats")).toHaveTextContent("STATS");
    expect(screen.getByTestId("analysis-product-news")).toHaveTextContent("NEWS");
    expect(screen.getByText("ULTIMATE")).toBeInTheDocument();
    expect(screen.getByText("10 TOKENS")).toBeInTheDocument();
    expect(screen.getByText("5 TOKENS")).toBeInTheDocument();
    expect(screen.getByText("15 TOKENS")).toBeInTheDocument();
    expect(screen.getByText("25 TOKENS")).toBeInTheDocument();
  });

  it("highlights that ultimate combines the other three products", () => {
    render(<AnalysisProductButtons onSelect={jest.fn()} />);

    const ultimate = screen.getByTestId("analysis-product-ultimate");
    expect(ultimate).toHaveTextContent("ODDS");
    expect(ultimate).toHaveTextContent("STATS");
    expect(ultimate).toHaveTextContent("NEWS");
  });

  it("reports which product was clicked", () => {
    const onSelect = jest.fn();
    render(<AnalysisProductButtons onSelect={onSelect} />);

    fireEvent.click(screen.getByTestId("analysis-product-stats"));
    fireEvent.click(screen.getByTestId("analysis-product-ultimate"));

    expect(onSelect).toHaveBeenNthCalledWith(1, "stats");
    expect(onSelect).toHaveBeenNthCalledWith(2, "ultimate");
  });

  it("locks every button while one product is running", () => {
    const onSelect = jest.fn();
    render(<AnalysisProductButtons onSelect={onSelect} activeProduct="news" />);

    expect(screen.getByTestId("analysis-product-news")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("ANALYZING")).toBeInTheDocument();
    ["odds", "stats", "news", "ultimate"].forEach((id) => {
      expect(screen.getByTestId(`analysis-product-${id}`)).toBeDisabled();
    });
  });

  it("is disabled when no fight is selected", () => {
    const onSelect = jest.fn();
    render(<AnalysisProductButtons onSelect={onSelect} disabled />);

    fireEvent.click(screen.getByTestId("analysis-product-odds"));

    expect(onSelect).not.toHaveBeenCalled();
  });
});
