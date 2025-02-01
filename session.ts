import { getContext } from '@keystone-6/core/context'
import { getServerSession } from 'next-auth/next'
import type { DefaultJWT } from 'next-auth/jwt'
import type { DefaultSession, DefaultUser } from 'next-auth'
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { Context } from '.keystone/types'

// WARNING: this example is for demonstration purposes only
//   as with each of our examples, it has not been vetted
//   or tested for any particular usage

// WARNING: you need to change this
const sessionSecret = process.env.NEXTAUTH_SECRET!

let _keystoneContext: Context = (globalThis as any)._keystoneContext

async function getKeystoneContext () {
  if (_keystoneContext) return _keystoneContext

  // TODO: this could probably be better
  _keystoneContext = getContext(
    (await import('./keystone')).default,

    // WARNING: this is only needed for our monorepo examples, dont do this
    await import('myprisma')
    // await import('@prisma/client') // <-- do this
  )
  if (process.env.NODE_ENV !== 'production') {
    (globalThis as any)._keystoneContext = _keystoneContext
  }
  return _keystoneContext
}

// see https://next-auth.js.org/configuration/options for more
export const nextAuthOptions = {
  secret: sessionSecret,
  callbacks: {
    async signIn ({ user }: { user: DefaultUser }) {
      // console.error('next-auth signIn', { user, account, profile });
      const sudoContext = (await getKeystoneContext()).sudo()

      // check if the user exists in keystone
      const author = await sudoContext.query.User.findOne({
        where: { googleId: user.id },
      })

      // if not, sign up
      if (!author) {
        await sudoContext.query.User.createOne({
          data: {
            googleId: user.id,
            name: user.name,
          },
        })
      }

      return true // accept the signin
    },

    async session ({
      session,
      token,
    }: {
      session: DefaultSession // required by next-auth, not by us
      token: DefaultJWT
    }) {
      // console.error('next-auth session', { session, token });
      return {
        ...session,
        keystone: {
          authId: token.sub,
        },
      }
    },
  },
  providers: [
    // allow anyone with a GitHub account to sign up as an author
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: 'Email y Contraseña',
      credentials: {
        email: { label: 'Email', type: 'email', required: true },
        password: { label: 'Contraseña', type: 'password', required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son obligatorios.');
        }
        try {
          const { email, password } = credentials;
          const sudoContext = (await getKeystoneContext()).sudo();
          const result = await sudoContext.graphql.run({
            query: `
              mutation AuthenticateUser($email: String!, $password: String!) {
                authenticateUserWithPassword(email: $email, password: $password) {
                  ... on UserAuthenticationWithPasswordSuccess {
                    sessionToken
                    item {
                      id
                      name
                      email
                      rol { level }
                    }
                  }
                  ... on UserAuthenticationWithPasswordFailure {
                    message
                  }
                }
              }
            `,
            variables: { email, password },
          });
          const authResult = result.authenticateUserWithPassword;
          if (authResult?.__typename === 'UserAuthenticationWithPasswordSuccess') {
            return {
              id: authResult.item.id,
              email: authResult.item.email,
              rol: authResult.item.rol?.level || 0,
              sessionToken: authResult.sessionToken,
            };
          }
          throw new Error(authResult?.message || 'Credenciales inválidas');
        } catch (error: any) {
          console.error('Error en authorize:', error);
          throw new Error(error.message || 'Error de autenticación');
        }
      },
    }),
  ],
}


export type Session = {
  id: string
}

export const nextAuthSessionStrategy = {
  async get ({ context }: { context: Context }) {
    const { req, res } = context
    const { headers } = req ?? {}
    if (!headers?.cookie || !res) return

    // next-auth needs a different cookies structure
    const cookies: Record<string, string> = {}
    for (const part of headers.cookie.split(';')) {
      const [key, value] = part.trim().split('=')
      cookies[key] = decodeURIComponent(value)
    }

    const nextAuthSession = await getServerSession(
      { headers, cookies } as any,
      res,
      nextAuthOptions
    )
    if (!nextAuthSession) return

    const { authId } = nextAuthSession.keystone
    if (!authId) return

    const author = await context.sudo().db.User.findOne({
      where: { googleId: authId },
    })
    if (!author) return

    return { id: author.id }
  },

  // we don't need these as next-auth handle start and end for us
  async start () {},
  async end () {},
}
