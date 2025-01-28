import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';

const sessionSecret = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET;

export const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  sessionData: 'id name email rol { level }',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
});

export const session = statelessSessions({
  maxAge: 60 * 60 * 24 * 30, // 30 días
  secret: sessionSecret,
});
