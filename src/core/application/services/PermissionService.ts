import { UserRole, canManageRole, getManageableRoles } from '../../domain/enums/roles';

/**
 * Servicio de permisos
 * Ahora usa las funciones del nuevo sistema de roles
 */
export class PermissionService {
  /**
   * Verificar si un rol puede gestionar otro rol
   */
  static canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
    return canManageRole(managerRole, targetRole);
  }

  /**
   * Obtener roles que un usuario puede gestionar
   */
  static getManageableRoles(userRole: UserRole): UserRole[] {
    return getManageableRoles(userRole);
  }

  /**
   * Verificar si es admin (ADMIN o SUPER_ADMIN)
   */
  static isAdmin(role: UserRole): boolean {
    return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN;
  }

  /**
   * Verificar si es super admin
   */
  static isSuperAdmin(role: UserRole): boolean {
    return role === UserRole.SUPER_ADMIN;
  }

  /**
   * Verificar si es esteticista
   */
  static isEstheticist(role: UserRole): boolean {
    return role === UserRole.ESTETICISTA;
  }

  /**
   * Verificar si es recepcionista
   */
  static isReceptionist(role: UserRole): boolean {
    return role === UserRole.RECEPCIONISTA;
  }

  /**
   * Verificar si tiene permisos de staff (cualquier rol autenticado)
   */
  static isStaff(role: UserRole): boolean {
    return Object.values(UserRole).includes(role);
  }

  /**
   * DEPRECATED: Usar canManageRole en su lugar
   */
  static hasPermission(role: UserRole, _permission: string): boolean {
    console.warn('hasPermission is deprecated, use canManageRole instead');
    return this.isAdmin(role);
  }

  /**
   * DEPRECATED: Usar canManageRole en su lugar
   */
  static hasAnyPermission(role: UserRole, _permissions: string[]): boolean {
    console.warn('hasAnyPermission is deprecated, use canManageRole instead');
    return this.isAdmin(role);
  }

  /**
   * DEPRECATED: Usar canManageRole en su lugar
   */
  static hasAllPermissions(role: UserRole, _permissions: string[]): boolean {
    console.warn('hasAllPermissions is deprecated, use canManageRole instead');
    return this.isAdmin(role);
  }
}
