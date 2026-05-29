/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
  NetworkOnly
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

// Configuración
const CACHE_VERSION = 'v1';

// Toma control inmediatamente
clientsClaim();

// Limpia caches antiguos
cleanupOutdatedCaches();

// Pre-cache de archivos críticos
precacheAndRoute(self.__WB_MANIFEST);

// ============================================
// ESTRATEGIAS DE CACHE POR TIPO DE RECURSO
// ============================================

// 1. Páginas HTML - Network First con fallback offline
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: `${CACHE_VERSION}-pages`,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 // 24 horas
      })
    ]
  })
);

// 2. API Firebase - Network First con timeout
registerRoute(
  ({ url }) => 
    url.hostname.includes('firebaseio.com') || 
    url.hostname.includes('googleapis.com'),
  new NetworkFirst({
    cacheName: `${CACHE_VERSION}-firebase-api`,
    networkTimeoutSeconds: 10,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 // 1 hora
      })
    ]
  })
);

// 3. Firebase Storage - Cache First (imágenes, archivos)
registerRoute(
  ({ url }) => url.hostname === 'firebasestorage.googleapis.com',
  new CacheFirst({
    cacheName: `${CACHE_VERSION}-firebase-storage`,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
        purgeOnQuotaError: true
      })
    ]
  })
);

// 4. Google Fonts - Cache First (larga duración)
registerRoute(
  ({ url }) => 
    url.hostname === 'fonts.googleapis.com' || 
    url.hostname === 'fonts.gstatic.com',
  new CacheFirst({
    cacheName: `${CACHE_VERSION}-google-fonts`,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
      })
    ]
  })
);

// 5. Imágenes locales - Stale While Revalidate
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: `${CACHE_VERSION}-images`,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 150,
        maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
      })
    ]
  })
);

// 6. CSS y JavaScript - Stale While Revalidate
registerRoute(
  ({ request }) => 
    request.destination === 'style' || 
    request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: `${CACHE_VERSION}-static-resources`,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 7 // 7 días
      })
    ]
  })
);

// ============================================
// BACKGROUND SYNC - Operaciones offline
// ============================================

const bgSyncPlugin = new BackgroundSyncPlugin('sunanda-sync-queue', {
  maxRetentionTime: 24 * 60, // 24 horas en minutos
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request);
        console.log('✅ Background sync: Request exitoso', entry.request.url);
      } catch (error) {
        console.error('❌ Background sync: Error', error);
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  }
});

// Rutas POST/PUT/DELETE usan Background Sync
registerRoute(
  ({ url, request }) => 
    url.hostname.includes('firebaseio.com') && 
    ['POST', 'PUT', 'DELETE'].includes(request.method),
  new NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);

registerRoute(
  ({ url, request }) => 
    url.hostname.includes('firebaseio.com') && 
    ['POST', 'PUT', 'DELETE'].includes(request.method),
  new NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'PUT'
);

registerRoute(
  ({ url, request }) => 
    url.hostname.includes('firebaseio.com') && 
    ['POST', 'PUT', 'DELETE'].includes(request.method),
  new NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'DELETE'
);

// ============================================
// EVENTOS DEL SERVICE WORKER
// ============================================

// Install - Pre-cache de recursos críticos
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(`${CACHE_VERSION}-offline`).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/icons/icon-192.png',
        '/icons/icon-512.png'
      ]).catch((error) => {
        console.error('Error pre-caching offline resources:', error);
      });
    })
  );
  
  self.skipWaiting();
});

// Activate - Limpieza de caches antiguos
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => 
            cacheName.startsWith('v') && 
            !cacheName.startsWith(CACHE_VERSION)
          )
          .map((cacheName) => {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// Fetch - Manejo de solicitudes
self.addEventListener('fetch', (event) => {
  // Ignorar solicitudes que no sean GET para recursos no críticos
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar extensiones de navegador
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Fallback offline para navegación
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(`${CACHE_VERSION}-pages`);
        const cachedResponse = await cache.match('/index.html');
        return cachedResponse || new Response('Offline - No hay conexión', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
    );
  }
});

// Message - Comunicación con la app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ Service Worker: Skip waiting requested');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('🗑️ Service Worker: Clearing all caches');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_VERSION
    });
  }
});

// Push notifications (preparado para futuro)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'Nueva notificación de SUNANDA Spa',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'notification',
    requireInteraction: false,
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'SUNANDA Spa',
      options
    )
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // Si ya hay una ventana abierta, enfócala
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abre una nueva
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Sync event para background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-appointments') {
    event.waitUntil(syncAppointments());
  }
  if (event.tag === 'sync-clients') {
    event.waitUntil(syncClients());
  }
});

// Funciones de sincronización
async function syncAppointments() {
  console.log('🔄 Syncing appointments...');
  // Implementar lógica de sincronización
}

async function syncClients() {
  console.log('🔄 Syncing clients...');
  // Implementar lógica de sincronización
}

console.log('🚀 Service Worker: Loaded and ready');
