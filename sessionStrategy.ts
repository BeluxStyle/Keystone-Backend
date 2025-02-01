// src/sessionStrategy.ts
import { statelessSessions, SessionStrategy } from '@keystone-6/core/session';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './src/app/api/auth/[...nextauth]/route';

// Primero, obtenemos la estrategia de sesión por defecto de Keystone.
const defaultSessionStrategy = statelessSessions({
  maxAge: 60 * 60 * 24 * 30, // 30 días
  secret: process.env.SESSION_SECRET!, // Asegúrate de que SESSION_SECRET esté definido en .env
});

// Creamos un nuevo objeto que copie todas las propiedades (enumerables y no enumerables)
// de la estrategia por defecto.
const nextAuthSessionStrategy: SessionStrategy<any> = Object.create(
  null,
  Object.getOwnPropertyDescriptors(defaultSessionStrategy)
);

// Sobrescribimos el método get para usar NextAuth.
nextAuthSessionStrategy.get = async ({ context }) => {
  const { req, res } = context;
  if (!req || !res) return null;

  // Obtenemos la sesión de NextAuth
  const nextAuthSession = await getServerSession({ req, res }, authOptions);
  if (!nextAuthSession || !nextAuthSession.keystone || !nextAuthSession.keystone.authId) {
    return null;
  }
  // Retornamos el objeto que Keystone espera: { data: { id: <authId> } }
  return { data: { id: nextAuthSession.keystone.authId } };
};

// Los métodos start y end pueden dejarse vacíos, ya que NextAuth gestiona el inicio/cierre.
nextAuthSessionStrategy.start = async ({ context, data }) => { /* No es necesario */ };
nextAuthSessionStrategy.end = async ({ context }) => { /* No es necesario */ };

export { nextAuthSessionStrategy };
