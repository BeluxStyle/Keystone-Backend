import NextAuth, { AuthOptions, Session } from 'next-auth';
import { keystoneContext } from '../../../../keystone/context';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { session } from '../../../../../auth';
import { request } from 'http';
import { Token } from 'graphql';
import type { DefaultJWT } from 'next-auth/jwt'
import type { DefaultSession, DefaultUser } from 'next-auth'


export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials || {};
        console.log('🔥Credentials:', { email, password });
        console.log('🔥Req:', req);
        const context = await keystoneContext.withRequest(req);

      
        try {
          const result = await (await context).graphql.raw({
            query: `
              mutation Login($email: String!, $password: String!) {
                authenticateUserWithPassword(email: $email, password: $password) {
                  ... on UserAuthenticationWithPasswordSuccess {
                    item {
                      id
                      email
                      rol {
                        level
                      }
                    }
                    sessionToken
                  }
                  ... on UserAuthenticationWithPasswordFailure {
                    message
                  }
                }
              }
            `,
            variables: { email, password },
          });
          
      
          console.log('🔥Result:', result);
      
          const authResult = result.data?.authenticateUserWithPassword;

          
          
      
          if (authResult?.__typename === 'UserAuthenticationWithPasswordSuccess') {
            // Devuelve el usuario y el sessionToken
            return {
              id: authResult.item.id,
              email: authResult.item.email,
              rol: authResult.item.rol?.level,
              sessionToken: authResult.sessionToken,
            };
          }
      
          throw new Error(authResult?.message || 'Authentication failed');
        } catch (error) {
          console.error('Error during authentication:', error);
          throw new Error(error.message || 'Error during authentication');
        }
      }
      
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.rol = user.rol;
        token.sessionToken = user.sessionToken; // Incluye el sessionToken
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          rol: token.rol,
        };
        session.sessionToken = token.sessionToken; // Añade el sessionToken
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  debug: process.env.NODE_ENV === 'development',
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };