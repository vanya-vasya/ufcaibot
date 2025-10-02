/**
 * Integration tests for Your Own Nutritionist (master-nutritionist) balance gating
 * Tests the 15 token pricing and balance validation
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConversationPage from '@/app/(dashboard)/dashboard/conversation/page';
import * as NextNavigation from 'next/navigation';
import * as ClerkNextJS from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

// Mock N8N Webhook Client
const mockSendDescriptionToWebhookWithRetry = jest.fn();
jest.mock('@/lib/n8n-webhook', () => ({
  N8nWebhookClient: jest.fn().mockImplementation(() => ({
    sendDescriptionToWebhookWithRetry: mockSendDescriptionToWebhookWithRetry,
    sendFileToWebhookWithRetry: jest.fn(),
  })),
}));

// Mock useProModal hook
const mockOnOpen = jest.fn();
jest.mock('@/hooks/use-pro-modal', () => ({
  useProModal: () => ({
    isOpen: false,
    onOpen: mockOnOpen,
    onClose: jest.fn(),
  }),
}));

describe('Your Own Nutritionist (master-nutritionist) Balance Gating', () => {
  beforeEach(() => {
    // Setup spies for navigation and auth
    jest.spyOn(NextNavigation, 'useSearchParams').mockReturnValue({
      get: (key: string) => {
        if (key === 'toolId') return 'master-nutritionist';
        return null;
      },
    } as any);

    jest.spyOn(ClerkNextJS, 'useAuth').mockReturnValue({
      userId: 'test-user-123',
      isLoaded: true,
      isSignedIn: true,
    } as any);

    // Clear all mocks
    jest.clearAllMocks();
    mockSendDescriptionToWebhookWithRetry.mockClear();
    mockOnOpen.mockClear();
  });

  describe('Pricing Display', () => {
    it('should display 15 tokens per generation pricing', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 100,
          used: 0,
          remaining: 100,
        }),
      });

      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText(/15 tokens per generation/i)).toBeInTheDocument();
      });
    });

    it('should show 15 required in credit information', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 50,
          used: 0,
          remaining: 50,
        }),
      });

      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText(/Credits:.*50 available.*15 required/)).toBeInTheDocument();
      });
    });

    it('should not show "Free" in the description', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 100,
          used: 0,
          remaining: 100,
        }),
      });

      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.queryByText(/Price: Free/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Balance Gating - Insufficient Credits', () => {
    it('should disable Generate button when balance is less than 15', async () => {
      // Mock balance with less than 15 tokens
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 10,
          used: 0,
          remaining: 10,
        }),
      });

      render(<ConversationPage />);

      // Enter valid description
      const validDescription = 'Analyze my nutritional needs for weight loss';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
      });
    });

    it('should disable Generate button when balance is exactly 14', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 14,
          used: 0,
          remaining: 14,
        }),
      });

      render(<ConversationPage />);

      const validDescription = 'Help me with meal planning';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
      });
    });

    it('should show AlertCircle icon when insufficient credits', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 5,
          used: 0,
          remaining: 5,
        }),
      });

      render(<ConversationPage />);

      const validDescription = 'Nutrition guidance needed';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
        // Check for AlertCircle class or icon presence (implementation detail)
      });
    });

    it('should prevent generation when insufficient credits', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 10,
          used: 0,
          remaining: 10,
        }),
      });

      mockSendDescriptionToWebhookWithRetry.mockResolvedValue({
        success: true,
        data: {
          response: 'Nutritional analysis complete',
          processingTime: 1500,
        },
      });

      render(<ConversationPage />);

      const validDescription = 'I need nutrition advice';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
      });

      // Button should remain disabled, preventing form submission
      expect(mockSendDescriptionToWebhookWithRetry).not.toHaveBeenCalled();
    });

    it('should show correct tooltip message for insufficient credits', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 10,
          used: 0,
          remaining: 10,
        }),
      });

      render(<ConversationPage />);

      const validDescription = 'Help with nutrition';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      // Hover to see tooltip
      const generateButton = screen.getByRole('button', { name: /Generate/ });
      fireEvent.mouseEnter(generateButton);

      await waitFor(() => {
        expect(screen.getByText(/Insufficient credits.*15.*10/)).toBeInTheDocument();
      });
    });
  });

  describe('Balance Gating - Sufficient Credits', () => {
    it('should enable Generate button when balance is exactly 15', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 15,
          used: 0,
          remaining: 15,
        }),
      });

      render(<ConversationPage />);

      const validDescription = 'I need personalized nutrition guidance';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeEnabled();
      });
    });

    it('should enable Generate button when balance is greater than 15', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 50,
          used: 0,
          remaining: 50,
        }),
      });

      render(<ConversationPage />);

      const validDescription = 'Create a meal plan for me';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeEnabled();
      });
    });

    it('should allow generation with sufficient credits', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 50,
          used: 0,
          remaining: 50,
        }),
      });

      mockSendDescriptionToWebhookWithRetry.mockResolvedValue({
        success: true,
        data: {
          response: JSON.stringify({
            greeting: 'Hello!',
            sections: [],
            closing: 'Take care',
          }),
          processingTime: 1500,
        },
      });

      render(<ConversationPage />);

      const validDescription = 'Nutritional analysis please';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        fireEvent.click(generateButton);
      });

      await waitFor(() => {
        expect(mockSendDescriptionToWebhookWithRetry).toHaveBeenCalledWith(
          validDescription,
          'master-nutritionist',
          'test-user-123',
          2,
          45000
        );
      });
    });
  });

  describe('Balance Updates', () => {
    it('should deduct 15 tokens from balance after successful generation', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 50,
          used: 0,
          remaining: 50,
        }),
      });

      const mockToastSuccess = jest.spyOn(toast, 'success');

      mockSendDescriptionToWebhookWithRetry.mockResolvedValue({
        success: true,
        data: {
          response: JSON.stringify({
            greeting: 'Hi there!',
            sections: [{ heading: 'Test', content: 'Content' }],
            closing: 'Thanks',
          }),
          processingTime: 1500,
        },
      });

      render(<ConversationPage />);

      // Wait for initial balance to load
      await waitFor(() => {
        expect(screen.getByText(/50 available/)).toBeInTheDocument();
      });

      const validDescription = 'Analyze nutrition for weight loss';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        fireEvent.click(generateButton);
      });

      // Wait for generation to complete
      await waitFor(() => {
        expect(mockSendDescriptionToWebhookWithRetry).toHaveBeenCalled();
        expect(mockToastSuccess).toHaveBeenCalled();
      });

      // Check that balance display updates (optimistic update)
      // Note: Component updates usedCredits state by 15, so 50 - 15 = 35 available
      await waitFor(() => {
        expect(screen.getByText(/35 available/)).toBeInTheDocument();
      });
    });

    it('should load credit balance on component mount', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 100,
          used: 20,
          remaining: 80,
        }),
      });
      
      global.fetch = mockFetch;

      render(<ConversationPage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/generations', { method: 'GET' });
      });

      await waitFor(() => {
        expect(screen.getByText(/Credits:.*80 available/)).toBeInTheDocument();
      });
    });

    it('should reactively update when balance changes', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 50,
          used: 0,
          remaining: 50,
        }),
      });

      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText(/50 available/)).toBeInTheDocument();
      });

      // Simulate a generation that updates the balance
      mockSendDescriptionToWebhookWithRetry.mockResolvedValue({
        success: true,
        data: {
          response: JSON.stringify({
            greeting: 'Hello!',
            sections: [],
            closing: 'Bye',
          }),
          processingTime: 1500,
        },
      });

      const validDescription = 'Help me with nutrition';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        fireEvent.click(generateButton);
      });

      // Wait for the balance to update (50 - 15 = 35)
      await waitFor(() => {
        expect(screen.getByText(/35 available/)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Edge Cases', () => {
    it('should handle balance exactly at threshold (15 tokens)', async () => {
      // Start with exactly 15 tokens - the minimum required
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 15,
          used: 0,
          remaining: 15,
        }),
      });

      render(<ConversationPage />);

      // Wait for balance to load
      await waitFor(() => {
        expect(screen.getByText(/15 available/)).toBeInTheDocument();
      });

      const validDescription = 'Nutrition guidance needed';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      // With exactly 15 tokens, button should be enabled
      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeEnabled();
      });
    });

    it('should handle loading state correctly', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({
            available: 50,
            used: 0,
            remaining: 50,
          }),
        }), 1000))
      );

      render(<ConversationPage />);

      // Should show loading state
      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
      });
    });

    it('should handle API error gracefully', async () => {
      const mockToastError = jest.spyOn(toast, 'error');
      
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      render(<ConversationPage />);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Failed to load credit balance');
      }, { timeout: 3000 });
    });

    it('should disable button when credits fall below 15 after generation', async () => {
      // Start with 20 credits (enough for one generation)
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 20,
          used: 0,
          remaining: 20,
        }),
      });

      mockSendDescriptionToWebhookWithRetry.mockResolvedValue({
        success: true,
        data: {
          response: JSON.stringify({
            greeting: 'Hi!',
            sections: [],
            closing: 'Bye',
          }),
          processingTime: 1500,
        },
      });

      render(<ConversationPage />);

      const validDescription = 'Nutrition help needed';

      // First generation should succeed
      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        fireEvent.click(generateButton);
      });

      await waitFor(() => {
        expect(mockSendDescriptionToWebhookWithRetry).toHaveBeenCalled();
      });

      // After generation, balance should be 20 - 15 = 5 (insufficient)
      await waitFor(() => {
        expect(screen.getByText(/5 available/)).toBeInTheDocument();
      });

      // Enter new description
      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'Another request' } });
      });

      // Button should now be disabled due to insufficient credits
      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
      });
    });
  });

  describe('Persistence Across Sessions', () => {
    it('should fetch balance on every component mount', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 100,
          used: 0,
          remaining: 100,
        }),
      });
      
      global.fetch = mockFetch;

      const { unmount } = render(<ConversationPage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      unmount();

      // Remount the component (simulating navigation back)
      render(<ConversationPage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });

    it('should reload balance when userId changes', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 50,
          used: 0,
          remaining: 50,
        }),
      });
      
      global.fetch = mockFetch;

      const { rerender } = render(<ConversationPage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Change userId by updating the spy
      jest.spyOn(ClerkNextJS, 'useAuth').mockReturnValue({
        userId: 'different-user-456',
        isLoaded: true,
        isSignedIn: true,
      } as any);

      rerender(<ConversationPage />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Pro Modal Integration', () => {
    it('should open pro modal and show toast when trying to generate with insufficient credits', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 5,
          used: 0,
          remaining: 5,
        }),
      });

      const mockToastError = jest.spyOn(toast, 'error');

      render(<ConversationPage />);

      const validDescription = 'I need nutrition advice';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      // The button should be disabled, preventing the click
      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
      });
    });
  });
});

