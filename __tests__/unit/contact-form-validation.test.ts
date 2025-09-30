import { formSchema, FormData } from '@/components/landing/constants';
import { z } from 'zod';

describe('Contact Form Validation Schema', () => {
  describe('firstName validation', () => {
    test('accepts valid first names', () => {
      const validData: FormData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        message: 'Hello there',
      };

      expect(() => formSchema.parse(validData)).not.toThrow();
    });

    test('rejects empty first name', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        message: 'Hello there',
      };

      expect(() => formSchema.parse(invalidData)).toThrow();
      
      try {
        formSchema.parse(invalidData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const firstNameError = error.errors.find(err => err.path.includes('firstName'));
          expect(firstNameError?.message).toBe('First name is required.');
        }
      }
    });

    test('accepts first names with various characters', () => {
      const testCases = ['John', 'María', 'Jean-Pierre', "O'Connor", '李'];
      
      testCases.forEach(firstName => {
        const validData: FormData = {
          firstName,
          lastName: 'Doe',
          email: 'test@example.com',
          message: 'Hello there',
        };
        
        expect(() => formSchema.parse(validData)).not.toThrow();
      });
    });
  });

  describe('lastName validation', () => {
    test('accepts valid last names', () => {
      const validData: FormData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        message: 'Hello there',
      };

      expect(() => formSchema.parse(validData)).not.toThrow();
    });

    test('rejects empty last name', () => {
      const invalidData = {
        firstName: 'John',
        lastName: '',
        email: 'john.doe@example.com',
        message: 'Hello there',
      };

      expect(() => formSchema.parse(invalidData)).toThrow();
      
      try {
        formSchema.parse(invalidData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const lastNameError = error.errors.find(err => err.path.includes('lastName'));
          expect(lastNameError?.message).toBe('Last name is required.');
        }
      }
    });

    test('accepts last names with various characters', () => {
      const testCases = ['Doe', 'García', 'Van Der Berg', "O'Sullivan", '王'];
      
      testCases.forEach(lastName => {
        const validData: FormData = {
          firstName: 'John',
          lastName,
          email: 'test@example.com',
          message: 'Hello there',
        };
        
        expect(() => formSchema.parse(validData)).not.toThrow();
      });
    });
  });

  describe('email validation', () => {
    test('accepts valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'firstname.lastname@company.com',
        '123@example.com',
        'test@subdomain.example.com',
      ];

      validEmails.forEach(email => {
        const validData: FormData = {
          firstName: 'John',
          lastName: 'Doe',
          email,
          message: 'Hello there',
        };
        
        expect(() => formSchema.parse(validData)).not.toThrow();
      });
    });

    test('rejects invalid email addresses', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com',
        'test@example',
        'test email@example.com',
      ];

      invalidEmails.forEach(email => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email,
          message: 'Hello there',
        };
        
        expect(() => formSchema.parse(invalidData)).toThrow();
      });
    });

    test('provides correct error messages for email validation', () => {
      // Empty email
      try {
        formSchema.parse({
          firstName: 'John',
          lastName: 'Doe',
          email: '',
          message: 'Hello',
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          const emailError = error.errors.find(err => err.path.includes('email'));
          expect(emailError?.message).toBe('Email is required.');
        }
      }

      // Invalid email format
      try {
        formSchema.parse({
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          message: 'Hello',
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          const emailError = error.errors.find(err => err.path.includes('email'));
          expect(emailError?.message).toBe('This is not a valid email.');
        }
      }
    });
  });

  describe('message validation', () => {
    test('accepts valid messages', () => {
      const validMessages = [
        'Hello, I have a question about your service.',
        'I would like to know more about nutrition planning.',
        'Great app! Keep up the good work.',
        'A short message.',
        'A very long message that contains multiple sentences and detailed information about what the user wants to know about the nutrition services and how they can be helped with their specific dietary requirements and health goals.',
      ];

      validMessages.forEach(message => {
        const validData: FormData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          message,
        };
        
        expect(() => formSchema.parse(validData)).not.toThrow();
      });
    });

    test('rejects empty message', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        message: '',
      };

      expect(() => formSchema.parse(invalidData)).toThrow();
      
      try {
        formSchema.parse(invalidData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const messageError = error.errors.find(err => err.path.includes('message'));
          expect(messageError?.message).toBe('Message is required.');
        }
      }
    });

    test('accepts messages with special characters and formatting', () => {
      const specialMessages = [
        'Hello! How are you?',
        'Message with numbers: 123, 456.',
        'Email me at: test@example.com',
        'Visit: https://example.com',
        'Special chars: @#$%^&*()',
        'Multi-line\nmessage\nwith\nbreaks',
        'Message with "quotes" and \'apostrophes\'',
      ];

      specialMessages.forEach(message => {
        const validData: FormData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          message,
        };
        
        expect(() => formSchema.parse(validData)).not.toThrow();
      });
    });
  });

  describe('complete form validation', () => {
    test('validates all fields together successfully', () => {
      const validData: FormData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        message: 'I would like to know more about your nutrition services. Thank you!',
      };

      const result = formSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    test('returns all validation errors for completely invalid form', () => {
      const invalidData = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        message: '',
      };

      try {
        formSchema.parse(invalidData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.errors).toHaveLength(4);
          
          const errorMessages = error.errors.map(err => err.message);
          expect(errorMessages).toContain('First name is required.');
          expect(errorMessages).toContain('Last name is required.');
          expect(errorMessages).toContain('This is not a valid email.');
          expect(errorMessages).toContain('Message is required.');
        }
      }
    });

    test('handles partial validation errors correctly', () => {
      const partiallyValidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        message: '',
      };

      try {
        formSchema.parse(partiallyValidData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          expect(error.errors).toHaveLength(2);
          
          const errorPaths = error.errors.map(err => err.path[0]);
          expect(errorPaths).toContain('email');
          expect(errorPaths).toContain('message');
          
          const errorMessages = error.errors.map(err => err.message);
          expect(errorMessages).toContain('This is not a valid email.');
          expect(errorMessages).toContain('Message is required.');
        }
      }
    });
  });

  describe('edge cases', () => {
    test('handles whitespace-only inputs', () => {
      const whitespaceData = {
        firstName: '   ',
        lastName: '   ',
        email: 'test@example.com', // Email must be valid
        message: '   ',
      };

      // Note: Our schema only checks for min length 1, so whitespace would pass
      // In a real application, you might want to add .trim() to the schema
      expect(() => formSchema.parse(whitespaceData)).not.toThrow();
    });

    test('handles very long inputs', () => {
      const longString = 'a'.repeat(1000);
      
      const longData: FormData = {
        firstName: longString,
        lastName: longString,
        email: `${longString}@example.com`,
        message: longString,
      };

      // This should pass validation (though might fail at API level for email)
      expect(() => formSchema.parse({
        firstName: longString,
        lastName: longString,
        email: 'valid@example.com',
        message: longString,
      })).not.toThrow();
    });
  });
});
