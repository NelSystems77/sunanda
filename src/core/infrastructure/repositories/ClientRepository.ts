import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS } from '@/shared/constants';
import { Client, CreateClientDTO, UpdateClientDTO } from '@/core/domain/interfaces/Client';
import { generateId } from '@/shared/utils';

export interface ClientFilters {
  search?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
}

export interface PaginationOptions {
  pageSize?: number;
  lastDoc?: DocumentSnapshot;
}

export class ClientRepository {
  private collectionRef = collection(db, COLLECTIONS.CLIENTS);

  /**
   * Crear cliente
   */
  async create(data: CreateClientDTO): Promise<Client> {
    const id = generateId();
    const now = new Date();

    const client: Client = {
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      city: data.city,
      country: data.country || 'Costa Rica',
      medicalHistory: data.medicalHistory,
      allergies: data.allergies || [],
      medications: data.medications || [],
      skinType: data.skinType,
      previousTreatments: [],
      createdAt: now,
      updatedAt: now,
      totalVisits: 0,
      notes: data.notes,
    };

    await setDoc(doc(this.collectionRef, id), {
      ...client,
      dateOfBirth: Timestamp.fromDate(client.dateOfBirth),
      createdAt: Timestamp.fromDate(client.createdAt),
      updatedAt: Timestamp.fromDate(client.updatedAt),
    });

    return client;
  }

  /**
   * Obtener cliente por ID
   */
  async getById(id: string): Promise<Client | null> {
    const docRef = doc(this.collectionRef, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return this.mapDocToClient(docSnap.id, docSnap.data());
  }

  /**
   * Obtener todos los clientes
   */
  async getAll(options?: PaginationOptions): Promise<Client[]> {
    const pageSize = options?.pageSize || 50;
    let q = query(this.collectionRef, orderBy('createdAt', 'desc'), limit(pageSize));

    if (options?.lastDoc) {
      q = query(q, startAfter(options.lastDoc));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => this.mapDocToClient(doc.id, doc.data()));
  }

  /**
   * Buscar clientes
   */
  async search(searchTerm: string): Promise<Client[]> {
    const allClients = await this.getAll();

    const term = searchTerm.toLowerCase();
    return allClients.filter((client) => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      const email = client.email.toLowerCase();
      const phone = client.phoneNumber.toLowerCase();

      return (
        fullName.includes(term) ||
        email.includes(term) ||
        phone.includes(term)
      );
    });
  }

  /**
   * Filtrar clientes
   */
  async filter(filters: ClientFilters): Promise<Client[]> {
    let clients = await this.getAll();

    if (filters.search) {
      const term = filters.search.toLowerCase();
      clients = clients.filter((client) => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        return fullName.includes(term) || client.email.toLowerCase().includes(term);
      });
    }

    if (filters.gender) {
      clients = clients.filter((client) => client.gender === filters.gender);
    }

    if (filters.minAge !== undefined || filters.maxAge !== undefined) {
      clients = clients.filter((client) => {
        const age = this.calculateAge(client.dateOfBirth);
        if (filters.minAge !== undefined && age < filters.minAge) return false;
        if (filters.maxAge !== undefined && age > filters.maxAge) return false;
        return true;
      });
    }

    return clients;
  }

  /**
   * Obtener clientes recientes
   */
  async getRecent(limitCount = 10): Promise<Client[]> {
    const q = query(this.collectionRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => this.mapDocToClient(doc.id, doc.data()));
  }

  /**
   * Obtener clientes por esteticista preferido
   */
  async getByPreferredEsthetician(estheticianId: string): Promise<Client[]> {
    const q = query(
      this.collectionRef,
      where('preferredEsthetician', '==', estheticianId),
      orderBy('lastName', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => this.mapDocToClient(doc.id, doc.data()));
  }

  /**
   * Actualizar cliente
   */
  async update(id: string, data: UpdateClientDTO): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    const updateData: any = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    if (data.dateOfBirth) {
      updateData.dateOfBirth = Timestamp.fromDate(data.dateOfBirth);
    }

    await updateDoc(docRef, updateData);
  }

  /**
   * Actualizar foto del cliente
   */
  async updatePhoto(id: string, photoURL: string): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await updateDoc(docRef, {
      photoURL,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Incrementar visitas del cliente
   */
  async incrementVisits(id: string): Promise<void> {
    const client = await this.getById(id);
    if (!client) return;

    const docRef = doc(this.collectionRef, id);
    await updateDoc(docRef, {
      totalVisits: client.totalVisits + 1,
      lastVisit: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Agregar tratamiento al historial
   */
  async addTreatment(id: string, treatment: string): Promise<void> {
    const client = await this.getById(id);
    if (!client) return;

    const docRef = doc(this.collectionRef, id);
    const previousTreatments = client.previousTreatments || [];
    
    if (!previousTreatments.includes(treatment)) {
      await updateDoc(docRef, {
        previousTreatments: [...previousTreatments, treatment],
        updatedAt: Timestamp.now(),
      });
    }
  }

  /**
   * Eliminar cliente
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
  }

  /**
   * Verificar si el email ya existe
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const q = query(this.collectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return false;

    // Si estamos actualizando, excluir el cliente actual
    if (excludeId) {
      return querySnapshot.docs.some((doc) => doc.id !== excludeId);
    }

    return true;
  }

  /**
   * Obtener estadísticas de clientes
   */
  async getStats() {
    const clients = await this.getAll();

    return {
      total: clients.length,
      active: clients.filter((c) => c.totalVisits > 0).length,
      new: clients.filter((c) => {
        const daysSinceCreated =
          (new Date().getTime() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceCreated <= 30;
      }).length,
      byGender: {
        male: clients.filter((c) => c.gender === 'MALE').length,
        female: clients.filter((c) => c.gender === 'FEMALE').length,
        other: clients.filter((c) => c.gender === 'OTHER').length,
      },
    };
  }

  /**
   * Calcular edad
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Mapear documento de Firestore a Client
   */
  private mapDocToClient(id: string, data: any): Client {
    return {
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth?.toDate() || new Date(),
      gender: data.gender,
      address: data.address,
      city: data.city,
      country: data.country,
      medicalHistory: data.medicalHistory,
      allergies: data.allergies || [],
      medications: data.medications || [],
      skinType: data.skinType,
      previousTreatments: data.previousTreatments || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastVisit: data.lastVisit?.toDate(),
      totalVisits: data.totalVisits || 0,
      notes: data.notes,
      preferredEsthetician: data.preferredEsthetician,
      photoURL: data.photoURL,
    };
  }
}
// Exportar instancia singleton
export const clientRepository = new ClientRepository();
