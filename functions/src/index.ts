import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// Zona horaria de Costa Rica
const CR_TIMEZONE = 'America/Costa_Rica';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAdminTokens(): Promise<string[]> {
  const snap = await db.collection('users')
    .where('isActive', '==', true)
    .where('role', 'in', ['ADMIN', 'SUPER_ADMIN', 'ESTHETICIAN'])
    .get();

  const tokens: string[] = [];
  snap.forEach((doc) => {
    const fcmTokens: string[] = doc.data().fcmTokens || [];
    tokens.push(...fcmTokens);
  });

  return [...new Set(tokens)]; // Deduplicar
}

async function sendToAdmins(
  notification: admin.messaging.Notification,
  data: Record<string, string>
): Promise<void> {
  const tokens = await getAdminTokens();
  if (tokens.length === 0) return;

  // FCM admite máx 500 tokens por multicast
  const chunks: string[][] = [];
  for (let i = 0; i < tokens.length; i += 500) {
    chunks.push(tokens.slice(i, i + 500));
  }

  for (const chunk of chunks) {
    const response = await messaging.sendEachForMulticast({
      tokens: chunk,
      notification,
      data,
      webpush: {
        notification: {
          icon: '/icons/icon-192.png',
          badge: '/icons/icon-72.png',
          requireInteraction: data.type === 'new_appointment' || data.type === 'new_booking_request',
        },
        fcmOptions: {
          link: data.url || '/dashboard/appointments',
        },
      },
      android: {
        notification: {
          icon: 'ic_notification',
          color: '#EAB308',
          channelId: 'sunanda_appointments',
        },
        priority: 'high',
      },
    });

    // Limpiar tokens inválidos
    const invalidTokens: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
        invalidTokens.push(chunk[idx]);
      }
    });

    if (invalidTokens.length > 0) {
      await cleanInvalidTokens(invalidTokens);
    }
  }
}

async function cleanInvalidTokens(invalidTokens: string[]): Promise<void> {
  const snap = await db.collection('users').get();
  const batch = db.batch();

  snap.forEach((doc) => {
    const tokens: string[] = doc.data().fcmTokens || [];
    const validTokens = tokens.filter((t) => !invalidTokens.includes(t));
    if (validTokens.length !== tokens.length) {
      batch.update(doc.ref, { fcmTokens: validTokens });
    }
  });

  await batch.commit();
}

function extractClientName(notes: string, fallback: string): string {
  const match = notes.match(/Nombre:\s*([^|]+)/);
  return match ? match[1].trim() : fallback;
}

function formatAppointmentDate(date: admin.firestore.Timestamp | undefined): string {
  if (!date) return '';
  return date.toDate().toLocaleDateString('es-CR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: CR_TIMEZONE,
  });
}

// ─── Trigger: Nueva cita ───────────────────────────────────────────────────────

export const onAppointmentCreated = functions
  .region('us-central1')
  .firestore.document('appointments/{appointmentId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    const clientName = extractClientName(data.notes || '', data.clientId || 'Cliente');
    const dateStr = formatAppointmentDate(data.date);
    const service = data.serviceName || 'Servicio';
    const time = data.startTime || '';

    await sendToAdmins(
      {
        title: '🗓️ Nueva cita agendada',
        body: `${clientName} · ${service} · ${dateStr} ${time}`.trim(),
      },
      {
        type: 'new_appointment',
        appointmentId: snap.id,
        url: '/dashboard/appointments',
      }
    );
  });

// ─── Trigger: Cita cancelada ───────────────────────────────────────────────────

export const onAppointmentCancelled = functions
  .region('us-central1')
  .firestore.document('appointments/{appointmentId}')
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status === after.status) return;
    if (after.status !== 'cancelled') return;

    const clientName = extractClientName(after.notes || '', after.clientId || 'Cliente');
    const dateStr = formatAppointmentDate(after.date);
    const service = after.serviceName || 'Servicio';

    await sendToAdmins(
      {
        title: '❌ Cita cancelada',
        body: `${clientName} · ${service} · ${dateStr}`,
      },
      {
        type: 'appointment_cancelled',
        appointmentId: change.after.id,
        url: '/dashboard/appointments',
      }
    );
  });

// ─── Trigger: Nueva solicitud de cita (desde landing) ─────────────────────────

export const onBookingRequestCreated = functions
  .region('us-central1')
  .firestore.document('bookingRequests/{requestId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    const clientName: string = data.clientName || 'Cliente';
    const serviceName: string = data.serviceName || 'Servicio';

    let dateTimeStr = '';
    if (data.requestedDate) {
      const date = (data.requestedDate as admin.firestore.Timestamp).toDate();
      const dateStr = date.toLocaleDateString('es-CR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        timeZone: CR_TIMEZONE,
      });
      dateTimeStr = data.flexibleTime
        ? `${dateStr} (horario flexible)`
        : `${dateStr} ${data.requestedTime || ''}`.trim();
    }

    await sendToAdmins(
      {
        title: '📋 Nueva solicitud de cita',
        body: `${clientName} · ${serviceName}${dateTimeStr ? ' · ' + dateTimeStr : ''}`,
      },
      {
        type: 'new_booking_request',
        requestId: snap.id,
        url: '/dashboard/booking-requests',
      }
    );
  });

// ─── Scheduled: Recordatorios cada hora ───────────────────────────────────────
// Corre cada hora en punto · Tiempo Costa Rica (UTC-6)
// Detecta citas a ~24h y ~1h y envía recordatorio una sola vez

export const checkAppointmentReminders = functions
  .region('us-central1')
  .pubsub.schedule('0 * * * *')
  .timeZone(CR_TIMEZONE)
  .onRun(async () => {
    const nowMs = Date.now();

    // Buscar citas en las próximas 25 horas
    const windowEnd = admin.firestore.Timestamp.fromMillis(nowMs + 25 * 60 * 60 * 1000);
    const nowTs = admin.firestore.Timestamp.fromMillis(nowMs);

    const snap = await db.collection('appointments')
      .where('status', 'in', ['confirmed', 'pending'])
      .where('date', '>=', nowTs)
      .where('date', '<=', windowEnd)
      .get();

    const batch = db.batch();
    const notifications: Promise<void>[] = [];

    snap.forEach((docSnap) => {
      const appt = docSnap.data();
      const apptMs = (appt.date as admin.firestore.Timestamp).toMillis();
      const diffH = (apptMs - nowMs) / (1000 * 60 * 60);

      const clientName = extractClientName(appt.notes || '', appt.clientId || 'Cliente');
      const service = appt.serviceName || 'Servicio';
      const time = appt.startTime || '';

      // Recordatorio 24h (ventana: 23h–25h antes)
      if (diffH >= 23 && diffH <= 25 && !appt.reminder24hSent) {
        notifications.push(
          sendToAdmins(
            { title: '⏰ Cita mañana', body: `${clientName} · ${service} · ${time}` },
            { type: 'reminder_24h', appointmentId: docSnap.id, url: '/dashboard/appointments' }
          )
        );
        batch.update(docSnap.ref, { reminder24hSent: true });
      }

      // Recordatorio 1h (ventana: 45min–75min antes)
      if (diffH >= 0.75 && diffH <= 1.25 && !appt.reminder1hSent) {
        notifications.push(
          sendToAdmins(
            { title: '🔔 Cita en 1 hora', body: `${clientName} · ${service} · ${time}` },
            { type: 'reminder_1h', appointmentId: docSnap.id, url: '/dashboard/appointments' }
          )
        );
        batch.update(docSnap.ref, { reminder1hSent: true });
      }
    });

    await Promise.all([...notifications, batch.commit()]);
    return null;
  });
