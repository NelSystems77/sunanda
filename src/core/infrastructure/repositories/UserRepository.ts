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
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS } from '@/shared/constants';
import { User, CreateUserDTO, UpdateUserDTO } from '@/core/domain/interfaces/User';
import { UserRole } from '@/core/domain/enums/roles';

export class UserRepository {
  private collectionRef = collection(db, COLLECTIONS.USERS);

  /**
   * Crear usuario en Firestore
   */
  async create(userId: string, data: CreateUserDTO): Promise<User> {
    const now = new Date();
    const userData: User = {
      id: userId,
      email: data.email,
      displayName: data.displayName,
      role: data.role,
      phoneNumber: data.phoneNumber,
      specialties: data.specialties,
      bio: data.bio,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(this.collectionRef, userId), {
      ...userData,
      createdAt: Timestamp.fromDate(userData.createdAt),
      updatedAt: Timestamp.fromDate(userData.updatedAt),
    });

    return userData;
  }

  /**
   * Obtener usuario por ID
   */
  async getById(userId: string): Promise<User | null> {
    const docRef = doc(this.collectionRef, userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return this.mapDocToUser(docSnap.id, docSnap.data());
  }

  /**
   * Obtener usuario por email
   */
  async getByEmail(email: string): Promise<User | null> {
    const q = query(this.collectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return this.mapDocToUser(doc.id, doc.data());
  }

  /**
   * Obtener todos los usuarios
   */
  async getAll(): Promise<User[]> {
    const q = query(this.collectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => this.mapDocToUser(doc.id, doc.data()));
  }

  /**
   * Obtener usuarios por rol
   */
  async getByRole(role: UserRole): Promise<User[]> {
    const q = query(
      this.collectionRef,
      where('role', '==', role),
      orderBy('displayName', 'asc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => this.mapDocToUser(doc.id, doc.data()));
  }

  /**
   * Obtener usuarios activos
   */
  async getActive(): Promise<User[]> {
    const q = query(
      this.collectionRef,
      where('isActive', '==', true),
      orderBy('displayName', 'asc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => this.mapDocToUser(doc.id, doc.data()));
  }

  /**
   * Obtener esteticistas
   */
  async getEstheticians(): Promise<User[]> {
    return this.getByRole(UserRole.ESTETICISTA);
  }

  /**
   * Actualizar usuario
   */
  async update(userId: string, data: UpdateUserDTO): Promise<void> {
    const docRef = doc(this.collectionRef, userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Actualizar último login
   */
  async updateLastLogin(userId: string): Promise<void> {
    const docRef = doc(this.collectionRef, userId);
    await updateDoc(docRef, {
      lastLogin: Timestamp.now(),
    });
  }

  /**
   * Activar/Desactivar usuario
   */
  async setActive(userId: string, isActive: boolean): Promise<void> {
    const docRef = doc(this.collectionRef, userId);
    await updateDoc(docRef, {
      isActive,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Eliminar usuario
   */
  async delete(userId: string): Promise<void> {
    const docRef = doc(this.collectionRef, userId);
    await deleteDoc(docRef);
  }

  /**
   * Verificar si el email ya existe
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.getByEmail(email);
    return user !== null;
  }

  /**
   * Mapear documento de Firestore a User
   */
  private mapDocToUser(id: string, data: any): User {
    return {
      id,
      email: data.email,
      displayName: data.displayName,
      role: data.role as UserRole,
      photoURL: data.photoURL,
      phoneNumber: data.phoneNumber,
      isActive: data.isActive ?? true,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate(),
      specialties: data.specialties,
      bio: data.bio,
    };
  }
}
