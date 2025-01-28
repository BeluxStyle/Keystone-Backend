import { keystoneContext } from '../keystone/context';

export async function loginUser(email: string, password: string) {
  try {
    const context = keystoneContext.sudo();

    // Llama a la mutación de Keystone para autenticar
    const result = await context.graphql.run({
      query: `
        mutation Authenticate($email: String!, $password: String!) {
          authenticateUserWithPassword(email: $email, password: $password) {
            ... on UserAuthenticationWithPasswordSuccess {
              sessionToken
              item {
                id
                name
                email
                rol {
                  level
                }
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
        token: authResult.sessionToken,
        user: authResult.item,
      };
    } else {
      throw new Error(authResult?.message || 'Error al autenticar');
    }
  } catch (error) {
    console.error('Error en loginUser:', error);
    throw new Error('Error al autenticar usuario');
  }
}
