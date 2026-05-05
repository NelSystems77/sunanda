/**
 * Roles de usuario en el sistema SUNANDA
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  ESTETICISTA = 'ESTETICISTA',
  RECEPCIONISTA = 'RECEPCIONISTA'
}

/**
 * Jerarquía de permisos:
 * 
 * SUPER_ADMIN (único)
 *  ├─ Puede gestionar: ADMIN, ESTETICISTA, RECEPCIONISTA
 *  └─ Control total del sistema
 * 
 * ADMIN (múltiples)
 *  ├─ Puede gestionar: ESTETICISTA, RECEPCIONISTA
 *  └─ NO puede gestionar: SUPER_ADMIN, otros ADMIN
 * 
 * ESTETICISTA
 *  └─ Solo su agenda y expedientes
 * 
 * RECEPCIONISTA
 *  └─ Solo agenda y clientes
 */

/**
 * Verificar si un rol puede gestionar otro rol
 */
export function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  // SUPER_ADMIN puede gestionar cualquier rol
  if (managerRole === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // ADMIN puede gestionar ESTETICISTA y RECEPCIONISTA
  if (managerRole === UserRole.ADMIN) {
    return targetRole === UserRole.ESTETICISTA || targetRole === UserRole.RECEPCIONISTA;
  }
  
  // Otros roles no pueden gestionar a nadie
  return false;
}

/**
 * Obtener roles que un usuario puede crear
 */
export function getManageableRoles(userRole: UserRole): UserRole[] {
  if (userRole === UserRole.SUPER_ADMIN) {
    return [UserRole.ADMIN, UserRole.ESTETICISTA, UserRole.RECEPCIONISTA];
  }
  
  if (userRole === UserRole.ADMIN) {
    return [UserRole.ESTETICISTA, UserRole.RECEPCIONISTA];
  }
  
  return [];
}

/**
 * Obtener label en español del rol
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'Super Administrador',
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.ESTETICISTA]: 'Esteticista',
    [UserRole.RECEPCIONISTA]: 'Recepcionista'
  };
  
  return labels[role];
}

/**
 * Obtener color del rol (para badges)
 */
export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    [UserRole.ADMIN]: 'bg-gold-500/20 text-gold-300 border-gold-500/30',
    [UserRole.ESTETICISTA]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    [UserRole.RECEPCIONISTA]: 'bg-green-500/20 text-green-300 border-green-500/30'
  };
  
  return colors[role];
}
