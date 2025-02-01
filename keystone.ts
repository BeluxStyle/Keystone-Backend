import { config } from '@keystone-6/core'
import { lists } from './src/keystone/schema'

import { type Session, nextAuthSessionStrategy } from './session'
import type { TypeInfo } from '.keystone/types'

// WARNING: this example is for demonstration purposes only
//   as with each of our examples, it has not been vetted
//   or tested for any particular usage

export default config<TypeInfo<Session>>({
  db: {
    provider: 'mysql',
    url: process.env.DATABASE_URL!,

    // WARNING: this is only needed for our monorepo examples, dont do this
    prismaClientPath: 'node_modules/myprisma',
  },
  ui: {
    // the following api routes are required for nextauth.js
    publicPages: [
      '/app/api/auth/csrf',
      '/app/api/auth/signin',
      '/app/api/auth/callback',
      '/app/api/auth/session',
      '/app/api/auth/providers',
      '/app/api/auth/signout',
      '/app/api/auth/error',

      // each provider will need a separate callback and signin page listed here
      '/app/api/auth/signin/github',
      '/app/api/auth/callback/github',
    ],

    // adding page middleware ensures that users are redirected to the signin page if they are not signed in.
    pageMiddleware: async ({ wasAccessAllowed }) => {
      if (wasAccessAllowed) return
      return {
        kind: 'redirect',
        to: '/api/auth/signin',
      }
    },
  },
  lists,
  // you can find out more at https://keystonejs.com/docs/apis/session#session-api
  session: nextAuthSessionStrategy,
})