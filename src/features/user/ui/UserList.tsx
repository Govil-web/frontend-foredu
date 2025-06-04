import React from 'react';
import { useUsers } from '../model/useUsers';

export function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error al cargar usuarios</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.nombre} {user.apellido} - {user.email}</li>
      ))}
    </ul>
  );
} 