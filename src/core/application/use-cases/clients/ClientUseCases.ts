import { ClientRepository } from '@/core/infrastructure/repositories/ClientRepository';
import { Client, CreateClientDTO, UpdateClientDTO } from '@/core/domain/interfaces/Client';

/**
 * Caso de uso: Crear Cliente
 */
export class CreateClientUseCase {
  private repository = new ClientRepository();

  async execute(data: CreateClientDTO): Promise<Client> {
    // Validar que el email no exista
    const emailExists = await this.repository.emailExists(data.email);
    if (emailExists) {
      throw new Error('Ya existe un cliente con este correo electrónico');
    }

    // Crear cliente
    return await this.repository.create(data);
  }
}

/**
 * Caso de uso: Obtener Cliente por ID
 */
export class GetClientByIdUseCase {
  private repository = new ClientRepository();

  async execute(id: string): Promise<Client> {
    const client = await this.repository.getById(id);
    
    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    return client;
  }
}

/**
 * Caso de uso: Listar Clientes
 */
export class ListClientsUseCase {
  private repository = new ClientRepository();

  async execute(): Promise<Client[]> {
    return await this.repository.getAll();
  }
}

/**
 * Caso de uso: Buscar Clientes
 */
export class SearchClientsUseCase {
  private repository = new ClientRepository();

  async execute(searchTerm: string): Promise<Client[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }

    return await this.repository.search(searchTerm);
  }
}

/**
 * Caso de uso: Actualizar Cliente
 */
export class UpdateClientUseCase {
  private repository = new ClientRepository();

  async execute(id: string, data: UpdateClientDTO): Promise<void> {
    // Verificar que el cliente existe
    const client = await this.repository.getById(id);
    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    // Si se está actualizando el email, verificar que no exista
    if (data.email && data.email !== client.email) {
      const emailExists = await this.repository.emailExists(data.email, id);
      if (emailExists) {
        throw new Error('Ya existe un cliente con este correo electrónico');
      }
    }

    // Actualizar cliente
    await this.repository.update(id, data);
  }
}

/**
 * Caso de uso: Eliminar Cliente
 */
export class DeleteClientUseCase {
  private repository = new ClientRepository();

  async execute(id: string): Promise<void> {
    // Verificar que el cliente existe
    const client = await this.repository.getById(id);
    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    // TODO: Verificar que no tenga citas pendientes
    // TODO: Verificar que no tenga pagos pendientes

    // Eliminar cliente
    await this.repository.delete(id);
  }
}

/**
 * Caso de uso: Obtener Estadísticas de Clientes
 */
export class GetClientStatsUseCase {
  private repository = new ClientRepository();

  async execute() {
    return await this.repository.getStats();
  }
}
