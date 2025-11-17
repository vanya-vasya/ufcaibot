/**
 * Parse content into Block 1, Block 2, and Block 3
 * Extracts text content between block headings
 * Also splits content by fighter names if detected
 */
export interface FighterContent {
  fighterA: string;
  fighterB: string;
}

export interface ContentBlocks {
  block1: string;
  block2: string;
  block3: string;
  fighterSplit?: {
    block1?: FighterContent;
    block2?: FighterContent;
    block3?: FighterContent;
  };
}

export const parseContentBlocks = (text: string): ContentBlocks => {
  const blocks: ContentBlocks = {
    block1: "",
    block2: "",
    block3: "",
  };

  // Normalize text: handle various line endings and extra whitespace
  const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Case-insensitive regex patterns to find block headings
  const block1Regex = /block\s*1/i;
  const block2Regex = /block\s*2/i;
  const block3Regex = /block\s*3/i;

  // Find positions of each heading
  const block1Match = normalizedText.match(block1Regex);
  const block2Match = normalizedText.match(block2Regex);
  const block3Match = normalizedText.match(block3Regex);

  const block1Index = block1Match ? normalizedText.indexOf(block1Match[0]) : -1;
  const block2Index = block2Match ? normalizedText.indexOf(block2Match[0]) : -1;
  const block3Index = block3Match ? normalizedText.indexOf(block3Match[0]) : -1;

  // Helper function to clean content from metadata markers
  const cleanContent = (content: string): string => {
    // Remove patterns like ": Odds Data\n", ": Fighters Data\n", etc.
    let cleaned = content
      .replace(/^\s*:\s*Odds Data\s*/i, '')
      .replace(/^\s*:\s*Fighters Data\s*/i, '')
      .replace(/^\s*:\s*Sentiment Analysis\s*/i, '')
      .replace(/^\s*:\s*[^\n]+\n/, '') // Remove any other ": Something\n" pattern at start
      .trim();
    
    // Normalize AI text: remove all technical artifacts
    return normalizeAiText(cleaned);
  };

  // Normalize AI-generated text by removing technical artifacts
  const normalizeAiText = (raw: string): string => {
    if (!raw) return '';
    
    return raw
      .replace(/\\n/g, ' ')           // Replace escaped \n with space
      .replace(/\n/g, ' ')            // Replace real newlines with space
      .replace(/^"+|"+$/g, '')        // Remove leading/trailing quotes
      .replace(/"\s*}$/g, '')         // Remove trailing " } or "} (with optional space)
      .replace(/"\s*}/g, '')          // Remove " } or "} anywhere (with optional space)
      .replace(/}\s*"$/g, '')         // Remove trailing } " (reverse order)
      .replace(/}\s*"/g, '')          // Remove } " anywhere (reverse order)
      .replace(/\s+/g, ' ')           // Collapse multiple spaces
      .trim();
  };

  // Extract Block 1 content
  if (block1Index !== -1) {
    const startIdx = block1Index + (block1Match?.[0].length || 0);
    const endIdx = block2Index !== -1 ? block2Index : (block3Index !== -1 ? block3Index : normalizedText.length);
    const rawContent = normalizedText.substring(startIdx, endIdx).trim();
    blocks.block1 = cleanContent(rawContent);
  }

  // Extract Block 2 content
  if (block2Index !== -1) {
    const startIdx = block2Index + (block2Match?.[0].length || 0);
    const endIdx = block3Index !== -1 ? block3Index : normalizedText.length;
    const rawContent = normalizedText.substring(startIdx, endIdx).trim();
    blocks.block2 = cleanContent(rawContent);
  }

  // Extract Block 3 content
  if (block3Index !== -1) {
    const startIdx = block3Index + (block3Match?.[0].length || 0);
    const rawContent = normalizedText.substring(startIdx).trim();
    blocks.block3 = cleanContent(rawContent);
  }

  return blocks;
};

/**
 * Split content by fighter names
 * Attempts to identify which parts of text refer to each fighter
 */
export function splitContentByFighters(
  content: string,
  fighterAName: string,
  fighterBName: string
): FighterContent {
  if (!content) {
    return { fighterA: '', fighterB: '' };
  }

  // Split by bullet points first
  const bullets = content.split('•').filter(b => b.trim());
  
  const fighterAContent: string[] = [];
  const fighterBContent: string[] = [];
  const sharedContent: string[] = [];

  bullets.forEach(bullet => {
    const bulletText = bullet.trim();
    const lowerBullet = bulletText.toLowerCase();
    const fighterALower = fighterAName.toLowerCase();
    const fighterBLower = fighterBName.toLowerCase();
    
    // Extract last names for better matching
    const fighterALastName = fighterAName.split(' ').pop()?.toLowerCase() || '';
    const fighterBLastName = fighterBName.split(' ').pop()?.toLowerCase() || '';

    // Check if bullet mentions fighter A
    const mentionsFighterA = lowerBullet.includes(fighterALower) || 
                             lowerBullet.includes(fighterALastName);
    
    // Check if bullet mentions fighter B
    const mentionsFighterB = lowerBullet.includes(fighterBLower) || 
                             lowerBullet.includes(fighterBLastName);

    if (mentionsFighterA && !mentionsFighterB) {
      fighterAContent.push(bulletText);
    } else if (mentionsFighterB && !mentionsFighterA) {
      fighterBContent.push(bulletText);
    } else {
      // If mentions both or neither, add to shared
      sharedContent.push(bulletText);
    }
  });

  // Build final content strings
  const buildContent = (specific: string[], shared: string[]) => {
    const parts = [...specific, ...shared];
    return parts.length > 0 ? parts.join(' • ') : '';
  };

  return {
    fighterA: buildContent(fighterAContent, sharedContent),
    fighterB: buildContent(fighterBContent, sharedContent),
  };
}

