import { db } from '../firebase/config';
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
  serverTimestamp,
} from 'firebase/firestore';
import { UserRole } from '@/core/domain/enums/roles';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export class UserService {
  private usersCollection = collection(db, 'users');

  /**
   * Obtener todos los usuarios
   */
  async getAll(): Promise<User[]> {
    try {
      const q = query(this.usersCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate(),
        } as User;
      });
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  /**
   * Obtener usuario por ID
   */
  async getById(id: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate(),
        } as User;
      }

      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  /**
   * Crear usuario
   * Nota: Este método solo crea el documento en Firestore
   * La cuenta de Firebase Auth debe crearse primero
   */
  async create(userId: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Actualizar usuario
   */
  async update(id: string, updates: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Eliminar usuario
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Activar/Desactivar usuario
   */
  async toggleActive(id: string, isActive: boolean): Promise<void> {
    try {
      await this.update(id, { isActive });
    } catch (error) {
      console.error('Error toggling user active status:', error);
      throw error;
    }
  }

  /**
   * Obtener usuarios por rol
   */
  async getByRole(role: UserRole): Promise<User[]> {
    try {
      const q = query(this.usersCollection, where('role', '==', role));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate(),
        } as User;
      });
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
