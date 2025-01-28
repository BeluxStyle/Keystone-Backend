// app/api/keystone-auth/route.ts
import { keystoneContext } from '../../../keystone/context';

// app/api/keystone-auth/route.ts
export async function POST(request: Request) {
    try {
      const { email, password } = await request.json();
  
      const result = await keystoneContext.graphql.raw({
        query: `
          mutation ($email: String!, $password: String!) {
            authenticateUserWithPassword(email: $email, password: $password) {
              ... on UserAuthenticationWithPasswordSuccess {
                sessionToken
                item { id email rol { level } }
              }
              ... on UserAuthenticationWithPasswordFailure {
                message
              }
            }
          }
        `,
        variables: { email, password }
      });
  
      const authResult = result.data?.authenticateUserWithPassword;
  
      if (authResult?.__typename === 'UserAuthenticationWithPasswordSuccess') {
        const headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.NEXTAUTH_URL || 'http://localhost:3000',
          'Access-Control-Allow-Credentials': 'true',
          'Set-Cookie': `keystonejs-session=${authResult.sessionToken}; Path=/; HttpOnly; ${
            process.env.NODE_ENV === 'production' ? 'Secure; SameSite=None' : 'SameSite=Lax'
          }`
        };
  
        return new Response(JSON.stringify({
          success: true,
          rol: authResult.item.rol
        }), { status: 200, headers });
      }
  
      return new Response(JSON.stringify({
        success: false,
        message: authResult?.message || 'Credenciales inválidas'
      }), { status: 401 });
  
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Error interno del servidor'
      }), { status: 500 });
    }
  }
  
  export async function OPTIONS() {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }