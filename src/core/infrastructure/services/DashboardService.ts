import { clientRepository } from '../repositories/ClientRepository';
import { appointmentRepository } from '../repositories/AppointmentRepository';
import { paymentRepository } from '../repositories/PaymentRepository';
import { serviceRepository } from '../repositories/ServiceRepository';
import { AppointmentStatus } from '../../domain/enums';
import { PaymentStatus } from '../../domain/interfaces/Payment';
import { Client } from '../../domain/interfaces/Client';
import { Appointment } from '../../domain/interfaces/Appointment';
import { Payment } from '../../domain/interfaces/Payment';
import { Service } from '../../domain/interfaces/Service';

export interface UpcomingAppointment {
  id: string;
  clientName: string;
  serviceName: string;
  startTime: string;
  date: Date;
  status: AppointmentStatus;
}

export interface PendingPayment {
  id: string;
  clientName: string;
  amount: number;
  daysOverdue: number;
}

export interface TopService {
  serviceId: string;
  serviceName: string;
  count: number;
  revenue: number;
}

export interface TopClient {
  clientId: string;
  clientName: string;
  totalSpent: number;
  visitCount: number;
}

export interface WeekData {
  week: string;
  count: number;
}

export interface MonthData {
  month: string;
  amount: number;
}

export interface DashboardStats {
  totalClients: number;
  newClientsThisMonth: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  appointmentsThisMonth: number;
  revenueCRC: number;
  trending: {
    clients: number;
    appointments: number;
    revenue: number;
  };
  occupancyRate: number;
  confirmationRate: number;
  noShowRate: number;
  upcomingAppointments: UpcomingAppointment[];
  pendingPayments: PendingPayment[];
  topServices: TopService[];
  topClients: TopClient[];
  appointmentsByWeek: WeekData[];
  revenueByMonth: MonthData[];
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [clients, appointments, payments, services] = await Promise.all([
      clientRepository.getAll(),
      appointmentRepository.getAll(),
      paymentRepository.getAll(),
      serviceRepository.getAll(),
    ]);

    return {
      totalClients: clients.length,
      newClientsThisMonth: this.newClientsThisMonth(clients, now),
      appointmentsToday: this.countAppointments(appointments, today, tomorrow),
      appointmentsThisWeek: this.countAppointmentsThisWeek(appointments, now),
      appointmentsThisMonth: this.countAppointmentsThisMonth(appointments, now),
      revenueCRC: this.revenueThisMonth(payments, now),
      trending: this.calculateTrending(clients, appointments, payments, now),
      occupancyRate: this.occupancyRate(appointments, today, tomorrow),
      confirmationRate: this.confirmationRate(appointments, now),
      noShowRate: this.noShowRate(appointments, now),
      upcomingAppointments: this.getUpcoming(appointments, clients, services, today),
      pendingPayments: this.getPending(payments, clients),
      topServices: this.getTopServices(appointments, services, now),
      topClients: this.getTopClients(payments, clients, now),
      appointmentsByWeek: this.byWeek(appointments, now),
      revenueByMonth: this.byMonth(payments, now),
    };
  }

  private newClientsThisMonth(clients: Client[], now: Date): number {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    return clients.filter(c => c.createdAt >= first).length;
  }

  private countAppointments(apts: Appointment[], from: Date, to: Date): number {
    return apts.filter(a => a.date >= from && a.date < to && a.status !== AppointmentStatus.CANCELLED).length;
  }

  private countAppointmentsThisWeek(apts: Appointment[], now: Date): number {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return apts.filter(a => a.date >= start && a.date < end && a.status !== AppointmentStatus.CANCELLED).length;
  }

  private countAppointmentsThisMonth(apts: Appointment[], now: Date): number {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    return apts.filter(a => a.date >= first && a.status !== AppointmentStatus.CANCELLED).length;
  }

  private revenueThisMonth(payments: Payment[], now: Date): number {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    return payments
      .filter(p => p.createdAt >= first && p.status === PaymentStatus.COMPLETED)
      .reduce((sum, p) => sum + p.amountCRC, 0);
  }

  private calculateTrending(
    clients: Client[],
    apts: Appointment[],
    payments: Payment[],
    now: Date
  ) {
    const firstThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const clientsThis = clients.filter(c => c.createdAt >= firstThisMonth).length;
    const clientsLast = clients.filter(
      c => c.createdAt >= firstLastMonth && c.createdAt <= lastLastMonth
    ).length;

    const aptsThis = apts.filter(a => a.date >= firstThisMonth).length;
    const aptsLast = apts.filter(
      a => a.date >= firstLastMonth && a.date <= lastLastMonth
    ).length;

    const revenueThis = this.revenueThisMonth(payments, now);
    const revenueLast = payments
      .filter(
        p =>
          p.createdAt >= firstLastMonth &&
          p.createdAt <= lastLastMonth &&
          p.status === PaymentStatus.COMPLETED
      )
      .reduce((sum, p) => sum + p.amountCRC, 0);

    return {
      clients: clientsThis - clientsLast,
      appointments: aptsThis - aptsLast,
      revenue: revenueThis - revenueLast,
    };
  }

  // 8 slots/día (90 min × slot, 09:00–21:00 = 12 horas)
  private occupancyRate(apts: Appointment[], today: Date, tomorrow: Date): number {
    const occupied = apts.filter(
      a => a.date >= today && a.date < tomorrow && a.status !== AppointmentStatus.CANCELLED
    ).length;
    return Math.min(100, Math.round((occupied / 8) * 100));
  }

  private confirmationRate(apts: Appointment[], now: Date): number {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = apts.filter(a => a.date >= first && a.status !== AppointmentStatus.CANCELLED);
    if (thisMonth.length === 0) return 0;
    const confirmed = thisMonth.filter(
      a => a.status === AppointmentStatus.CONFIRMED ||
           a.status === AppointmentStatus.COMPLETED ||
           a.status === AppointmentStatus.IN_PROGRESS
    ).length;
    return Math.round((confirmed / thisMonth.length) * 100);
  }

  private noShowRate(apts: Appointment[], now: Date): number {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = apts.filter(a => a.date >= first);
    if (thisMonth.length === 0) return 0;
    const noShows = thisMonth.filter(a => a.status === AppointmentStatus.NO_SHOW).length;
    return Math.round((noShows / thisMonth.length) * 100);
  }

  private getUpcoming(
    apts: Appointment[],
    clients: Client[],
    services: Service[],
    today: Date
  ): UpcomingAppointment[] {
    const limit = new Date(today);
    limit.setDate(limit.getDate() + 3);

    return apts
      .filter(
        a =>
          a.date >= today &&
          a.date < limit &&
          a.status !== AppointmentStatus.CANCELLED
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
      .map(a => {
        const client = clients.find(c => c.id === a.clientId);
        const service = services.find(s => s.id === a.serviceId);
        return {
          id: a.id,
          clientName: client ? `${client.firstName} ${client.lastName}` : 'Cliente desconocido',
          serviceName: service?.name ?? 'Servicio desconocido',
          startTime: a.startTime,
          date: a.date,
          status: a.status,
        };
      });
  }

  private getPending(payments: Payment[], clients: Client[]): PendingPayment[] {
    return payments
      .filter(p => p.status === PaymentStatus.PENDING)
      .map(p => {
        const client = clients.find(c => c.id === p.clientId);
        const daysOverdue = Math.floor(
          (Date.now() - p.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          id: p.id,
          clientName: client ? `${client.firstName} ${client.lastName}` : 'Cliente desconocido',
          amount: p.amountCRC,
          daysOverdue,
        };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue)
      .slice(0, 5);
  }

  private getTopServices(
    apts: Appointment[],
    services: Service[],
    now: Date
  ): TopService[] {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const completed = apts.filter(
      a => a.date >= first &&
      (a.status === AppointmentStatus.COMPLETED ||
       a.status === AppointmentStatus.CONFIRMED ||
       a.status === AppointmentStatus.IN_PROGRESS)
    );

    const counts = new Map<string, number>();
    completed.forEach(a => counts.set(a.serviceId, (counts.get(a.serviceId) ?? 0) + 1));

    return Array.from(counts.entries())
      .map(([serviceId, count]) => {
        const service = services.find(s => s.id === serviceId);
        return {
          serviceId,
          serviceName: service?.name ?? 'Servicio desconocido',
          count,
          revenue: count * (service?.priceCRC ?? 0),
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getTopClients(payments: Payment[], clients: Client[], now: Date): TopClient[] {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const completed = payments.filter(
      p => p.createdAt >= first && p.status === PaymentStatus.COMPLETED
    );

    const spending = new Map<string, { totalSpent: number; visitCount: number }>();
    completed.forEach(p => {
      const current = spending.get(p.clientId) ?? { totalSpent: 0, visitCount: 0 };
      spending.set(p.clientId, {
        totalSpent: current.totalSpent + p.amountCRC,
        visitCount: current.visitCount + 1,
      });
    });

    return Array.from(spending.entries())
      .map(([clientId, data]) => {
        const client = clients.find(c => c.id === clientId);
        return {
          clientId,
          clientName: client ? `${client.firstName} ${client.lastName}` : 'Cliente desconocido',
          ...data,
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  }

  private byWeek(apts: Appointment[], now: Date): WeekData[] {
    return [3, 2, 1, 0].map(weeksAgo => {
      const start = new Date(now);
      start.setDate(now.getDate() - weeksAgo * 7 - now.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      return {
        week: weeksAgo === 0 ? 'Esta semana' : `Hace ${weeksAgo}s`,
        count: apts.filter(a => a.date >= start && a.date < end && a.status !== AppointmentStatus.CANCELLED).length,
      };
    });
  }

  private byMonth(payments: Payment[], now: Date): MonthData[] {
    return [5, 4, 3, 2, 1, 0].map(monthsAgo => {
      const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
      const first = new Date(d.getFullYear(), d.getMonth(), 1);
      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const amount = payments
        .filter(
          p =>
            p.createdAt >= first &&
            p.createdAt <= last &&
            p.status === PaymentStatus.COMPLETED
        )
        .reduce((sum, p) => sum + p.amountCRC, 0);

      return {
        month: d.toLocaleDateString('es-CR', { month: 'short' }),
        amount,
      };
    });
  }
}

export const dashboardService = new DashboardService();
