import { config } from '@keystone-6/core'
import { lists } from './src/keystone/schema'
import { seedDemoData } from './src/keystone/seed'
import type { Context } from '.keystone/types'
import { withAuth, session } from './auth';

export default withAuth(
  config({
  db: {
    provider: 'mysql',
      url: process.env.DATABASE_URL || '',

    // WARNING: this is only needed for our monorepo examples, dont do this
    prismaClientPath: 'node_modules/myprisma',
  },
  lists,
  ui: {
    isAccessAllowed: ({ session }) => !!session?.user,
  },
  session,
  server: {
    cors: {
      origin: ['*'],
      credentials: true,
    },
    extendExpressApp: (app) => {
      app.use((req, res, next) => {
        console.log('A request!');
        next();
      });
    },
  },
})
);