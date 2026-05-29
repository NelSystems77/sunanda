import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  Users, Calendar, DollarSign, TrendingUp,
  AlertCircle, Star, Clock,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import {
  dashboardService,
  DashboardStats,
} from '@/core/infrastructure/services/DashboardService';
import { AppointmentStatus } from '@/core/domain/enums';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setStats(await dashboardService.getStats());
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Error cargando estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-dark-400 mt-1">
            Bienvenido/a {user?.displayName || ''} — resumen de actividad
          </p>
        </div>

        {/* Alerta pagos pendientes */}
        {stats.pendingPayments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-red-900/20 border border-red-500/40 rounded-xl px-4 py-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white text-sm">
                {stats.pendingPayments.length} pago{stats.pendingPayments.length > 1 ? 's' : ''} pendiente{stats.pendingPayments.length > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-red-400">Requieren atención</p>
            </div>
          </motion.div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Clientes"
            value={stats.totalClients}
            trending={stats.trending.clients}
            sub={`+${stats.newClientsThisMonth} este mes`}
            color="blue"
          />
          <StatCard
            icon={Calendar}
            label="Citas Hoy"
            value={stats.appointmentsToday}
            sub={`${stats.occupancyRate}% ocupación`}
            color="gold"
          />
          <StatCard
            icon={DollarSign}
            label="Ingresos del Mes"
            value={`₡${stats.revenueCRC.toLocaleString('es-CR')}`}
            trending={stats.trending.revenue}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Confirmación"
            value={`${stats.confirmationRate}%`}
            sub={`${stats.noShowRate}% no-shows`}
            color="purple"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Citas por semana
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.appointmentsByWeek} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="week" stroke="#6a6a6a" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6a6a6a" tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '0.5rem' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#d4af37' }}
                />
                <Bar dataKey="count" name="Citas" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Ingresos por mes (₡)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="month" stroke="#6a6a6a" tick={{ fontSize: 12 }} />
                <YAxis
                  stroke="#6a6a6a"
                  tick={{ fontSize: 12 }}
                  tickFormatter={v => v === 0 ? '0' : `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '0.5rem' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#22c55e' }}
                  formatter={(v) => [`₡${Number(v).toLocaleString('es-CR')}`, 'Ingresos']}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Próximas citas */}
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gold-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Próximas citas</h3>
            </div>
            {stats.upcomingAppointments.length > 0 ? (
              <div className="space-y-2">
                {stats.upcomingAppointments.map(apt => (
                  <div key={apt.id} className="p-3 rounded-lg bg-gray-50 dark:bg-dark-900">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {apt.clientName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-dark-400 truncate">
                          {apt.serviceName}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-dark-500 mt-0.5">
                          {format(apt.date, 'dd MMM', { locale: es })} · {apt.startTime}
                        </p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        apt.status === AppointmentStatus.CONFIRMED
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gold-500/20 text-gold-400'
                      }`}>
                        {apt.status === AppointmentStatus.CONFIRMED ? 'Confirmada' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-dark-400 text-center py-8">
                Sin citas próximas
              </p>
            )}
          </div>

          {/* Top servicios */}
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-gold-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Servicios populares</h3>
            </div>
            {stats.topServices.length > 0 ? (
              <div className="space-y-3">
                {stats.topServices.map((svc, i) => (
                  <div key={svc.serviceId} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold-500/20 flex items-center justify-center text-xs font-bold text-gold-400">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {svc.serviceName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-dark-400">
                        {svc.count} citas · ₡{svc.revenue.toLocaleString('es-CR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-dark-400 text-center py-8">
                Sin datos este mes
              </p>
            )}
          </div>

          {/* Top clientes */}
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gold-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Clientes VIP</h3>
            </div>
            {stats.topClients.length > 0 ? (
              <div className="space-y-3">
                {stats.topClients.map((cli, i) => (
                  <div key={cli.clientId} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {cli.clientName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-dark-400">
                        {cli.visitCount} visita{cli.visitCount !== 1 ? 's' : ''} · ₡{cli.totalSpent.toLocaleString('es-CR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-dark-400 text-center py-8">
                Sin datos este mes
              </p>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

// --- StatCard interno ---

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trending?: number;
  sub?: string;
  color: 'blue' | 'gold' | 'green' | 'purple';
}

function StatCard({ icon: Icon, label, value, trending, sub, color }: StatCardProps) {
  const palette = {
    blue:   'text-blue-400 bg-blue-500/20',
    gold:   'text-gold-400 bg-gold-500/20',
    green:  'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 dark:text-dark-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 truncate">{value}</p>

          {sub && (
            <p className="text-xs text-gray-400 dark:text-dark-500 mt-1">{sub}</p>
          )}

          {typeof trending === 'number' && (
            <div className="flex items-center gap-1 mt-1.5">
              <TrendingUp className={`w-3 h-3 ${trending >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`text-xs font-medium ${trending >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trending >= 0 ? '+' : ''}{typeof value === 'string' ? `₡${Math.abs(trending).toLocaleString('es-CR')}` : trending}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-dark-500">vs mes anterior</span>
            </div>
          )}
        </div>

        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${palette[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
