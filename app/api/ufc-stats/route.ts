import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint to fetch UFC fighter statistics and matchup comparison
 * Searches UFC.com for fighter comparison images
 */
export async function POST(request: NextRequest) {
  try {
    const { fighterA, fighterB } = await request.json();

    if (!fighterA || !fighterB) {
      return NextResponse.json(
        { error: "Both fighterA and fighterB are required" },
        { status: 400 }
      );
    }

    // Construct UFC.com search URL for fighter comparison
    const searchQuery = `${fighterA} vs ${fighterB} stats`;
    const ufcSearchUrl = `https://www.ufc.com/search?search=${encodeURIComponent(searchQuery)}`;

    // Return the search URL and fighter names for browser-based fetching
    return NextResponse.json({
      success: true,
      searchUrl: ufcSearchUrl,
      fighterA,
      fighterB,
      message: "UFC search URL generated successfully"
    });

  } catch (error: unknown) {
    console.error("Error in UFC stats API:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to process request", details: errorMessage },
      { status: 500 }
    );
  }
}

