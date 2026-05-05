import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '../context/AuthStore';

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Inicializar el listener de autenticación de Firebase
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
