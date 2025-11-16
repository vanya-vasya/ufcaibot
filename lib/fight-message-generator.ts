/**
 * Generates a fight message from two fighter names
 * @param fighterA - First fighter's name
 * @param fighterB - Second fighter's name
 * @returns Formatted fight message
 */
export const generateFightMessage = (fighterA: string, fighterB: string): string => {
  if (!fighterA || !fighterB) {
    throw new Error('Both fighter names are required');
  }
  
  const trimmedA = fighterA.trim();
  const trimmedB = fighterB.trim();
  
  if (!trimmedA || !trimmedB) {
    throw new Error('Fighter names cannot be empty');
  }
  
  return `${trimmedA} VS ${trimmedB}`;
};

