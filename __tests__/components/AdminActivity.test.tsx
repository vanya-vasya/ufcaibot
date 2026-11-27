import { fireEvent, render, screen, within } from "@testing-library/react";
import AdminDashboardPage from "@/app/(dashboard)/dashboard/admindashboard/page";

const fill = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

const generate = (tokens: string) => {
  fill("Email", "user@example.com");
  fill("Tokens spend", tokens);
  fill("First date", "01.11.2026");
  fill("Last date", "30.11.2026");
  fireEvent.click(screen.getByLabelText("Generate activity"));
};

const readTable = () => {
  const table = screen.getAllByRole("table")[0];
  const rows = within(table).getAllByRole("row").slice(1);
  return rows.map((row) => {
    const cells = within(row).getAllByRole("cell");
    return {
      tool: cells[2].textContent ?? "",
      tokens: Number(cells[3].textContent),
      total: Number(cells[4].textContent),
    };
  });
};

const PRICES: Record<string, number> = { ODDS: 10, STATS: 5, NEWS: 15, ULTIMATE: 25 };

describe("Admin activity generation", () => {
  it("lists the new tools and their prices in the form hint", () => {
    render(<AdminDashboardPage />);
    expect(screen.getByTestId("activity-tools-hint").textContent).toContain(
      "ODDS 10 · STATS 5 · NEWS 15 · ULTIMATE 25",
    );
  });

  it("generates rows with the new tool names, matching prices and an exact Total spent", () => {
    render(<AdminDashboardPage />);
    generate("100");

    const rows = readTable();
    expect(rows.length).toBeGreaterThan(0);

    const chronological = [...rows].sort((a, b) => a.total - b.total);
    let running = 0;
    chronological.forEach((row) => {
      expect(Object.keys(PRICES)).toContain(row.tool);
      expect(row.tokens).toBe(PRICES[row.tool]);
      running += row.tokens;
      expect(row.total).toBe(running);
    });

    expect(running).toBe(100);
    expect(Math.max(...rows.map((row) => row.total))).toBe(100);
    expect(screen.getByText(/rows · 100 tokens ·/)).toBeInTheDocument();
  });

  it("rounds an uneven target down and says so", () => {
    render(<AdminDashboardPage />);
    fill("Tokens spend", "103");
    expect(screen.getByTestId("activity-tools-hint").textContent).toContain("rounded down to 100");

    generate("103");
    expect(screen.getByText(/rows · 100 tokens ·/)).toBeInTheDocument();
  });

  it("rejects a target below the cheapest tool", () => {
    render(<AdminDashboardPage />);
    generate("4");
    expect(screen.getByRole("alert").textContent).toContain("at least 5");
  });
});
