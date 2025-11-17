/**
 * Parse content into Block 1, Block 2, Block 3, and Block 4
 * Extracts text content between block headings
 */
export interface ContentBlocks {
  block1: string;
  block2: string;
  block3: string;
  block4: string;
}

export const parseContentBlocks = (text: string): ContentBlocks => {
  const blocks: ContentBlocks = {
    block1: "",
    block2: "",
    block3: "",
    block4: "",
  };

  // Normalize text: handle various line endings and extra whitespace
  const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Case-insensitive regex patterns to find block headings
  const block1Regex = /block\s*1/i;
  const block2Regex = /block\s*2/i;
  const block3Regex = /block\s*3/i;
  const block4Regex = /block\s*4/i;

  // Find positions of each heading
  const block1Match = normalizedText.match(block1Regex);
  const block2Match = normalizedText.match(block2Regex);
  const block3Match = normalizedText.match(block3Regex);
  const block4Match = normalizedText.match(block4Regex);

  const block1Index = block1Match ? normalizedText.indexOf(block1Match[0]) : -1;
  const block2Index = block2Match ? normalizedText.indexOf(block2Match[0]) : -1;
  const block3Index = block3Match ? normalizedText.indexOf(block3Match[0]) : -1;
  const block4Index = block4Match ? normalizedText.indexOf(block4Match[0]) : -1;

  // Extract Block 1 content
  if (block1Index !== -1) {
    const startIdx = block1Index + (block1Match?.[0].length || 0);
    const endIdx = block2Index !== -1 ? block2Index : (block3Index !== -1 ? block3Index : (block4Index !== -1 ? block4Index : normalizedText.length));
    blocks.block1 = normalizedText.substring(startIdx, endIdx).trim();
  }

  // Extract Block 2 content
  if (block2Index !== -1) {
    const startIdx = block2Index + (block2Match?.[0].length || 0);
    const endIdx = block3Index !== -1 ? block3Index : (block4Index !== -1 ? block4Index : normalizedText.length);
    blocks.block2 = normalizedText.substring(startIdx, endIdx).trim();
  }

  // Extract Block 3 content
  if (block3Index !== -1) {
    const startIdx = block3Index + (block3Match?.[0].length || 0);
    const endIdx = block4Index !== -1 ? block4Index : normalizedText.length;
    blocks.block3 = normalizedText.substring(startIdx, endIdx).trim();
  }

  // Extract Block 4 content
  if (block4Index !== -1) {
    const startIdx = block4Index + (block4Match?.[0].length || 0);
    blocks.block4 = normalizedText.substring(startIdx).trim();
  }

  return blocks;
};

