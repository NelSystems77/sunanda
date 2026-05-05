import { useAuthStore } from '../context/AuthStore';
import { UserRole } from '@/core/domain/enums/roles';
import { PermissionService } from '@/core/application/services/PermissionService';


export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, error, clearError } =
    useAuthStore();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return PermissionService.hasPermission(user.role, permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    return PermissionService.hasAnyPermission(user.role, permissions);
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    return PermissionService.hasAllPermissions(user.role, permissions);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isAdmin = (): boolean => {
    if (!user) return false;
    return PermissionService.isAdmin(user.role);
  };

  const isSuperAdmin = (): boolean => {
    if (!user) return false;
    return PermissionService.isSuperAdmin(user.role);
  };

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    error,

    // Acciones
    login,
    logout,
    clearError,

    // Permisos
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };
}
