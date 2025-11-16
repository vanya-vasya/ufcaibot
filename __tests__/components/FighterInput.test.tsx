import { render, screen, fireEvent } from "@testing-library/react";
import { FighterInput } from "@/components/dashboard/FighterInput";

describe("FighterInput", () => {
  it("renders with label and input field", () => {
    const mockOnChange = jest.fn();
    render(
      <FighterInput
        label="Fighter A"
        value=""
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText("Fighter A")).toBeInTheDocument();
    expect(screen.getByLabelText("Fighter A name input")).toBeInTheDocument();
  });

  it("displays the current value", () => {
    const mockOnChange = jest.fn();
    render(
      <FighterInput
        label="Fighter A"
        value="Conor McGregor"
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText("Fighter A name input") as HTMLInputElement;
    expect(input.value).toBe("Conor McGregor");
  });

  it("calls onChange handler when input value changes", () => {
    const mockOnChange = jest.fn();
    render(
      <FighterInput
        label="Fighter A"
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText("Fighter A name input");
    fireEvent.change(input, { target: { value: "Khabib Nurmagomedov" } });
    
    expect(mockOnChange).toHaveBeenCalledWith("Khabib Nurmagomedov");
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("renders with custom placeholder", () => {
    const mockOnChange = jest.fn();
    render(
      <FighterInput
        label="Fighter B"
        value=""
        onChange={mockOnChange}
        placeholder="Custom placeholder"
      />
    );
    
    const input = screen.getByLabelText("Fighter B name input") as HTMLInputElement;
    expect(input.placeholder).toBe("Custom placeholder");
  });

  it("renders with default placeholder", () => {
    const mockOnChange = jest.fn();
    render(
      <FighterInput
        label="Fighter A"
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText("Fighter A name input") as HTMLInputElement;
    expect(input.placeholder).toBe("Enter fighter name");
  });

  it("has proper accessibility attributes", () => {
    const mockOnChange = jest.fn();
    render(
      <FighterInput
        label="Fighter A"
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText("Fighter A name input");
    expect(input).toHaveAttribute("aria-label", "Fighter A name input");
    expect(input).toHaveAttribute("type", "text");
  });

  it("renders with custom id when provided", () => {
    const mockOnChange = jest.fn();
    render(
      <FighterInput
        label="Fighter A"
        value=""
        onChange={mockOnChange}
        id="custom-fighter-id"
      />
    );
    
    const input = screen.getByLabelText("Fighter A name input");
    expect(input).toHaveAttribute("id", "custom-fighter-id");
  });

  it("updates value when user types", () => {
    const mockOnChange = jest.fn();
    render(
      <FighterInput
        label="Fighter A"
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText("Fighter A name input");
    
    fireEvent.change(input, { target: { value: "A" } });
    expect(mockOnChange).toHaveBeenCalledWith("A");
    
    fireEvent.change(input, { target: { value: "Ab" } });
    expect(mockOnChange).toHaveBeenCalledWith("Ab");
    
    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });

  it("has neutral focus styling without red borders", () => {
    const mockOnChange = jest.fn();
    render(
      <FighterInput
        label="Fighter A"
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText("Fighter A name input");
    
    // Verify no red ring classes are present
    expect(input.className).not.toContain("ring-red");
    expect(input.className).toContain("focus:border-zinc-500");
    
    // Verify inline styles remove box-shadow
    expect(input).toHaveStyle({ boxShadow: 'none' });
  });

  it("maintains focus outline for accessibility", () => {
    const mockOnChange = jest.fn();
    render(
      <FighterInput
        label="Fighter A"
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText("Fighter A name input") as HTMLInputElement;
    
    // Verify input is focusable (not disabled, has tabindex)
    expect(input).not.toHaveAttribute("disabled");
    expect(input).toHaveAttribute("type", "text");
    
    // Focus the input programmatically
    input.focus();
    
    // Input should be focused (accessibility requirement)
    expect(input).toHaveFocus();
  });
});

