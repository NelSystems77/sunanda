import { clientRepository } from '@/core/infrastructure/repositories/ClientRepository';
import { medicalRecordService } from '@/core/infrastructure/services/MedicalRecordService';
import { Client } from '@/core/domain/interfaces/Client';
import { Gender } from '@/core/domain/enums';

export interface ConsolidationResult {
  client: Client;
  clientCreated: boolean;
  recordCreated: boolean;
}

/**
 * Asegura que un cliente y su expediente existan en Firestore, dado su número de cédula.
 *
 * - Si la cédula NO existe → crea el cliente y el expediente médico vacío.
 * - Si la cédula YA existe → incrementa totalVisits y actualiza lastVisit.
 *
 * Siempre retorna el cliente consolidado (nuevo o existente).
 */
export async function ensureClientExists(
  cedula: string,
  fullName: string,
  phoneNumber: string,
  email = '',
  gender: Gender = Gender.FEMALE
): Promise<ConsolidationResult> {
  const existing = await clientRepository.getById(cedula);

  if (existing) {
    await clientRepository.incrementVisits(cedula);
    return { client: existing, clientCreated: false, recordCreated: false };
  }

  // Separar nombre en firstName / lastName de forma simple
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || 'Sin nombre';
  const lastName = parts.slice(1).join(' ') || 'Sin apellido';

  const newClient = await clientRepository.create({
    cedula,
    firstName,
    lastName,
    email,
    phoneNumber,
    dateOfBirth: new Date('2000-01-01'), // se completa en el expediente
    gender,
  });

  // Crear expediente médico vacío listo para la atención
  let recordCreated = false;
  try {
    await medicalRecordService.create(cedula, fullName);
    recordCreated = true;
  } catch {
    // No bloquear el flujo si el expediente ya existe o falla
  }

  return { client: newClient, clientCreated: true, recordCreated };
}
