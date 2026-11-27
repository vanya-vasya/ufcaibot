/** @jest-environment node */
import { POST } from "@/app/api/analyze/route";
import { auth } from "@clerk/nextjs/server";
import { findUserByAuth } from "@/lib/api-limit";
import { chargeForAnalysis, InsufficientCreditsError } from "@/lib/analysis/credits";
import { runAnalysis } from "@/lib/analysis/run";

jest.mock("@clerk/nextjs/server", () => ({ auth: jest.fn() }));
jest.mock("@/lib/api-limit", () => ({ findUserByAuth: jest.fn() }));
jest.mock("@/lib/analysis/credits", () => ({
  ...jest.requireActual("@/lib/analysis/credits"),
  chargeForAnalysis: jest.fn(),
}));
jest.mock("@/lib/analysis/run", () => ({ runAnalysis: jest.fn() }));
jest.mock("@/lib/prismadb", () => ({ __esModule: true, default: {} }));

const mockAuth = auth as unknown as jest.Mock;
const mockFindUser = findUserByAuth as jest.Mock;
const mockCharge = chargeForAnalysis as jest.Mock;
const mockRun = runAnalysis as jest.Mock;

const request = (body: unknown) =>
  new Request("http://localhost/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const validBody = { product: "odds", fighterA: "Max Holloway", fighterB: "Charles Oliveira" };

const analysis = (charge: boolean) => ({
  content: "Block 1: Odds Data\nHolloway.",
  sections: ["odds"],
  sourcesAvailable: { odds: true, stats: false, news: false },
  charge,
});

describe("POST /api/analyze", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    mockAuth.mockReturnValue({ userId: "user_123" });
    mockFindUser.mockResolvedValue({ clerkId: "user_123", availableGenerations: 50, usedGenerations: 0 });
  });

  it("rejects anonymous requests", async () => {
    mockAuth.mockReturnValue({ userId: null });

    const response = await POST(request(validBody));

    expect(response.status).toBe(401);
    expect(mockRun).not.toHaveBeenCalled();
  });

  it("rejects unknown products and empty fighter names", async () => {
    expect((await POST(request({ ...validBody, product: "free" }))).status).toBe(400);
    expect((await POST(request({ ...validBody, fighterA: " " }))).status).toBe(400);
  });

  it("returns 402 before doing any work when the balance is below the product price", async () => {
    mockFindUser.mockResolvedValue({ clerkId: "user_123", availableGenerations: 20, usedGenerations: 15 });

    const response = await POST(request({ ...validBody, product: "ultimate" }));

    expect(response.status).toBe(402);
    expect(await response.json()).toMatchObject({ remaining: 5, required: 25 });
    expect(mockRun).not.toHaveBeenCalled();
  });

  it("runs the analysis and charges the product price on success", async () => {
    mockRun.mockResolvedValue(analysis(true));
    mockCharge.mockResolvedValue({ remaining: 40, cost: 10 });

    const response = await POST(request(validBody));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(mockRun).toHaveBeenCalledWith("odds", "Max Holloway", "Charles Oliveira");
    expect(mockCharge).toHaveBeenCalledWith(
      expect.objectContaining({ clerkId: "user_123", product: "odds" })
    );
    expect(json).toMatchObject({ charged: true, cost: 10, remaining: 40, sections: ["odds"] });
  });

  it("does not charge when the analysis had too little data", async () => {
    mockRun.mockResolvedValue(analysis(false));

    const json = await (await POST(request(validBody))).json();

    expect(mockCharge).not.toHaveBeenCalled();
    expect(json).toMatchObject({ charged: false, cost: 0, remaining: 50 });
  });

  it("returns 402 when the balance changed during generation", async () => {
    mockRun.mockResolvedValue(analysis(true));
    mockCharge.mockRejectedValue(new InsufficientCreditsError());

    expect((await POST(request(validBody))).status).toBe(402);
  });

  it("returns 502 without charging when generation fails", async () => {
    mockRun.mockRejectedValue(new Error("openai down"));

    const response = await POST(request(validBody));

    expect(response.status).toBe(502);
    expect(mockCharge).not.toHaveBeenCalled();
  });
});
