import { db, storage } from '../firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MedicalRecord, Anamnesis, Consentimiento, SessionRecord } from '@/core/domain/interfaces/MedicalRecord';
import imageCompression from 'browser-image-compression';

export class MedicalRecordService {
  private recordsCollection = collection(db, 'medicalRecords');

  /**
   * Obtener expediente de un cliente
   */
  async getByClientId(clientId: string): Promise<MedicalRecord | null> {
    try {
      const docRef = doc(db, 'medicalRecords', clientId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          sesiones: data.sesiones?.map((s: any) => ({
            ...s,
            fecha: s.fecha?.toDate(),
            proximaSesion: s.proximaSesion?.toDate(),
            createdAt: s.createdAt?.toDate(),
            updatedAt: s.updatedAt?.toDate(),
          })) || [],
        } as MedicalRecord;
      }

      return null;
    } catch (error) {
      console.error('Error getting medical record:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los expedientes
   */
  async getAll(): Promise<MedicalRecord[]> {
    try {
      const q = query(this.recordsCollection, orderBy('updatedAt', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          sesiones: data.sesiones?.map((s: any) => ({
            ...s,
            fecha: s.fecha?.toDate(),
            proximaSesion: s.proximaSesion?.toDate(),
            createdAt: s.createdAt?.toDate(),
            updatedAt: s.updatedAt?.toDate(),
          })) || [],
        } as MedicalRecord;
      });
    } catch (error) {
      console.error('Error getting all medical records:', error);
      throw error;
    }
  }

  /**
   * Crear expediente nuevo
   */
  async create(clientId: string, clientName: string): Promise<MedicalRecord> {
    try {
      const newRecord: MedicalRecord = {
        id: clientId,
        clientId,
        clientName,
        sesiones: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'medicalRecords', clientId), {
        ...newRecord,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return newRecord;
    } catch (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
  }

  /**
   * Guardar anamnesis
   */
  async saveAnamnesis(clientId: string, anamnesis: Anamnesis): Promise<void> {
    try {
      await updateDoc(doc(db, 'medicalRecords', clientId), {
        anamnesis,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving anamnesis:', error);
      throw error;
    }
  }

  /**
   * Guardar consentimiento
   */
  async saveConsentimiento(clientId: string, consentimiento: Consentimiento): Promise<void> {
    try {
      await updateDoc(doc(db, 'medicalRecords', clientId), {
        consentimiento: {
          ...consentimiento,
          fecha: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving consentimiento:', error);
      throw error;
    }
  }

  /**
   * Agregar sesión
   */
  async addSession(clientId: string, session: Omit<SessionRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const record = await this.getByClientId(clientId);
      if (!record) throw new Error('Expediente no encontrado');

      const newSession: SessionRecord = {
        ...session,
        id: `session_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const sesiones = [...(record.sesiones || []), newSession];

      await updateDoc(doc(db, 'medicalRecords', clientId), {
        sesiones,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  }

  /**
   * Actualizar sesión existente
   */
  async updateSession(clientId: string, sessionId: string, updates: Partial<SessionRecord>): Promise<void> {
    try {
      const record = await this.getByClientId(clientId);
      if (!record) throw new Error('Expediente no encontrado');

      const sesiones = record.sesiones.map(s => 
        s.id === sessionId 
          ? { ...s, ...updates, updatedAt: new Date() }
          : s
      );

      await updateDoc(doc(db, 'medicalRecords', clientId), {
        sesiones,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  /**
   * Eliminar sesión
   */
  async deleteSession(clientId: string, sessionId: string): Promise<void> {
    try {
      const record = await this.getByClientId(clientId);
      if (!record) throw new Error('Expediente no encontrado');

      const sesiones = record.sesiones.filter(s => s.id !== sessionId);

      await updateDoc(doc(db, 'medicalRecords', clientId), {
        sesiones,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  /**
   * Actualizar nombre del cliente en el expediente
   */
  async updateClientName(clientId: string, newName: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'medicalRecords', clientId), {
        clientName: newName,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating client name:', error);
      throw error;
    }
  }

  /**
   * Eliminar expediente completo
   */
  async deleteRecord(clientId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'medicalRecords', clientId));
    } catch (error) {
      console.error('Error deleting medical record:', error);
      throw error;
    }
  }

  /**
   * Subir imagen con compresión
   */
  async uploadImage(file: File, clientId: string, sessionId: string, type: 'antes' | 'despues'): Promise<string> {
    try {
      // Configuración de compresión
      const options = {
        maxSizeMB: 0.5, // Máximo 500KB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg',
      };

      // Comprimir imagen
      const compressedFile = await imageCompression(file, options);

      // Subir a Firebase Storage
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const storageRef = ref(storage, `expedientes/${clientId}/${sessionId}/${type}/${fileName}`);
      
      await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(storageRef);

      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Subir firma digital
   */
  async uploadSignature(dataUrl: string, clientId: string): Promise<string> {
    try {
      // Convertir dataURL a Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Subir a Firebase Storage
      const fileName = `firma_${Date.now()}.png`;
      const storageRef = ref(storage, `expedientes/${clientId}/firmas/${fileName}`);
      
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      return url;
    } catch (error) {
      console.error('Error uploading signature:', error);
      throw error;
    }
  }
}

export const medicalRecordService = new MedicalRecordService();
