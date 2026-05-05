import { UserRole } from '../enums/roles';

/**
 * Interfaz de Usuario del sistema
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  
  // Información adicional para esteticistas
  specialties?: string[];
  bio?: string;
}

/**
 * DTO para crear usuario
 */
export interface CreateUserDTO {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  specialties?: string[];
  bio?: string;
}

/**
 * DTO para actualizar usuario
 */
export interface UpdateUserDTO {
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  specialties?: string[];
  bio?: string;
  isActive?: boolean;
}
