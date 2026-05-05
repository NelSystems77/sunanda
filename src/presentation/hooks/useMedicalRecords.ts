import { useState, useEffect } from 'react';
import { MedicalRecord, Anamnesis, Consentimiento, SessionRecord } from '@/core/domain/interfaces/MedicalRecord';
import { medicalRecordService } from '@/core/infrastructure/services/MedicalRecordService';
import toast from 'react-hot-toast';

export const useMedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar todos los expedientes
   */
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await medicalRecordService.getAll();
      setRecords(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar expedientes';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener expediente por cliente
   */
  const getByClientId = async (clientId: string): Promise<MedicalRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      const record = await medicalRecordService.getByClientId(clientId);
      return record;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar expediente';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear expediente nuevo
   */
  const create = async (clientId: string, clientName: string): Promise<MedicalRecord | null> => {
    setLoading(true);
    setError(null);
    try {
      const newRecord = await medicalRecordService.create(clientId, clientName);
      setRecords(prev => [newRecord, ...prev]);
      toast.success('Expediente creado correctamente');
      return newRecord;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear expediente';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar anamnesis
   */
  const saveAnamnesis = async (clientId: string, anamnesis: Anamnesis): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await medicalRecordService.saveAnamnesis(clientId, anamnesis);
      toast.success('Anamnesis guardada correctamente');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar anamnesis';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar consentimiento
   */
  const saveConsentimiento = async (clientId: string, consentimiento: Consentimiento): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await medicalRecordService.saveConsentimiento(clientId, consentimiento);
      toast.success('Consentimiento guardado correctamente');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar consentimiento';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agregar sesión
   */
  const addSession = async (
    clientId: string,
    session: Omit<SessionRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await medicalRecordService.addSession(clientId, session);
      toast.success('Sesión registrada correctamente');
      await fetchAll(); // Recargar expedientes
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar sesión';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar sesión
   */
  const updateSession = async (
    clientId: string,
    sessionId: string,
    updates: Partial<SessionRecord>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await medicalRecordService.updateSession(clientId, sessionId, updates);
      toast.success('Sesión actualizada correctamente');
      await fetchAll();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar sesión';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar sesión
   */
  const deleteSession = async (clientId: string, sessionId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await medicalRecordService.deleteSession(clientId, sessionId);
      toast.success('Sesión eliminada correctamente');
      await fetchAll();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar sesión';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Subir imagen
   */
  const uploadImage = async (
    file: File,
    clientId: string,
    sessionId: string,
    type: 'antes' | 'despues'
  ): Promise<string | null> => {
    try {
      const url = await medicalRecordService.uploadImage(file, clientId, sessionId, type);
      return url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir imagen';
      toast.error(message);
      return null;
    }
  };

  /**
   * Subir firma
   */
  const uploadSignature = async (dataUrl: string, clientId: string): Promise<string | null> => {
    try {
      const url = await medicalRecordService.uploadSignature(dataUrl, clientId);
      return url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar firma';
      toast.error(message);
      return null;
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    records,
    loading,
    error,
    fetchAll,
    getByClientId,
    create,
    saveAnamnesis,
    saveConsentimiento,
    addSession,
    updateSession,
    deleteSession,
    uploadImage,
    uploadSignature,
  };
};
