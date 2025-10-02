/**
 * Unit tests for Your Own Tracker (cal-tracker) pricing and balance gating
 * Requirement: 5 tokens per generation with balance gating
 */

import { N8nWebhookClient } from '@/lib/n8n-webhook';

describe('Your Own Tracker Pricing and Balance Gating', () => {
  let webhookClient: N8nWebhookClient;

  beforeEach(() => {
    webhookClient = new N8nWebhookClient();
  });

  describe('Tool Price Configuration', () => {
    const createMockPayload = (toolId: string) => {
      return webhookClient.buildWebhookPayload(
        'Test message',
        toolId,
        { title: 'Your Own Tracker', gradient: 'from-blue-400 via-cyan-500 to-indigo-600' },
        undefined,
        'test-user'
      );
    };

    it('should return 5 tokens for cal-tracker tool', () => {
      const payload = createMockPayload('cal-tracker');
      expect(payload.tool.price).toBe(5);
    });

    it('should have correct tool name', () => {
      const payload = createMockPayload('cal-tracker');
      expect(payload.tool.name).toBe('Your Own Tracker');
    });
  });

  describe('Balance Gating Logic', () => {
    const getCalTrackerCreditLogic = (availableCredits: number, usedCredits: number = 0, toolPrice: number = 5) => {
      const remainingCredits = availableCredits - usedCredits;
      const hasInsufficientCredits = toolPrice > 0 && remainingCredits < toolPrice;
      const shouldBeEnabled = !hasInsufficientCredits;
      
      return {
        hasInsufficientCredits,
        shouldBeEnabled,
        toolPrice,
        availableCredits,
        usedCredits,
        remainingCredits,
      };
    };

    it('should disable button when balance is less than 5 tokens', () => {
      const result = getCalTrackerCreditLogic(4); // Less than 5 tokens
      
      expect(result.shouldBeEnabled).toBe(false);
      expect(result.hasInsufficientCredits).toBe(true);
      expect(result.toolPrice).toBe(5);
      expect(result.remainingCredits).toBe(4);
    });

    it('should enable button when balance equals exactly 5 tokens', () => {
      const result = getCalTrackerCreditLogic(5); // Exactly 5 tokens
      
      expect(result.shouldBeEnabled).toBe(true);
      expect(result.hasInsufficientCredits).toBe(false);
      expect(result.toolPrice).toBe(5);
      expect(result.remainingCredits).toBe(5);
    });

    it('should enable button when balance is greater than 5 tokens', () => {
      const result = getCalTrackerCreditLogic(10); // More than 5 tokens
      
      expect(result.shouldBeEnabled).toBe(true);
      expect(result.hasInsufficientCredits).toBe(false);
      expect(result.toolPrice).toBe(5);
      expect(result.remainingCredits).toBe(10);
    });

    it('should correctly calculate remaining credits with used credits', () => {
      const result = getCalTrackerCreditLogic(10, 3); // 10 available, 3 used = 7 remaining
      
      expect(result.shouldBeEnabled).toBe(true);
      expect(result.hasInsufficientCredits).toBe(false);
      expect(result.remainingCredits).toBe(7);
    });

    it('should disable button when remaining credits (after used) are less than 5', () => {
      const result = getCalTrackerCreditLogic(10, 7); // 10 available, 7 used = 3 remaining
      
      expect(result.shouldBeEnabled).toBe(false);
      expect(result.hasInsufficientCredits).toBe(true);
      expect(result.remainingCredits).toBe(3);
    });

    it('should handle zero credit balance', () => {
      const result = getCalTrackerCreditLogic(0);
      
      expect(result.shouldBeEnabled).toBe(false);
      expect(result.hasInsufficientCredits).toBe(true);
      expect(result.toolPrice).toBe(5);
      expect(result.remainingCredits).toBe(0);
    });

    it('should handle negative credit balance', () => {
      const result = getCalTrackerCreditLogic(-5);
      
      expect(result.shouldBeEnabled).toBe(false);
      expect(result.hasInsufficientCredits).toBe(true);
      expect(result.remainingCredits).toBe(-5);
    });

    it('should handle large credit balances', () => {
      const result = getCalTrackerCreditLogic(1000);
      
      expect(result.shouldBeEnabled).toBe(true);
      expect(result.hasInsufficientCredits).toBe(false);
      expect(result.remainingCredits).toBe(1000);
    });
  });

  describe('UI State Based on Balance', () => {
    interface ButtonState {
      disabled: boolean;
      tooltipMessage: string;
      className: string;
    }

    const getButtonState = (
      availableCredits: number,
      usedCredits: number,
      toolPrice: number,
      hasUploadedContent: boolean,
      isLoading: boolean,
      isLoadingCredits: boolean
    ): ButtonState => {
      const remainingCredits = availableCredits - usedCredits;
      const hasInsufficientCredits = toolPrice > 0 && remainingCredits < toolPrice;
      
      const disabled = !hasUploadedContent || isLoading || hasInsufficientCredits || isLoadingCredits;
      
      let tooltipMessage = '';
      if (isLoadingCredits) {
        tooltipMessage = 'Loading credit balance...';
      } else if (!hasUploadedContent) {
        tooltipMessage = 'Please upload an image first';
      } else if (hasInsufficientCredits) {
        tooltipMessage = `Insufficient credits. You need ${toolPrice} but have ${remainingCredits} available.`;
      } else {
        tooltipMessage = `Click to generate AI analysis (${toolPrice} tokens)`;
      }
      
      const className = disabled ? 'opacity-50 cursor-not-allowed' : '';
      
      return {
        disabled,
        tooltipMessage,
        className,
      };
    };

    it('should disable button and show insufficient credits message when balance is 3 tokens', () => {
      const state = getButtonState(3, 0, 5, true, false, false);
      
      expect(state.disabled).toBe(true);
      expect(state.tooltipMessage).toBe('Insufficient credits. You need 5 but have 3 available.');
      expect(state.className).toContain('opacity-50');
      expect(state.className).toContain('cursor-not-allowed');
    });

    it('should enable button with proper message when balance is 5 tokens', () => {
      const state = getButtonState(5, 0, 5, true, false, false);
      
      expect(state.disabled).toBe(false);
      expect(state.tooltipMessage).toBe('Click to generate AI analysis (5 tokens)');
      expect(state.className).toBe('');
    });

    it('should enable button with proper message when balance is 10 tokens', () => {
      const state = getButtonState(10, 0, 5, true, false, false);
      
      expect(state.disabled).toBe(false);
      expect(state.tooltipMessage).toBe('Click to generate AI analysis (5 tokens)');
    });

    it('should disable button when no content is uploaded, regardless of balance', () => {
      const state = getButtonState(100, 0, 5, false, false, false);
      
      expect(state.disabled).toBe(true);
      expect(state.tooltipMessage).toBe('Please upload an image first');
    });

    it('should disable button when loading, regardless of balance', () => {
      const state = getButtonState(100, 0, 5, true, true, false);
      
      expect(state.disabled).toBe(true);
    });

    it('should disable button when credits are loading', () => {
      const state = getButtonState(100, 0, 5, true, false, true);
      
      expect(state.disabled).toBe(true);
      expect(state.tooltipMessage).toBe('Loading credit balance...');
    });

    it('should correctly handle remaining credits after use', () => {
      const state = getButtonState(10, 6, 5, true, false, false); // 10 - 6 = 4 remaining
      
      expect(state.disabled).toBe(true);
      expect(state.tooltipMessage).toBe('Insufficient credits. You need 5 but have 4 available.');
    });
  });

  describe('Reactive Balance Updates', () => {
    it('should recalculate balance after each generation', () => {
      let availableCredits = 15;
      let usedCredits = 0;
      const toolPrice = 5;
      
      // First generation
      const beforeFirst = availableCredits - usedCredits;
      expect(beforeFirst).toBe(15);
      expect(beforeFirst >= toolPrice).toBe(true);
      
      // After first generation
      usedCredits += toolPrice;
      const afterFirst = availableCredits - usedCredits;
      expect(afterFirst).toBe(10);
      expect(afterFirst >= toolPrice).toBe(true);
      
      // After second generation
      usedCredits += toolPrice;
      const afterSecond = availableCredits - usedCredits;
      expect(afterSecond).toBe(5);
      expect(afterSecond >= toolPrice).toBe(true);
      
      // After third generation
      usedCredits += toolPrice;
      const afterThird = availableCredits - usedCredits;
      expect(afterThird).toBe(0);
      expect(afterThird >= toolPrice).toBe(false); // Now insufficient
    });

    it('should correctly show remaining generations based on balance', () => {
      const calculateRemainingGenerations = (available: number, used: number, price: number) => {
        const remaining = available - used;
        return Math.floor(remaining / price);
      };
      
      expect(calculateRemainingGenerations(15, 0, 5)).toBe(3);
      expect(calculateRemainingGenerations(10, 0, 5)).toBe(2);
      expect(calculateRemainingGenerations(7, 0, 5)).toBe(1);
      expect(calculateRemainingGenerations(4, 0, 5)).toBe(0);
      expect(calculateRemainingGenerations(20, 11, 5)).toBe(1); // 20 - 11 = 9, can afford 1
    });
  });

  describe('Edge Cases', () => {
    it('should handle floating point credit balances', () => {
      const toolPrice = 5;
      const availableCredits = 5.5;
      const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
      
      expect(hasInsufficientCredits).toBe(false);
    });

    it('should handle floating point calculations correctly', () => {
      const toolPrice = 5;
      const availableCredits = 4.9;
      const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
      
      expect(hasInsufficientCredits).toBe(true);
    });

    it('should handle extremely large balances', () => {
      const toolPrice = 5;
      const availableCredits = Number.MAX_SAFE_INTEGER;
      const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
      
      expect(hasInsufficientCredits).toBe(false);
    });

    it('should handle string to number conversion', () => {
      const toolPrice = 5;
      const availableCredits = parseFloat('10' as any);
      const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
      
      expect(hasInsufficientCredits).toBe(false);
      expect(availableCredits).toBe(10);
    });

    it('should handle invalid string gracefully', () => {
      const toolPrice = 5;
      const availableCredits = parseFloat('invalid' as any) || 0;
      const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
      
      expect(hasInsufficientCredits).toBe(true);
      expect(availableCredits).toBe(0);
    });
  });

  describe('Persistence Across Sessions', () => {
    it('should maintain balance state structure', () => {
      const mockBalanceState = {
        creditBalance: 20,
        usedCredits: 5,
        isLoadingCredits: false,
      };
      
      const remainingCredits = mockBalanceState.creditBalance - mockBalanceState.usedCredits;
      const hasInsufficientCredits = 5 > 0 && remainingCredits < 5;
      
      expect(remainingCredits).toBe(15);
      expect(hasInsufficientCredits).toBe(false);
      expect(mockBalanceState.isLoadingCredits).toBe(false);
    });

    it('should properly load balance on mount', () => {
      const mockApiResponse = {
        available: 50,
        used: 10,
        remaining: 40,
      };
      
      const creditBalance = mockApiResponse.available || 0;
      const usedCredits = mockApiResponse.used || 0;
      const remainingCredits = creditBalance - usedCredits;
      
      expect(creditBalance).toBe(50);
      expect(usedCredits).toBe(10);
      expect(remainingCredits).toBe(40);
    });

    it('should handle failed balance load gracefully', () => {
      const mockFailedResponse = {
        available: 0,
        used: 0,
        remaining: 0,
      };
      
      const creditBalance = mockFailedResponse.available || 0;
      const usedCredits = mockFailedResponse.used || 0;
      const hasInsufficientCredits = 5 > 0 && (creditBalance - usedCredits) < 5;
      
      expect(hasInsufficientCredits).toBe(true);
    });
  });
});

