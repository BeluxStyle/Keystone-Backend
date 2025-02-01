import { createAuth } from '@keystone-6/auth';


export const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  sessionData: 'id name email',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
});

