import { Service, CreateServiceDTO, UpdateServiceDTO } from '@/core/domain/interfaces/Service';
import { ServiceCategory } from '@/core/domain/enums/serviceCategory';
import { ServiceRepository } from '@/core/infrastructure/repositories/ServiceRepository';
import { 
  createServiceSchema,
  updateServiceSchema
} from '@/core/application/validations/ServiceValidations';

/**
 * Casos de Uso de Servicios
 */
export class ServiceUseCases {
  private repository: ServiceRepository;

  constructor() {
    this.repository = new ServiceRepository();
  }

  async createService(data: CreateServiceDTO): Promise<string> {
    const validated = createServiceSchema.parse(data);
    return await this.repository.create(validated);
  }

  async getServiceById(id: string): Promise<Service | null> {
    return await this.repository.getById(id);
  }

  async getAllServices(): Promise<Service[]> {
    return await this.repository.getAll();
  }

  async getActiveServices(): Promise<Service[]> {
    return await this.repository.getActive();
  }

  async getServicesByCategory(category: ServiceCategory): Promise<Service[]> {
    return await this.repository.getByCategory(category);
  }

  async getServicesWithPromotions(): Promise<Service[]> {
    return await this.repository.getWithPromotions();
  }

  async searchServices(searchTerm: string): Promise<Service[]> {
    return await this.repository.searchByName(searchTerm);
  }

  async updateService(id: string, data: UpdateServiceDTO): Promise<void> {
    const validated = updateServiceSchema.parse(data);
    await this.repository.update(id, validated);
  }

  async activateService(id: string): Promise<void> {
    await this.repository.activate(id);
  }

  async deactivateService(id: string): Promise<void> {
    await this.repository.deactivate(id);
  }

  async deleteService(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getServiceStats() {
    return await this.repository.getStats();
  }

  /**
   * Calcular precio con promoción
   */
  calculatePromotionPrice(service: Service): number {
    if (!service.hasPromotion || !service.promotionType) {
      return service.priceCRC;
    }

    switch (service.promotionType) {
      case 'percentage':
        const discount = (service.priceCRC * (service.promotionValue || 0)) / 100;
        return service.priceCRC - discount;
      
      case '2x1':
        return service.priceCRC; // El precio se mantiene, se duplican sesiones
      
      case 'fixed':
        return service.promotionValue || service.priceCRC;
      
      default:
        return service.priceCRC;
    }
  }
}
