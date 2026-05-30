// Auto-generado por vite.config.ts — NO editar manualmente
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyByDKBD81nHKlZOXcsQm1WyjYWT5h5o9nI',
  authDomain: 'sunanda-spa.firebaseapp.com',
  projectId: 'sunanda-spa',
  storageBucket: 'sunanda-spa.appspot.com',
  messagingSenderId: '450503810380',
  appId: '1:450503810380:web:17accb195e004c85ca83e9'
});

const messaging = firebase.messaging();

// Mensajes recibidos mientras la app está en segundo plano o cerrada
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'SUNANDA Spa';
  const options = {
    body: payload.notification?.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [200, 100, 200],
    tag: payload.data?.type || 'notification',
    requireInteraction: payload.data?.type === 'new_appointment',
    data: {
      url: payload.data?.url || '/dashboard/appointments',
      type: payload.data?.type,
      appointmentId: payload.data?.appointmentId,
    },
  };
  self.registration.showNotification(title, options);
});

// Al hacer click en la notificación, abrir o enfocar el dashboard
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard/appointments';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
