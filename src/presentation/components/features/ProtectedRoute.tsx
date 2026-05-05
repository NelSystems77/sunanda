import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/presentation/context/AuthStore';
import { UserRole } from '@/core/domain/enums/roles';
import { Spinner } from '../ui/Spinner';
import { ROUTES } from '@/shared/constants';

export interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  roles,
  redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // Mostrar spinner mientras carga
  if (isLoading) {
    return <Spinner fullScreen text="Verificando sesión..." />;
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Verificar roles si se especificaron
  if (roles && roles.length > 0) {
    if (!roles.includes(user.role)) {
      // Usuario no tiene el rol requerido
      return (
        <Navigate
          to={ROUTES.DASHBOARD}
          state={{
            error: 'No tienes permisos para acceder a esta página',
          }}
          replace
        />
      );
    }
  }

  // Usuario autenticado y con permisos correctos
  return <>{children}</>;
}
