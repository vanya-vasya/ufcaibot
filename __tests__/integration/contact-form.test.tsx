import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-hot-toast';
import ContactPage from '@/app/(landing)/(main)/contact/page';
import * as apiModule from '@/lib/api';

// Mock dependencies
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

jest.mock('@/lib/api');

const mockedSendContactForm = jest.mocked(apiModule.sendContactForm);

describe('Contact Form Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    test('renders all required form elements with proper accessibility', () => {
      render(<ContactPage />);

      // Check headings
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Get in touch');
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Have a question or feedback?');
      expect(screen.getByText('We would love to hear from you.')).toBeInTheDocument();

      // Check form fields
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

      // Check required attributes
      expect(screen.getByLabelText(/first name/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/last name/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/message/i)).toHaveAttribute('aria-required', 'true');

      // Check submit button
      const submitButton = screen.getByRole('button', { name: /send message to yum-mi team/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent('Send Message');
    });

    test('displays contact information section', () => {
      render(<ContactPage />);

      expect(screen.getByText('Contact Information')).toBeInTheDocument();
      expect(screen.getByText('Email Support')).toBeInTheDocument();
      expect(screen.getByText('For general questions and support')).toBeInTheDocument();
      expect(screen.getByText('Response Time')).toBeInTheDocument();
      expect(screen.getByText('Feedback & Ideas')).toBeInTheDocument();

      // Check email link
      const emailLink = screen.getByRole('link', { name: /send email to yum-mi support/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:info@yum-mi.com');
    });
  });

  describe('Form Validation', () => {
    test('shows validation errors for empty required fields', async () => {
      render(<ContactPage />);

      const submitButton = screen.getByRole('button', { name: /send message to yum-mi team/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('First name is required.')).toBeInTheDocument();
        expect(screen.getByText('Last name is required.')).toBeInTheDocument();
        expect(screen.getByText('Email is required.')).toBeInTheDocument();
        expect(screen.getByText('Message is required.')).toBeInTheDocument();
      });
    });

    test('validates email format', async () => {
      render(<ContactPage />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /send message to yum-mi team/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('This is not a valid email.')).toBeInTheDocument();
      });
    });

    test('clears validation errors when fields are filled correctly', async () => {
      render(<ContactPage />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      // First trigger validation errors
      const submitButton = screen.getByRole('button', { name: /send message to yum-mi team/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('First name is required.')).toBeInTheDocument();
      });

      // Then fill in the fields
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(messageInput, 'This is a test message');

      await waitFor(() => {
        expect(screen.queryByText('First name is required.')).not.toBeInTheDocument();
        expect(screen.queryByText('Last name is required.')).not.toBeInTheDocument();
        expect(screen.queryByText('Email is required.')).not.toBeInTheDocument();
        expect(screen.queryByText('Message is required.')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    const validFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      message: 'This is a test message about nutrition',
    };

    const fillForm = async (data = validFormData) => {
      await user.type(screen.getByLabelText(/first name/i), data.firstName);
      await user.type(screen.getByLabelText(/last name/i), data.lastName);
      await user.type(screen.getByLabelText(/email/i), data.email);
      await user.type(screen.getByLabelText(/message/i), data.message);
    };

    test('submits form successfully with valid data', async () => {
      mockedSendContactForm.mockResolvedValueOnce({});
      render(<ContactPage />);

      await fillForm();

      const submitButton = screen.getByRole('button', { name: /send message to yum-mi team/i });
      await user.click(submitButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByText('Sending...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });

      // Wait for success state
      await waitFor(() => {
        expect(mockedSendContactForm).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john.doe@example.com',
          message: 'This is a test message about nutrition',
          captchaToken: 'placeholder_token',
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Message Sent!')).toBeInTheDocument();
        expect(toast.success).toHaveBeenCalledWith(
          "Message sent successfully! We'll get back to you soon."
        );
      });

      // Check that form is reset
      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toHaveValue('');
        expect(screen.getByLabelText(/last name/i)).toHaveValue('');
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
        expect(screen.getByLabelText(/message/i)).toHaveValue('');
      });
    });

    test('handles form submission error gracefully', async () => {
      mockedSendContactForm.mockRejectedValueOnce(new Error('Network error'));
      render(<ContactPage />);

      await fillForm();

      const submitButton = screen.getByRole('button', { name: /send message to yum-mi team/i });
      await user.click(submitButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByText('Sending...')).toBeInTheDocument();
      });

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
        expect(toast.error).toHaveBeenCalledWith('Failed to send message. Please try again later or contact us directly.');
      });

      // Form data should still be preserved
      expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john.doe@example.com');
      expect(screen.getByLabelText(/message/i)).toHaveValue('This is a test message about nutrition');
    });

    test('disables form during submission', async () => {
      mockedSendContactForm.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
      render(<ContactPage />);

      await fillForm();

      const submitButton = screen.getByRole('button', { name: /send message to yum-mi team/i });
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(firstNameInput).toBeDisabled();
        expect(lastNameInput).toBeDisabled();
        expect(emailInput).toBeDisabled();
        expect(messageInput).toBeDisabled();
      });
    });

    test('resets submit state after timeout', async () => {
      jest.useFakeTimers();
      mockedSendContactForm.mockResolvedValueOnce({});
      
      render(<ContactPage />);
      await fillForm();

      const submitButton = screen.getByRole('button', { name: /send message to yum-mi team/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Message Sent!')).toBeInTheDocument();
      });

      // Fast-forward time
      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(screen.getByText('Send Message')).toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Accessibility Features', () => {
    test('has proper ARIA labels and form associations', () => {
      render(<ContactPage />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send message to yum-mi team/i });

      expect(firstNameInput).toHaveAttribute('aria-required', 'true');
      expect(lastNameInput).toHaveAttribute('aria-required', 'true');
      expect(emailInput).toHaveAttribute('aria-required', 'true');
      expect(messageInput).toHaveAttribute('aria-required', 'true');

      expect(submitButton).toHaveAttribute('aria-label', 'Send message to Yum-mi team');
    });

    test('associates error messages with form fields', async () => {
      render(<ContactPage />);

      const submitButton = screen.getByRole('button', { name: /send message to yum-mi team/i });
      await user.click(submitButton);

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText(/first name/i);
        const errorMessage = screen.getByText('First name is required.');
        
        expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
        expect(firstNameInput).toHaveAttribute('aria-describedby');
        
        const describedBy = firstNameInput.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        expect(errorMessage).toHaveAttribute('id', describedBy?.split(' ')[1]);
      });
    });

    test('maintains focus management during form interactions', async () => {
      render(<ContactPage />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      const submitButton = screen.getByRole('button', { name: /send message to yum-mi team/i });

      await user.click(firstNameInput);
      expect(firstNameInput).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/last name/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/message/i)).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });

  describe('Responsive Design', () => {
    test('renders properly on different screen sizes', () => {
      const { container } = render(<ContactPage />);
      
      // Check for responsive classes
      expect(container.querySelector('.grid-cols-1')).toBeInTheDocument();
      expect(container.querySelector('.lg\\:grid-cols-2')).toBeInTheDocument();
      expect(container.querySelector('.sm\\:grid-cols-2')).toBeInTheDocument();
      
      // Check responsive typography
      expect(container.querySelector('.text-4xl')).toBeInTheDocument();
      expect(container.querySelector('.sm\\:text-5xl')).toBeInTheDocument();
      expect(container.querySelector('.lg\\:text-6xl')).toBeInTheDocument();
    });
  });
});
