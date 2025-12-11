/**
 * Tests for Predictions API Route
 */

import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock auth
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

// Mock prismadb
jest.mock("@/lib/prismadb", () => ({
  __esModule: true,
  default: {
    prediction: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockPrisma = prismadb.prediction as jest.Mocked<typeof prismadb.prediction>;

describe("Predictions API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPrediction = {
    id: "pred-1",
    userId: "user-1",
    event: "UFC 324",
    fight: "JUSTIN GAETHJE VS PADDY PIMBLETT",
    fighterA: "JUSTIN GAETHJE",
    fighterB: "PADDY PIMBLETT",
    content: "Test prediction content",
    imageUrl: "https://example.com/image.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("GET /api/predictions", () => {
    it("should return 401 if not authenticated", async () => {
      mockAuth.mockReturnValue({ userId: null } as ReturnType<typeof auth>);

      const { GET } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions");
      const response = await GET(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("should return predictions with pagination", async () => {
      mockAuth.mockReturnValue({ userId: "user-1" } as ReturnType<typeof auth>);
      mockPrisma.count.mockResolvedValue(1);
      mockPrisma.findMany.mockResolvedValue([mockPrediction]);

      const { GET } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions?page=1&pageSize=10");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.predictions).toHaveLength(1);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.totalCount).toBe(1);
    });

    it("should use default pagination values", async () => {
      mockAuth.mockReturnValue({ userId: "user-1" } as ReturnType<typeof auth>);
      mockPrisma.count.mockResolvedValue(0);
      mockPrisma.findMany.mockResolvedValue([]);

      const { GET } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.pageSize).toBe(10);
    });

    it("should cap pageSize at max value", async () => {
      mockAuth.mockReturnValue({ userId: "user-1" } as ReturnType<typeof auth>);
      mockPrisma.count.mockResolvedValue(0);
      mockPrisma.findMany.mockResolvedValue([]);

      const { GET } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions?pageSize=100");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.pagination.pageSize).toBeLessThanOrEqual(50);
    });

    it("should handle database errors gracefully", async () => {
      mockAuth.mockReturnValue({ userId: "user-1" } as ReturnType<typeof auth>);
      mockPrisma.count.mockRejectedValue(new Error("Database error"));

      const { GET } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions");
      const response = await GET(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe("Internal server error");
    });
  });

  describe("POST /api/predictions", () => {
    it("should return 401 if not authenticated", async () => {
      mockAuth.mockReturnValue({ userId: null } as ReturnType<typeof auth>);

      const { POST } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it("should return 400 if required fields are missing", async () => {
      mockAuth.mockReturnValue({ userId: "user-1" } as ReturnType<typeof auth>);

      const { POST } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fight: "TEST" }),
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Missing required fields");
    });

    it("should create prediction successfully", async () => {
      mockAuth.mockReturnValue({ userId: "user-1" } as ReturnType<typeof auth>);
      mockPrisma.create.mockResolvedValue(mockPrediction);

      const { POST } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fight: "JUSTIN GAETHJE VS PADDY PIMBLETT",
          fighterA: "JUSTIN GAETHJE",
          fighterB: "PADDY PIMBLETT",
          content: "Test content",
          event: "UFC 324",
          imageUrl: "https://example.com/image.jpg",
        }),
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.prediction).toBeDefined();
      expect(data.prediction.id).toBe("pred-1");
    });

    it("should handle database errors gracefully", async () => {
      mockAuth.mockReturnValue({ userId: "user-1" } as ReturnType<typeof auth>);
      mockPrisma.create.mockRejectedValue(new Error("Database error"));

      const { POST } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fight: "TEST",
          fighterA: "A",
          fighterB: "B",
          content: "Test",
        }),
      });
      const response = await POST(request);

      expect(response.status).toBe(500);
    });
  });

  describe("DELETE /api/predictions", () => {
    it("should return 401 if not authenticated", async () => {
      mockAuth.mockReturnValue({ userId: null } as ReturnType<typeof auth>);

      const { DELETE } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions?id=pred-1", {
        method: "DELETE",
      });
      const response = await DELETE(request);

      expect(response.status).toBe(401);
    });

    it("should return 400 if id is missing", async () => {
      mockAuth.mockReturnValue({ userId: "user-1" } as ReturnType<typeof auth>);

      const { DELETE } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions", {
        method: "DELETE",
      });
      const response = await DELETE(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Missing prediction id");
    });

    it("should return 404 if prediction not found or not owned by user", async () => {
      mockAuth.mockReturnValue({ userId: "user-1" } as ReturnType<typeof auth>);
      mockPrisma.findFirst.mockResolvedValue(null);

      const { DELETE } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions?id=pred-1", {
        method: "DELETE",
      });
      const response = await DELETE(request);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe("Prediction not found");
    });

    it("should delete prediction successfully", async () => {
      mockAuth.mockReturnValue({ userId: "user-1" } as ReturnType<typeof auth>);
      mockPrisma.findFirst.mockResolvedValue(mockPrediction);
      mockPrisma.delete.mockResolvedValue(mockPrediction);

      const { DELETE } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions?id=pred-1", {
        method: "DELETE",
      });
      const response = await DELETE(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it("should handle database errors gracefully", async () => {
      mockAuth.mockReturnValue({ userId: "user-1" } as ReturnType<typeof auth>);
      mockPrisma.findFirst.mockRejectedValue(new Error("Database error"));

      const { DELETE } = await import("@/app/api/predictions/route");
      const request = new Request("http://localhost:3000/api/predictions?id=pred-1", {
        method: "DELETE",
      });
      const response = await DELETE(request);

      expect(response.status).toBe(500);
    });
  });
});
