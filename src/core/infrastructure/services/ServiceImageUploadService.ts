import { storage, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';

/**
 * Sube una imagen de servicio a Firebase Storage.
 * Retorna la URL pública de descarga.
 */
export async function uploadServiceImage(
  file: File | Blob,
  serviceId: string,
  fileName = 'main.jpg'
): Promise<string> {
  const storageRef = ref(storage, `services/${serviceId}/${fileName}`);
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || 'image/jpeg',
  });
  return getDownloadURL(snapshot.ref);
}

/**
 * Convierte un string base64 (data:image/...;base64,...) a Blob.
 */
function base64ToBlob(dataURL: string): Blob {
  const [header, data] = dataURL.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

export interface MigrationResult {
  total: number;
  migrated: number;
  skipped: number;
  errors: { id: string; name: string; error: string }[];
}

/**
 * Migra todas las imágenes base64 de Firestore a Firebase Storage.
 * Actualiza el campo imageURL de cada servicio con la URL real.
 *
 * Uso: llamar desde un botón de admin. Opera en el navegador del admin
 * (requiere estar autenticado con permisos de escritura en Storage).
 */
export async function migrateServiceImagesToStorage(
  onProgress?: (msg: string) => void
): Promise<MigrationResult> {
  const result: MigrationResult = { total: 0, migrated: 0, skipped: 0, errors: [] };

  const snap = await getDocs(collection(db, 'services'));
  const services = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));

  const toMigrate = services.filter(
    s => s.imageURL && typeof s.imageURL === 'string' && s.imageURL.startsWith('data:')
  );

  result.total = toMigrate.length;

  if (toMigrate.length === 0) {
    onProgress?.('No hay imágenes base64 para migrar.');
    return result;
  }

  for (const service of toMigrate) {
    onProgress?.(`Migrando "${service.name}"…`);
    try {
      const blob = base64ToBlob(service.imageURL);
      const ext = blob.type.includes('png') ? 'png' : 'jpg';
      const url = await uploadServiceImage(blob, service.id, `main.${ext}`);
      await updateDoc(doc(db, 'services', service.id), {
        imageURL: url,
        updatedAt: Timestamp.now(),
      });
      result.migrated++;
      onProgress?.(`✓ "${service.name}" migrado`);
    } catch (err: any) {
      result.errors.push({ id: service.id, name: service.name, error: err?.message ?? String(err) });
      onProgress?.(`✗ Error en "${service.name}": ${err?.message}`);
    }
  }

  const skippedServices = services.filter(
    s => !s.imageURL || !s.imageURL.startsWith('data:')
  );
  result.skipped = skippedServices.length;

  return result;
}
