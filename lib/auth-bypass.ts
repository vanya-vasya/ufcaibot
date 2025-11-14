// TEMPORARY: Auth bypass for local design work
// DELETE THIS FILE when re-enabling Clerk authentication

/**
 * Mock auth function that returns a fake user ID
 * This allows viewing all pages without Clerk authentication during local development
 */
export const auth = () => {
  return { 
    userId: 'local-dev-user-123',
    sessionId: 'local-session',
    orgId: null 
  };
};

/**
 * Mock currentUser function
 */
export const currentUser = async () => {
  return {
    id: 'local-dev-user-123',
    firstName: 'Local',
    lastName: 'User',
    emailAddresses: [{ emailAddress: 'local@dev.com' }],
  };
};

