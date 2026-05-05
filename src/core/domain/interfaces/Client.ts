import { Gender } from '../enums';

/**
 * Interfaz de Cliente
 */
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: Gender;
  address?: string;
  city?: string;
  country?: string;
  
  // Información médica
  medicalHistory?: string;
  allergies?: string[];
  medications?: string[];
  skinType?: string;
  previousTreatments?: string[];
  
  // Información de seguimiento
  createdAt: Date;
  updatedAt: Date;
  lastVisit?: Date;
  totalVisits: number;
  
  // Notas
  notes?: string;
  
  // Asignación
  preferredEsthetician?: string; // ID del esteticista preferido
  
  // Foto
  photoURL?: string;
}

/**
 * DTO para crear cliente
 */
export interface CreateClientDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: Gender;
  address?: string;
  city?: string;
  country?: string;
  medicalHistory?: string;
  allergies?: string[];
  medications?: string[];
  skinType?: string;
  notes?: string;
}

/**
 * DTO para actualizar cliente
 */
export interface UpdateClientDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  address?: string;
  city?: string;
  country?: string;
  medicalHistory?: string;
  allergies?: string[];
  medications?: string[];
  skinType?: string;
  previousTreatments?: string[];
  notes?: string;
  preferredEsthetician?: string;
  photoURL?: string;
}
