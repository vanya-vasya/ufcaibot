import {
  amountToTokens,
  getUnitPrice,
  normalizeTokens,
  sanitizeAmountInput,
  tokensToAmount,
} from "@/lib/token-pricing";
import { currencies } from "@/constants/index";

describe("token pricing", () => {
  it("prices a token at 0.20 GBP", () => {
    expect(getUnitPrice("GBP")).toBe(0.2);
    expect(tokensToAmount(25, "GBP")).toBeCloseTo(5);
  });

  it("converts through EUR for other currencies", () => {
    expect(getUnitPrice("EUR")).toBeCloseTo(0.2 / 0.84);
    expect(tokensToAmount(100, "USD")).toBeCloseTo((100 * 0.2 * 1.133616) / 0.84);
  });

  it("round-trips tokens -> amount -> tokens for every currency", () => {
    currencies.forEach((currency) => {
      [1, 3, 7, 25, 100, 999, 12345].forEach((tokens) => {
        expect(amountToTokens(tokensToAmount(tokens, currency), currency)).toBe(tokens);
      });
    });
  });

  it("never grants a partial token", () => {
    expect(amountToTokens(5.1, "GBP")).toBe(25);
    expect(amountToTokens(0.19, "GBP")).toBe(0);
    expect(amountToTokens(0.6, "GBP")).toBe(3);
  });

  it("handles empty, negative and NaN input", () => {
    expect(amountToTokens(NaN, "GBP")).toBe(0);
    expect(amountToTokens(-5, "GBP")).toBe(0);
    expect(normalizeTokens(NaN)).toBe(0);
    expect(normalizeTokens(-3)).toBe(0);
    expect(normalizeTokens(4.9)).toBe(4);
    expect(tokensToAmount(NaN, "GBP")).toBe(0);
  });

  it("sanitizes typed amounts", () => {
    expect(sanitizeAmountInput("12,345.678")).toBe("12345.67");
    expect(sanitizeAmountInput("abc5.5x")).toBe("5.5");
    expect(sanitizeAmountInput("1.2.3")).toBe("1.23");
    expect(sanitizeAmountInput("")).toBe("");
    expect(sanitizeAmountInput("7,5")).toBe("7.5");
  });
});
