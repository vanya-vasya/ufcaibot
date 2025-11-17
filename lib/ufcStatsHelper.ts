/**
 * Helper functions for fetching and processing UFC fighter statistics
 */

export interface UFCStatsResponse {
  success: boolean;
  searchUrl?: string;
  fighterA?: string;
  fighterB?: string;
  statsImageUrl?: string;
  error?: string;
}

/**
 * Fetch UFC fighter stats comparison URL
 */
export async function getUFCStatsUrl(fighterA: string, fighterB: string): Promise<UFCStatsResponse> {
  try {
    const response = await fetch('/api/ufc-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fighterA, fighterB }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching UFC stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch UFC stats'
    };
  }
}

/**
 * Search UFC.com for fighter comparison page
 * Returns URL to fighter vs fighter page if found
 */
export function buildUFCComparisonUrl(fighterA: string, fighterB: string): string {
  // UFC.com uses format: /athlete/{fighter-name}
  // For comparison, we'll search and navigate to the matchup page
  const fighterASlug = fighterA.toLowerCase().replace(/\s+/g, '-');
  const fighterBSlug = fighterB.toLowerCase().replace(/\s+/g, '-');
  
  // Try direct athlete pages first
  return `https://www.ufc.com/athletes/${fighterASlug}`;
}

/**
 * Format fighter name for UFC.com URL
 */
export function formatFighterNameForUrl(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

