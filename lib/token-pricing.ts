import { GENERATIONS_PRICE } from "@/constants";
import { currenciesRate, type Currency } from "@/constants/index";

/** Guards against float noise such as 0.6 / 0.2 = 2.9999999999999996. */
const EPSILON = 1e-9;

export const normalizeTokens = (tokens: number): number =>
  Number.isFinite(tokens) && tokens > 0 ? Math.floor(tokens) : 0;

/** Price of one token in the given currency (GENERATIONS_PRICE is quoted in GBP). */
export const getUnitPrice = (currency: Currency): number => {
  if (currency === "GBP") return GENERATIONS_PRICE;
  return (GENERATIONS_PRICE / currenciesRate.GBP) * currenciesRate[currency];
};

export const tokensToAmount = (tokens: number, currency: Currency): number =>
  normalizeTokens(tokens) * getUnitPrice(currency);

/** Whole tokens that fit into the amount; a partial token is never charged or granted. */
export const amountToTokens = (amount: number, currency: Currency): number => {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.floor(amount / getUnitPrice(currency) + EPSILON);
};

/** Keeps digits and a single dot, at most two decimals: "12,345.678" -> "12345.67". */
export const sanitizeAmountInput = (raw: string): string => {
  const cleaned = raw.replace(",", ".").replace(/[^\d.]/g, "");
  const [whole, ...fraction] = cleaned.split(".");
  if (fraction.length === 0) return whole;
  return `${whole}.${fraction.join("").slice(0, 2)}`;
};
