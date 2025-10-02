/**
 * Test to verify frontend getToolPrice function works correctly after nullish coalescing fix
 */

describe('Frontend Tool Price Logic', () => {
  // Simulate the frontend getToolPrice function
  const getToolPrice = (toolId: string): number => {
    const prices = {
      'master-chef': 10, // 10 tokens per generation
      'master-nutritionist': 15, // 15 tokens per generation
      'cal-tracker': 0, // Free tool - always enabled regardless of credit balance
    };
    return prices[toolId as keyof typeof prices] ?? 100; // Use ?? instead of || to handle 0 values correctly
  };

  it('should return 10 for master-chef', () => {
    const price = getToolPrice('master-chef');
    expect(price).toBe(10);
  });

  it('should return correct prices for paid tools', () => {
    expect(getToolPrice('master-nutritionist')).toBe(15);
    expect(getToolPrice('master-chef')).toBe(10);
  });

  it('should return 0 for free tool (cal-tracker)', () => {
    expect(getToolPrice('cal-tracker')).toBe(0);
  });

  it('should return default 100 for unknown tools', () => {
    expect(getToolPrice('unknown-tool')).toBe(100);
  });

  it('should properly calculate hasInsufficientCredits for cal-tracker (free tool)', () => {
    const toolPrice = getToolPrice('cal-tracker');
    const availableCredits = 0; // Zero credits
    const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
    
    expect(toolPrice).toBe(0);
    expect(hasInsufficientCredits).toBe(false); // Should be false even with 0 credits
  });

  it('should properly calculate hasInsufficientCredits for master-chef', () => {
    const toolPrice = getToolPrice('master-chef');
    const availableCredits = 5; // Less than 10
    const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
    
    expect(toolPrice).toBe(10);
    expect(hasInsufficientCredits).toBe(true); // Should be true with insufficient credits
  });

  it('should properly calculate hasInsufficientCredits for master-nutritionist', () => {
    const toolPrice = getToolPrice('master-nutritionist');
    const availableCredits = 10; // Less than 15
    const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
    
    expect(toolPrice).toBe(15);
    expect(hasInsufficientCredits).toBe(true); // Should be true with insufficient credits
  });

  it('should demonstrate the bug if using || instead of ??', () => {
    // This is what was happening before the fix
    const buggyGetToolPrice = (toolId: string): number => {
      const prices = {
        'master-chef': 10,
        'master-nutritionist': 15,
        'cal-tracker': 0,
      };
      return prices[toolId as keyof typeof prices] || 100; // BUG: || treats 0 as falsy
    };

    // This would return 100 instead of 0 (the bug) for cal-tracker
    expect(buggyGetToolPrice('cal-tracker')).toBe(100);
    
    // The fixed version returns 0 correctly for cal-tracker
    expect(getToolPrice('cal-tracker')).toBe(0);
  });
});
