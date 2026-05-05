/**
 * PaymentStore
 * 
 * Estado global para pagos
 * Zustand con persist
 */

import { create } from 'zustand';
import { Payment, PaymentStatus, PaymentMethod, PaymentStats } from '../../core/domain/interfaces/Payment';

interface PaymentState {
  // Estado
  payments: Payment[];
  selectedPayment: Payment | null;
  loading: boolean;
  error: string | null;

  // Filtros
  statusFilter: PaymentStatus | 'all';
  methodFilter: PaymentMethod | 'all';
  searchQuery: string;

  // Estadísticas
  stats: PaymentStats;

  // Acciones - UI
  setPayments: (payments: Payment[]) => void;
  setSelectedPayment: (payment: Payment | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStatusFilter: (status: PaymentStatus | 'all') => void;
  setMethodFilter: (method: PaymentMethod | 'all') => void;
  setSearchQuery: (query: string) => void;

  // Acciones - CRUD
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  removePayment: (id: string) => void;

  // Utilidades
  calculateStats: () => void;
  getFilteredPayments: () => Payment[];
  reset: () => void;
}

const initialState = {
  payments: [],
  selectedPayment: null,
  loading: false,
  error: null,
  statusFilter: 'all' as const,
  methodFilter: 'all' as const,
  searchQuery: '',
  stats: {
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    refunded: 0,
    totalAmountCRC: 0,
    totalAmountUSD: 0,
    byMethod: {
      stripe: 0,
      sinpe: 0,
      cash: 0,
    },
  },
};

export const usePaymentStore = create<PaymentState>((set, get) => ({
  ...initialState,

  // UI Actions
  setPayments: (payments) => {
    set({ payments });
    get().calculateStats();
  },

  setSelectedPayment: (payment) => set({ selectedPayment: payment }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setStatusFilter: (statusFilter) => set({ statusFilter }),

  setMethodFilter: (methodFilter) => set({ methodFilter }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  // CRUD Actions
  addPayment: (payment) => {
    set((state) => ({
      payments: [payment, ...state.payments],
    }));
    get().calculateStats();
  },

  updatePayment: (id, updates) => {
    set((state) => ({
      payments: state.payments.map((payment) =>
        payment.id === id ? { ...payment, ...updates } : payment
      ),
    }));
    get().calculateStats();
  },

  removePayment: (id) => {
    set((state) => ({
      payments: state.payments.filter((payment) => payment.id !== id),
    }));
    get().calculateStats();
  },

  // Utilidades
  calculateStats: () => {
    const { payments } = get();
    
    const stats: PaymentStats = {
      total: payments.length,
      pending: 0,
      completed: 0,
      failed: 0,
      refunded: 0,
      totalAmountCRC: 0,
      totalAmountUSD: 0,
      byMethod: {
        stripe: 0,
        sinpe: 0,
        cash: 0,
      },
    };

    payments.forEach(payment => {
      // Contar por estado
      switch (payment.status) {
        case PaymentStatus.PENDING:
        case PaymentStatus.PROCESSING:
          stats.pending++;
          break;
        case PaymentStatus.COMPLETED:
          stats.completed++;
          stats.totalAmountCRC += payment.amountCRC;
          stats.totalAmountUSD += payment.amountUSD;
          break;
        case PaymentStatus.FAILED:
          stats.failed++;
          break;
        case PaymentStatus.REFUNDED:
          stats.refunded++;
          break;
      }

      // Contar por método (solo completados)
      if (payment.status === PaymentStatus.COMPLETED) {
        switch (payment.paymentMethod) {
          case PaymentMethod.STRIPE_CARD:
            stats.byMethod.stripe++;
            break;
          case PaymentMethod.SINPE_MOVIL:
            stats.byMethod.sinpe++;
            break;
          case PaymentMethod.CASH:
            stats.byMethod.cash++;
            break;
        }
      }
    });

    set({ stats });
  },

  getFilteredPayments: () => {
    const { payments, statusFilter, methodFilter, searchQuery } = get();

    let filtered = payments;

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    // Filtrar por método
    if (methodFilter !== 'all') {
      filtered = filtered.filter((payment) => payment.paymentMethod === methodFilter);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment.description.toLowerCase().includes(query) ||
          payment.invoiceNumber?.toLowerCase().includes(query) ||
          payment.id.toLowerCase().includes(query)
      );
    }

    return filtered;
  },

  reset: () => set(initialState),
}));
