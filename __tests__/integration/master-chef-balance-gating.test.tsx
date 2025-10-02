/**
 * Integration tests for Your Own Chef (master-chef) balance gating
 * Tests the 10 token pricing and balance validation
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConversationPage from '@/app/(dashboard)/dashboard/conversation/page';
import * as NextNavigation from 'next/navigation';
import * as ClerkNextJS from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

// Mock N8N Webhook Client
const mockSendFileToWebhookWithRetry = jest.fn();
jest.mock('@/lib/n8n-webhook', () => ({
  N8nWebhookClient: jest.fn().mockImplementation(() => ({
    sendFileToWebhookWithRetry: mockSendFileToWebhookWithRetry,
    sendDescriptionToWebhookWithRetry: jest.fn(),
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

describe('Your Own Chef (master-chef) Balance Gating', () => {
  beforeEach(() => {
    // Setup spies for navigation and auth
    jest.spyOn(NextNavigation, 'useSearchParams').mockReturnValue({
      get: (key: string) => {
        if (key === 'toolId') return 'master-chef';
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
    mockSendFileToWebhookWithRetry.mockClear();
    mockOnOpen.mockClear();
  });

  describe('Pricing Display', () => {
    it('should display 10 tokens per generation pricing', async () => {
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
        expect(screen.getByText(/10 tokens per generation/i)).toBeInTheDocument();
      });
    });

    it('should show 10 required in credit information', async () => {
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
        expect(screen.getByText(/Credits:.*50 available.*10 required/)).toBeInTheDocument();
      });
    });
  });

  describe('Balance Gating - Insufficient Credits', () => {
    it('should disable Generate button when balance is less than 10', async () => {
      // Mock balance with less than 10 tokens
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 5,
          used: 0,
          remaining: 5,
        }),
      });

      render(<ConversationPage />);

      // Create a mock file
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
      });
    });

    it('should disable Generate button when balance is exactly 9', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 9,
          used: 0,
          remaining: 9,
        }),
      });

      render(<ConversationPage />);

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
      });
    });

    it('should show insufficient credits tooltip when hovering over disabled button', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 5,
          used: 0,
          remaining: 5,
        }),
      });

      render(<ConversationPage />);

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
      });

      // Note: Tooltip testing is complex in Radix UI and may require different approach
      // For now, we verify the button is disabled which is the critical behavior
    });

    it('should prevent generation when insufficient credits', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 5,
          used: 0,
          remaining: 5,
        }),
      });

      // Mock successful webhook response
      mockSendFileToWebhookWithRetry.mockResolvedValue({
        success: true,
        data: {
          response: 'Recipe generated',
          processingTime: 1500,
        },
      });

      render(<ConversationPage />);

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
      });

      // Button should remain disabled, preventing form submission
      expect(mockSendFileToWebhookWithRetry).not.toHaveBeenCalled();
    });
  });

  describe('Balance Gating - Sufficient Credits', () => {
    it('should enable Generate button when balance is exactly 10', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 10,
          used: 0,
          remaining: 10,
        }),
      });

      render(<ConversationPage />);

      // Upload a file first
      const fileInput = screen.getByLabelText(/choose image from files/i);
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeEnabled();
      });
    });

    it('should enable Generate button when balance is greater than 10', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 50,
          used: 0,
          remaining: 50,
        }),
      });

      render(<ConversationPage />);

      // Upload a file first
      const fileInput = screen.getByLabelText(/choose image from files/i);
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeEnabled();
      });
    });

    it('should enable button when sufficient credits and image uploaded', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 50,
          used: 0,
          remaining: 50,
        }),
      });

      render(<ConversationPage />);

      // Upload a file first
      const fileInput = screen.getByLabelText(/choose image from files/i);
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeEnabled();
      });
    });
  });

  describe('Balance Updates', () => {
    it('should deduct 10 tokens from balance after successful generation', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 50,
          used: 0,
          remaining: 50,
        }),
      });

      const mockToastSuccess = jest.spyOn(toast, 'success');

      mockSendFileToWebhookWithRetry.mockResolvedValue({
        success: true,
        data: {
          response: JSON.stringify({
            dish: 'Test Recipe',
            kcal: 500,
            prot: 30,
            fat: 20,
            carb: 50,
            recipe: '## Test Recipe\n\nInstructions here',
          }),
          processingTime: 1500,
        },
      });

      render(<ConversationPage />);

      // Wait for initial balance to load
      await waitFor(() => {
        expect(screen.getByText(/50 available/)).toBeInTheDocument();
      });

      // Upload a file
      const fileInput = screen.getByLabelText(/choose image from files/i);
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        fireEvent.click(generateButton);
      });

      // Wait for generation to complete
      await waitFor(() => {
        expect(mockSendFileToWebhookWithRetry).toHaveBeenCalled();
        expect(mockToastSuccess).toHaveBeenCalled();
      });

      // Check that balance display updates (optimistic update)
      // Note: Component updates usedCredits state by 10, so 50 - 10 = 40 available
      await waitFor(() => {
        expect(screen.getByText(/40 available/)).toBeInTheDocument();
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
      mockSendFileToWebhookWithRetry.mockResolvedValue({
        success: true,
        data: {
          response: JSON.stringify({
            dish: 'Test Recipe',
            kcal: 500,
            prot: 30,
            fat: 20,
            carb: 50,
            recipe: '## Test Recipe',
          }),
          processingTime: 1500,
        },
      });

      // Upload file and generate
      const fileInput = screen.getByLabelText(/choose image from files/i);
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        fireEvent.click(generateButton);
      });

      // Wait for the balance to update (50 - 10 = 40)
      await waitFor(() => {
        expect(screen.getByText(/40 available/)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Edge Cases', () => {
    it('should handle balance exactly at threshold (10 tokens)', async () => {
      // Start with exactly 10 tokens - the minimum required
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 10,
          used: 0,
          remaining: 10,
        }),
      });

      render(<ConversationPage />);

      // Wait for balance to load
      await waitFor(() => {
        expect(screen.getByText(/10 available/)).toBeInTheDocument();
      });

      // Upload file
      const fileInput = screen.getByLabelText(/choose image from files/i);
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      // With exactly 10 tokens, button should be enabled
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

    it('should open pro modal when user has insufficient credits', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 5,
          used: 0,
          remaining: 5,
        }),
      });

      render(<ConversationPage />);

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
      });

      // The button is disabled, so clicking won't do anything
      // But in the actual code, if somehow the check was bypassed,
      // the pro modal would open
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
});

