import { fireEvent, render, screen } from "@testing-library/react";
import { ProModal } from "@/components/pro-modal";

jest.mock("@/hooks/use-pro-modal", () => ({
  useProModal: () => ({ isOpen: true, onClose: jest.fn(), onOpen: jest.fn() }),
}));
jest.mock("next/navigation", () => ({ useRouter: () => ({ refresh: jest.fn() }) }));
jest.mock("@clerk/nextjs", () => ({
  useAuth: () => ({ userId: "user_1" }),
  useUser: () => ({ user: { emailAddresses: [{ emailAddress: "a@b.co" }] } }),
}));
jest.mock("@/components/networx-payment-widget", () => ({ NetworkPaymentWidget: () => null }));
jest.mock("react-hot-toast", () => ({ toast: Object.assign(jest.fn(), { error: jest.fn(), success: jest.fn() }) }));

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const tokensInput = () => screen.getByLabelText("Enter token amount") as HTMLInputElement;
const amountInput = () => screen.getByLabelText("Amount") as HTMLInputElement;

describe("Buy More modal", () => {
  it("starts at 0 tokens and 0.00", () => {
    render(<ProModal />);
    expect(amountInput().value).toBe("0.00");
    expect(tokensInput().value).toBe("0");
  });

  it("recalculates the amount when tokens are typed", () => {
    render(<ProModal />);
    fireEvent.change(tokensInput(), { target: { value: "25" } });
    expect(amountInput().value).toBe("5.00");
  });

  it("recalculates the tokens when the amount is typed", () => {
    render(<ProModal />);
    fireEvent.change(amountInput(), { target: { value: "10" } });
    expect(tokensInput().value).toBe("50");
  });

  it("keeps what the user types in the amount field and snaps it on blur", () => {
    render(<ProModal />);
    fireEvent.change(amountInput(), { target: { value: "5.1" } });
    expect(amountInput().value).toBe("5.1");
    expect(tokensInput().value).toBe("25");

    fireEvent.blur(amountInput());
    expect(amountInput().value).toBe("5.00");
  });

  it("ignores non-numeric characters in the amount", () => {
    render(<ProModal />);
    fireEvent.change(amountInput(), { target: { value: "ab3" } });
    expect(amountInput().value).toBe("3");
    expect(tokensInput().value).toBe("15");
  });

  it("clearing the amount resets the tokens to 0", () => {
    render(<ProModal />);
    fireEvent.change(tokensInput(), { target: { value: "40" } });
    fireEvent.change(amountInput(), { target: { value: "" } });
    expect(tokensInput().value).toBe("0");
  });
});
