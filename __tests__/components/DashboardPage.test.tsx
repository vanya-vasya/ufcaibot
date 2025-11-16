import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "@/app/(dashboard)/dashboard/page";

// Mock the AnimatedIntro component to control timing in tests
jest.mock("@/components/dashboard/AnimatedIntro", () => ({
  AnimatedIntro: ({ onComplete }: { onComplete: () => void }) => {
    // Auto-complete after a short delay
    setTimeout(onComplete, 0);
    return <div data-testid="animated-intro">AI ENGINE FOR FIGHTERS</div>;
  },
}));

describe("Dashboard HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows animated intro on initial render", () => {
    render(<HomePage />);
    
    expect(screen.getByTestId("animated-intro")).toBeInTheDocument();
  });

  it("hides intro after animation completes", async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("animated-intro")).not.toBeInTheDocument();
    });
  });

  it("renders both fighter input blocks after intro", async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("animated-intro")).not.toBeInTheDocument();
    });
    
    // Both mobile and desktop layouts render, so we have multiple elements
    const fighterAInputs = screen.getAllByTestId("fighter-input-fighter-a");
    const fighterBInputs = screen.getAllByTestId("fighter-input-fighter-b");
    expect(fighterAInputs.length).toBeGreaterThan(0);
    expect(fighterBInputs.length).toBeGreaterThan(0);
  });

  it("renders FIGHT button after intro", async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("animated-intro")).not.toBeInTheDocument();
    });
    
    // Both mobile and desktop layouts render
    const fightButtons = screen.getAllByTestId("vs-emblem");
    expect(fightButtons.length).toBeGreaterThan(0);
    expect(screen.getAllByText("FIGHT").length).toBeGreaterThan(0);
  });

  it("handles fight button click with both fighters entered", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("animated-intro")).not.toBeInTheDocument();
    });
    
    const fighterAInputs = screen.getAllByLabelText("Fighter A name input");
    const fighterBInputs = screen.getAllByLabelText("Fighter B name input");
    const fightButtons = screen.getAllByTestId("vs-emblem");
    
    fireEvent.change(fighterAInputs[0], { target: { value: "Fighter One" } });
    fireEvent.change(fighterBInputs[0], { target: { value: "Fighter Two" } });
    fireEvent.click(fightButtons[0]);
    
    expect(consoleSpy).toHaveBeenCalledWith("Fight started:", {
      fighterA: "Fighter One",
      fighterB: "Fighter Two",
    });
    
    consoleSpy.mockRestore();
  });

  it("shows alert when fight button clicked without fighter names", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation();
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("animated-intro")).not.toBeInTheDocument();
    });
    
    const fightButtons = screen.getAllByTestId("vs-emblem");
    fireEvent.click(fightButtons[0]);
    
    expect(alertSpy).toHaveBeenCalledWith("Please enter both fighter names");
    
    alertSpy.mockRestore();
  });

  it("updates Fighter A state when input changes", async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("animated-intro")).not.toBeInTheDocument();
    });
    
    const fighterAInputs = screen.getAllByLabelText("Fighter A name input") as HTMLInputElement[];
    
    fireEvent.change(fighterAInputs[0], { target: { value: "Jon Jones" } });
    
    expect(fighterAInputs[0].value).toBe("Jon Jones");
  });

  it("updates Fighter B state when input changes", async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("animated-intro")).not.toBeInTheDocument();
    });
    
    const fighterBInputs = screen.getAllByLabelText("Fighter B name input") as HTMLInputElement[];
    
    fireEvent.change(fighterBInputs[0], { target: { value: "Daniel Cormier" } });
    
    expect(fighterBInputs[0].value).toBe("Daniel Cormier");
  });

  it("maintains independent state for both fighters", async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("animated-intro")).not.toBeInTheDocument();
    });
    
    const fighterAInputs = screen.getAllByLabelText("Fighter A name input") as HTMLInputElement[];
    const fighterBInputs = screen.getAllByLabelText("Fighter B name input") as HTMLInputElement[];
    
    fireEvent.change(fighterAInputs[0], { target: { value: "Israel Adesanya" } });
    fireEvent.change(fighterBInputs[0], { target: { value: "Alex Pereira" } });
    
    expect(fighterAInputs[0].value).toBe("Israel Adesanya");
    expect(fighterBInputs[0].value).toBe("Alex Pereira");
  });

  it("starts with empty fighter names", async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId("animated-intro")).not.toBeInTheDocument();
    });
    
    const fighterAInputs = screen.getAllByLabelText("Fighter A name input") as HTMLInputElement[];
    const fighterBInputs = screen.getAllByLabelText("Fighter B name input") as HTMLInputElement[];
    
    expect(fighterAInputs[0].value).toBe("");
    expect(fighterBInputs[0].value).toBe("");
  });
});

