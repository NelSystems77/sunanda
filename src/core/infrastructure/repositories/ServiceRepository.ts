import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Service, CreateServiceDTO, UpdateServiceDTO } from '@/core/domain/interfaces/Service';
import { ServiceCategory } from '../../domain/enums/serviceCategory';

/**
 * Tipo de cambio CRC a USD
 * En producción esto debería venir de una API o configuración
 */
const EXCHANGE_RATE = 510; // Colones por dólar

/**
 * Repositorio de Servicios
 * Maneja la persistencia en Firestore
 */
export class ServiceRepository {
  private collectionName = 'services';

  /**
   * Calcular precio en USD
   */
  private calculateUSD(priceCRC: number): number {
    return Math.round(priceCRC / EXCHANGE_RATE);
  }

  /**
   * Crear nuevo servicio
   */
  async create(data: CreateServiceDTO): Promise<string> {
    try {
      const serviceData = {
        ...data,
        priceCRC: data.priceCRC,
        priceUSD: this.calculateUSD(data.priceCRC),
        sessions: data.sessions || 1,
        hasPromotion: data.hasPromotion || false,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // Convertir fecha de promoción si existe
      if (data.promotionValidUntil) {
        (serviceData as any).promotionValidUntil = Timestamp.fromDate(data.promotionValidUntil);
      }

      const docRef = await addDoc(collection(db, this.collectionName), serviceData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating service:', error);
      throw new Error('No se pudo crear el servicio');
    }
  }

  /**
   * Obtener servicio por ID
   */
  async getById(id: string): Promise<Service | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return this.mapDocToService(docSnap.id, docSnap.data());
    } catch (error) {
      console.error('Error getting service:', error);
      throw new Error('No se pudo obtener el servicio');
    }
  }

  /**
   * Obtener todos los servicios
   */
  async getAll(): Promise<Service[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => 
        this.mapDocToService(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting services:', error);
      throw new Error('No se pudieron obtener los servicios');
    }
  }

  /**
   * Obtener servicios activos
   */
  async getActive(): Promise<Service[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => 
        this.mapDocToService(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting active services:', error);
      throw new Error('No se pudieron obtener los servicios activos');
    }
  }

  /**
   * Obtener servicios por categoría
   */
  async getByCategory(category: ServiceCategory): Promise<Service[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => 
        this.mapDocToService(doc.id, doc.data())
      );
    } catch (error) {
      console.error('Error getting services by category:', error);
      throw new Error('No se pudieron obtener los servicios de la categoría');
    }
  }

  /**
   * Obtener servicios con promoción activa
   */
  async getWithPromotions(): Promise<Service[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('hasPromotion', '==', true),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);

      const services = querySnapshot.docs.map(doc => 
        this.mapDocToService(doc.id, doc.data())
      );

      // Filtrar por fecha de validez de promoción
      const now = new Date();
      return services.filter(service => {
        if (!service.promotionValidUntil) return true;
        return service.promotionValidUntil > now;
      });
    } catch (error) {
      console.error('Error getting services with promotions:', error);
      throw new Error('No se pudieron obtener los servicios en promoción');
    }
  }

  /**
   * Buscar servicios por nombre
   */
  async searchByName(searchTerm: string): Promise<Service[]> {
    try {
      const allServices = await this.getActive();
      
      const searchLower = searchTerm.toLowerCase();
      return allServices.filter(service =>
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching services:', error);
      throw new Error('No se pudo realizar la búsqueda');
    }
  }

  /**
   * Actualizar servicio
   */
  async update(id: string, data: UpdateServiceDTO): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData: any = {
        ...data,
        updatedAt: Timestamp.now()
      };

      // Recalcular USD si cambia el precio CRC
      if (data.priceCRC) {
        updateData.priceUSD = this.calculateUSD(data.priceCRC);
      }

      // Convertir fecha de promoción si existe
      if (data.promotionValidUntil) {
        updateData.promotionValidUntil = Timestamp.fromDate(data.promotionValidUntil);
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating service:', error);
      throw new Error('No se pudo actualizar el servicio');
    }
  }

  /**
   * Activar servicio
   */
  async activate(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        isActive: true,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error activating service:', error);
      throw new Error('No se pudo activar el servicio');
    }
  }

  /**
   * Desactivar servicio
   */
  async deactivate(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error deactivating service:', error);
      throw new Error('No se pudo desactivar el servicio');
    }
  }

  /**
   * Eliminar servicio
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting service:', error);
      throw new Error('No se pudo eliminar el servicio');
    }
  }

  /**
   * Obtener estadísticas de servicios
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byCategory: Record<ServiceCategory, number>;
    withPromotions: number;
  }> {
    try {
      const allServices = await this.getAll();

      const stats = {
        total: allServices.length,
        active: allServices.filter(s => s.isActive).length,
        inactive: allServices.filter(s => !s.isActive).length,
        byCategory: {
          [ServiceCategory.FACIAL]: 0,
          [ServiceCategory.CORPORAL]: 0,
          [ServiceCategory.PAQUETE]: 0
        },
        withPromotions: 0
      };

      allServices.forEach(service => {
        stats.byCategory[service.category]++;
        if (service.hasPromotion) {
          stats.withPromotions++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting service stats:', error);
      throw new Error('No se pudieron obtener las estadísticas');
    }
  }

  /**
   * Mapear documento de Firestore a Service
   */
  private mapDocToService(id: string, data: DocumentData): Service {
    return {
      id,
      name: data.name,
      description: data.description,
      category: data.category,
      priceCRC: data.priceCRC,
      priceUSD: data.priceUSD,
      duration: data.duration,
      sessions: data.sessions || 1,
      hasPromotion: data.hasPromotion || false,
      promotionType: data.promotionType,
      promotionValue: data.promotionValue,
      promotionDescription: data.promotionDescription,
      promotionValidUntil: data.promotionValidUntil?.toDate(),
      benefits: data.benefits || [],
      contraindications: data.contraindications || [],
      recommendedFrequency: data.recommendedFrequency,
      brand: data.brand,
      productsUsed: data.productsUsed || [],
      isActive: data.isActive !== undefined ? data.isActive : true,
      imageURL: data.imageURL,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    };
  }
}
// Exportar instancia singleton para uso directo
export const serviceRepository = new ServiceRepository();