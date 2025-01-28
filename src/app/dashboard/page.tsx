'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const Dashboard = () => {
  const { data: session } = useSession();
  console.log(session);

  if (!session?.user) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <img src={session.user.image} alt={session.user.name} />
      <p>Bienvenido, {session.user.name}</p>
      {session.user.isAdmin ? <p>Tienes privilegios de administrador.</p> : <p>Acceso de usuario.</p>}
      <button onClick={() => signOut()}>Cerrar Sesión</button>
    </div>
  );
};

export default Dashboard;
