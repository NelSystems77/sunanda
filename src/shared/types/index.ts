/**
 * Tipos compartidos de la aplicación
 */

/**
 * Resultado genérico de operaciones
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Estado de carga
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Paginación
 */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Filtros genéricos
 */
export interface FilterOptions {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Opciones de consulta
 */
export interface QueryOptions extends FilterOptions {
  page?: number;
  pageSize?: number;
}

/**
 * Respuesta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/**
 * Opciones de calendario
 */
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: Record<string, unknown>;
}

/**
 * Estadísticas del dashboard
 */
export interface DashboardStats {
  totalClients: number;
  totalAppointments: number;
  todayAppointments: number;
  monthlyRevenue: number;
  growthRate: number;
}

/**
 * Notificación
 */
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

/**
 * Configuración de tema
 */
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
}

/**
 * Configuración de usuario
 */
export interface UserPreferences {
  theme: ThemeConfig;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  calendarView: 'day' | 'week' | 'month';
}
