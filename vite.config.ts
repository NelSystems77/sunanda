import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { writeFileSync } from 'fs';

// Genera public/firebase-messaging-sw.js con los env vars de Firebase inyectados.
// Firebase compat SDK (importScripts CDN) es la única forma de usar messaging en SW
// ya que los service workers no soportan ES modules todavía en todos los navegadores.
function generateFCMServiceWorker(): Plugin {
  const generate = (mode: string) => {
    const env = loadEnv(mode, process.cwd(), '');
    const content = `// Auto-generado por vite.config.ts — NO editar manualmente
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: '${env.VITE_FIREBASE_API_KEY || ''}',
  authDomain: '${env.VITE_FIREBASE_AUTH_DOMAIN || ''}',
  projectId: '${env.VITE_FIREBASE_PROJECT_ID || ''}',
  storageBucket: '${env.VITE_FIREBASE_STORAGE_BUCKET || ''}',
  messagingSenderId: '${env.VITE_FIREBASE_MESSAGING_SENDER_ID || ''}',
  appId: '${env.VITE_FIREBASE_APP_ID || ''}'
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
`;
    writeFileSync('./public/firebase-messaging-sw.js', content, 'utf-8');
  };

  return {
    name: 'generate-fcm-sw',
    configResolved(config) {
      generate(config.mode);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    generateFCMServiceWorker(),
    react({
      // Optimizaciones SWC
      plugins: [
        // React Refresh optimizado
      ],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/*.png', 'robots.txt', 'favicon.ico'],
      
      manifest: {
        name: 'SUNANDA Estética y Spa',
        short_name: 'SUNANDA Spa',
        description: 'Sistema de gestión profesional para estética y spa con funcionalidad offline',
        theme_color: '#EAB308',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'es-CR',
        categories: ['business', 'health', 'lifestyle'],
        
        icons: [
          {
            src: '/icons/icon-72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        
      },
      
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,ttf,eot}'],
        
        // Archivos que NO deben ser cacheados
        globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
        
        // Tamaño máximo de archivos a pre-cachear (2MB)
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        
        // Estrategias de caché runtime
        runtimeCaching: [
          // API de Firebase - Network First con fallback
          {
            urlPattern: /^https:\/\/.*\.firebaseio\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 día
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          
          // Firebase Storage - Cache First
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-storage-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          
          // Google Fonts - Cache First con larga duración
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
              }
            }
          },
          
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          
          // Imágenes - Stale While Revalidate
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              }
            }
          },
          
          // Navegación - Network First con fallback
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 día
              }
            }
          }
        ],
        
        // Modo de desarrollo
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        
        // Navegación offline fallback
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/admin/]
      },
      
      devOptions: {
        enabled: false,
        type: 'module',
        navigateFallback: 'index.html'
      }
    })
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/presentation': path.resolve(__dirname, './src/presentation'),
      '@/shared': path.resolve(__dirname, './src/shared')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  
  // Optimizaciones de desarrollo
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },
  
  preview: {
    port: 4173,
    open: true
  },
  
  // Optimizaciones de build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    
    // Terser optimizado para máxima compresión
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    
    // Rollup optimizations
    rollupOptions: {
      input: {
        main: path.resolve(__dirname,'index.html')
      },
      output: {
        
        // Code splitting deshabilitado para evitar chunks vacíos
        manualChunks: undefined,
        
        // Optimizar nombres de chunks
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.');
          const ext = info?.[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/woff2?|eot|ttf|otf/i.test(ext ?? '')) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[ext]/[name]-[hash][extname]';
        }
      },
      
      // Optimizaciones de tree-shaking
      treeshake:  false
    },
    
    // Tamaño de chunks optimizado
    chunkSizeWarningLimit: 1000,
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Reportar tamaño comprimido
    reportCompressedSize: true,
    
    // Target moderno para mejor optimización
    target: 'es2020',
    
    // Optimizar assets
    assetsInlineLimit: 4096 // 4kb
  },
  
  // Optimizaciones de preview
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'zustand',
      'framer-motion',
      'react-hot-toast',
      'lucide-react'
    ],
    exclude: [
      'workbox-window'
    ]
  },
  
  // Configuración de CSS
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[local]_[hash:base64:5]'
    },
    preprocessorOptions: {
      css: {
        charset: false
      }
    },
    devSourcemap: false
  },
  
  // JSON optimizations
  json: {
    stringify: true
  },
  
  // Esbuild optimizations para dev
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    legalComments: 'none',
    pure: ['console.log', 'console.info', 'console.debug']
  }
});