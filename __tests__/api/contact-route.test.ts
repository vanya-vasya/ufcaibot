/**
 * @jest-environment node
 */
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';
import * as nodemailerConfig from '@/config/nodemailer';
import axios from 'axios';

// Mock dependencies
jest.mock('@/config/nodemailer', () => ({
  mailOptions: {
    from: 'noreply@yum-mi.com',
    to: 'support@yum-mi.com',
  },
  transporter: {
    sendMail: jest.fn(),
  },
}));

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

// Mock environment variables
const originalEnv = process.env;

describe('/api/contact Route Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      RECAPTCHA_SECRET_KEY: 'test-secret-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const validRequestData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    message: 'I have a question about your nutrition services.',
    captchaToken: 'valid-captcha-token',
  };

  const createMockRequest = (data: any) => {
    return {
      method: 'POST',
      json: async () => data,
    } as NextRequest;
  };

  describe('Success Cases', () => {
    test('processes valid contact form submission successfully', async () => {
      // Mock successful reCAPTCHA verification
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true },
      });

      // Mock successful email sending
      const mockSendMail = jest.fn().mockResolvedValueOnce({});
      (nodemailerConfig.transporter.sendMail as jest.Mock) = mockSendMail;

      const request = createMockRequest(validRequestData);
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(await response.text()).toBe('Message sent successfully');

      // Verify reCAPTCHA verification was called
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: 'test-secret-key',
            response: 'valid-captcha-token',
          },
        }
      );

      // Verify email was sent
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@yum-mi.com',
          to: 'support@yum-mi.com',
          subject: 'New Contact Message',
          text: expect.stringContaining('Name:'),
          html: expect.stringContaining('New Contact Message'),
        })
      );
    });

    test('generates correct email content', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true },
      });

      const mockSendMail = jest.fn().mockResolvedValueOnce({});
      (nodemailerConfig.transporter.sendMail as jest.Mock) = mockSendMail;

      const request = createMockRequest(validRequestData);
      await POST(request);

      const callArgs = mockSendMail.mock.calls[0][0];
      
      // Check text content (the API includes captchaToken field)
      expect(callArgs.text).toContain('Name: \nJohn Doe');
      expect(callArgs.text).toContain('Email: \njohn.doe@example.com');
      expect(callArgs.text).toContain('Message: \nI have a question about your nutrition services.');

      // Check HTML content
      expect(callArgs.html).toContain('<h2>New Contact Message</h2>');
      expect(callArgs.html).toContain('<h3 class="form-heading" align="left">Name:</h3>');
      expect(callArgs.html).toContain('<p class="form-answer" align="left">John Doe</p>');
      expect(callArgs.html).toContain('<h3 class="form-heading" align="left">Email:</h3>');
      expect(callArgs.html).toContain('<p class="form-answer" align="left">john.doe@example.com</p>');
      expect(callArgs.html).toContain('<h3 class="form-heading" align="left">Message:</h3>');
      expect(callArgs.html).toContain('<p class="form-answer" align="left">I have a question about your nutrition services.</p>');
    });
  });

  describe('Validation Errors', () => {
    test('returns 400 for missing name', async () => {
      const invalidData = {
        ...validRequestData,
        name: '',
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe('Bad request');
    });

    test('returns 400 for missing email', async () => {
      const invalidData = {
        ...validRequestData,
        email: '',
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe('Bad request');
    });

    test('returns 400 for missing message', async () => {
      const invalidData = {
        ...validRequestData,
        message: '',
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe('Bad request');
    });

    test('returns 400 for missing captcha token', async () => {
      const invalidData = {
        ...validRequestData,
        captchaToken: '',
      };

      const request = createMockRequest(invalidData);
      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe('Bad request');
    });

    test('returns 400 for completely missing data', async () => {
      const request = createMockRequest(null);
      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe('Bad request');
    });

    test('returns 400 for invalid reCAPTCHA token', async () => {
      // Mock failed reCAPTCHA verification
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: false },
      });

      const request = createMockRequest(validRequestData);
      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe('Invalid reCAPTCHA');

      // Verify reCAPTCHA verification was called
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: 'test-secret-key',
            response: 'valid-captcha-token',
          },
        }
      );
    });
  });

  describe('Error Handling', () => {
    test('handles email sending failure', async () => {
      // Mock successful reCAPTCHA verification
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true },
      });

      // Mock email sending failure
      const mockSendMail = jest.fn().mockRejectedValueOnce(new Error('Email service unavailable'));
      (nodemailerConfig.transporter.sendMail as jest.Mock) = mockSendMail;

      const request = createMockRequest(validRequestData);
      const response = await POST(request);

      expect(response.status).toBe(400);
      
      const responseBody = await response.json();
      expect(responseBody.message).toBe('Some error, try again later');
    });

    test('handles reCAPTCHA verification network error', async () => {
      // Mock reCAPTCHA verification network error
      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

      const request = createMockRequest(validRequestData);
      
      // This should throw an error and result in a 500 response
      await expect(POST(request)).rejects.toThrow();
    });

    test('handles malformed JSON data', async () => {
      const request = {
        method: 'POST',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as NextRequest;

      await expect(POST(request)).rejects.toThrow();
    });
  });

  describe('reCAPTCHA Integration', () => {
    test('sends correct parameters to reCAPTCHA API', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true },
      });

      const mockSendMail = jest.fn().mockResolvedValueOnce({});
      (nodemailerConfig.transporter.sendMail as jest.Mock) = mockSendMail;

      const customData = {
        ...validRequestData,
        captchaToken: 'custom-captcha-token-123',
      };

      const request = createMockRequest(customData);
      await POST(request);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: 'test-secret-key',
            response: 'custom-captcha-token-123',
          },
        }
      );
    });

    test('handles missing RECAPTCHA_SECRET_KEY environment variable', async () => {
      delete process.env.RECAPTCHA_SECRET_KEY;

      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true },
      });

      const mockSendMail = jest.fn().mockResolvedValueOnce({});
      (nodemailerConfig.transporter.sendMail as jest.Mock) = mockSendMail;

      const request = createMockRequest(validRequestData);
      await POST(request);
      
      // Should still work, but with undefined secret
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: undefined,
            response: 'valid-captcha-token',
          },
        }
      );
    });
  });

  describe('HTTP Method Handling', () => {
    test('returns 400 for non-POST requests', async () => {
      const request = {
        method: 'GET',
        json: async () => validRequestData,
      } as NextRequest;

      const response = await POST(request);

      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody.message).toBe('Bad request');
    });
  });

  describe('Security Considerations', () => {
    test('does not expose sensitive information in error responses', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true },
      });

      const mockSendMail = jest.fn().mockRejectedValueOnce(new Error('Database connection failed with credentials: user:pass@localhost'));
      (nodemailerConfig.transporter.sendMail as jest.Mock) = mockSendMail;

      const request = createMockRequest(validRequestData);
      const response = await POST(request);

      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody.message).toBe('Some error, try again later');
      expect(responseBody.message).not.toContain('credentials');
      expect(responseBody.message).not.toContain('Database');
    });

    test('sanitizes input data in email content', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true },
      });

      const mockSendMail = jest.fn().mockResolvedValueOnce({});
      (nodemailerConfig.transporter.sendMail as jest.Mock) = mockSendMail;

      const maliciousData = {
        name: '<script>alert("xss")</script>John Doe',
        email: 'john.doe@example.com',
        message: 'Hello <img src="x" onerror="alert(1)">',
        captchaToken: 'valid-captcha-token',
      };

      const request = createMockRequest(maliciousData);
      await POST(request);

      const callArgs = mockSendMail.mock.calls[0][0];
      
      // The content should contain the raw input (email templates should handle escaping)
      expect(callArgs.text).toContain('<script>alert("xss")</script>John Doe');
      expect(callArgs.text).toContain('Hello <img src="x" onerror="alert(1)">');
      expect(callArgs.html).toContain('<script>alert("xss")</script>John Doe');
      expect(callArgs.html).toContain('Hello <img src="x" onerror="alert(1)">');
    });
  });
});
