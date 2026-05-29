import { create } from 'zustand';
import { Client } from '@/core/domain/interfaces/Client';
import {
  CreateClientUseCase,
  GetClientByIdUseCase,
  ListClientsUseCase,
  SearchClientsUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
} from '@/core/application/use-cases/clients/ClientUseCases';

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchClients: () => Promise<void>;
  fetchClientById: (id: string) => Promise<void>;
  searchClients: (searchTerm: string) => Promise<void>;
  createClient: (data: any) => Promise<Client>;
  updateClient: (id: string, data: any) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  setSelectedClient: (client: Client | null) => void;
  clearError: () => void;
}

const createClientUseCase = new CreateClientUseCase();
const getClientByIdUseCase = new GetClientByIdUseCase();
const listClientsUseCase = new ListClientsUseCase();
const searchClientsUseCase = new SearchClientsUseCase();
const updateClientUseCase = new UpdateClientUseCase();
const deleteClientUseCase = new DeleteClientUseCase();

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,

  fetchClients: async () => {
    try {
      set({ isLoading: true, error: null });
      const clients = await listClientsUseCase.execute();
      set({ clients, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar clientes';
      set({ error: message, isLoading: false });
    }
  },

  fetchClientById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const client = await getClientByIdUseCase.execute(id);
      set({ selectedClient: client, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar cliente';
      set({ error: message, isLoading: false, selectedClient: null });
    }
  },

  searchClients: async (searchTerm: string) => {
    try {
      set({ isLoading: true, error: null });
      const clients = await searchClientsUseCase.execute(searchTerm);
      set({ clients, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al buscar clientes';
      set({ error: message, isLoading: false });
    }
  },

  createClient: async (data: any) => {
    try {
      set({ isLoading: true, error: null });
      const client = await createClientUseCase.execute(data);
      set((state) => ({
        clients: [client, ...state.clients],
        isLoading: false,
      }));
      return client;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear cliente';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateClient: async (id: string, data: any) => {
    try {
      set({ isLoading: true, error: null });
      await updateClientUseCase.execute(id, data);
      
      // Actualizar en la lista
      set((state) => ({
        clients: state.clients.map((c) =>
          c.id === id ? { ...c, ...data, updatedAt: new Date() } : c
        ),
        selectedClient:
          state.selectedClient?.id === id
            ? { ...state.selectedClient, ...data, updatedAt: new Date() }
            : state.selectedClient,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al actualizar cliente';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteClient: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await deleteClientUseCase.execute(id);
      
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al eliminar cliente';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  setSelectedClient: (client: Client | null) => {
    set({ selectedClient: client });
  },

  clearError: () => {
    set({ error: null });
  },
}));
