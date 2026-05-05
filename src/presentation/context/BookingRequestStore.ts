/**
 * BookingRequestStore
 * 
 * Estado global para solicitudes de citas
 * Usado tanto por clientes (crear) como admin (gestionar)
 */

import { create } from 'zustand';
import { BookingRequest, BookingRequestStatus } from '../../core/domain/interfaces/BookingRequest';

interface BookingRequestState {
  // Estado
  requests: BookingRequest[];
  selectedRequest: BookingRequest | null;
  loading: boolean;
  error: string | null;

  // Filtros
  statusFilter: BookingRequestStatus | 'all';
  searchQuery: string;

  // Estadísticas
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    rejected: number;
  };

  // Acciones - UI
  setRequests: (requests: BookingRequest[]) => void;
  setSelectedRequest: (request: BookingRequest | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStatusFilter: (status: BookingRequestStatus | 'all') => void;
  setSearchQuery: (query: string) => void;

  // Acciones - CRUD
  addRequest: (request: BookingRequest) => void;
  updateRequest: (id: string, updates: Partial<BookingRequest>) => void;
  removeRequest: (id: string) => void;

  // Utilidades
  calculateStats: () => void;
  getFilteredRequests: () => BookingRequest[];
  reset: () => void;
}

const initialState = {
  requests: [],
  selectedRequest: null,
  loading: false,
  error: null,
  statusFilter: 'all' as const,
  searchQuery: '',
  stats: {
    total: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
  },
};

export const useBookingRequestStore = create<BookingRequestState>((set, get) => ({
  ...initialState,

  // UI Actions
  setRequests: (requests) => {
    set({ requests });
    get().calculateStats();
  },

  setSelectedRequest: (request) => set({ selectedRequest: request }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setStatusFilter: (statusFilter) => set({ statusFilter }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  // CRUD Actions
  addRequest: (request) => {
    set((state) => ({
      requests: [request, ...state.requests],
    }));
    get().calculateStats();
  },

  updateRequest: (id, updates) => {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id ? { ...req, ...updates } : req
      ),
    }));
    get().calculateStats();
  },

  removeRequest: (id) => {
    set((state) => ({
      requests: state.requests.filter((req) => req.id !== id),
    }));
    get().calculateStats();
  },

  // Utilidades
  calculateStats: () => {
    const { requests } = get();
    set({
      stats: {
        total: requests.length,
        pending: requests.filter((r) => r.status === BookingRequestStatus.PENDING).length,
        confirmed: requests.filter((r) => r.status === BookingRequestStatus.CONFIRMED).length,
        rejected: requests.filter((r) => r.status === BookingRequestStatus.REJECTED).length,
      },
    });
  },

  getFilteredRequests: () => {
    const { requests, statusFilter, searchQuery } = get();

    let filtered = requests;

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.clientName.toLowerCase().includes(query) ||
          req.clientEmail.toLowerCase().includes(query) ||
          req.clientPhone.includes(query) ||
          req.serviceName.toLowerCase().includes(query)
      );
    }

    return filtered;
  },

  reset: () => set(initialState),
}));
