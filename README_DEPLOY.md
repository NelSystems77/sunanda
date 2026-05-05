# 🚀 Guía de Deployment - SUNANDA Spa

## Deployment en Vercel (Recomendado)

Esta guía cubre el proceso completo de deployment de SUNANDA Spa en Vercel.

---

## 📋 Pre-requisitos

Antes de comenzar el deployment, asegúrate de tener:

- ✅ Cuenta de GitHub con el repositorio del proyecto
- ✅ Cuenta de Vercel (gratis en [vercel.com](https://vercel.com))
- ✅ Proyecto Firebase configurado para producción
- ✅ Cuenta Stripe con API keys de producción (si usas pagos)
- ✅ Node.js v18+ instalado localmente

---

## 🔧 Configuración Inicial

### 1. Preparar Firebase para Producción

#### Crear Proyecto de Producción

```bash
# Ir a Firebase Console
https://console.firebase.google.com/

# Crear nuevo proyecto para producción
Nombre: sunanda-spa-prod (o similar)
```

#### Configurar Authentication

1. Authentication → Sign-in method
2. Habilitar Email/Password
3. Configurar dominio autorizado: `tu-dominio.vercel.app`

#### Configurar Firestore

1. Firestore Database → Create database
2. Modo: Production
3. Región: us-central1 (o más cercana)
4. Reglas de seguridad: Copiar de `firestore.rules`

#### Configurar Storage

1. Storage → Get Started
2. Reglas de seguridad: Copiar de `storage.rules`

#### Obtener Credenciales

```bash
Project Settings → General → Your apps → Web app
```

Copiar todas las credenciales para `.env.production`

---

### 2. Preparar Stripe (si usas pagos)

```bash
# Ir a Stripe Dashboard
https://dashboard.stripe.com/

# Obtener LIVE keys (no TEST)
Developers → API keys → Publishable key (pk_live_...)
```

⚠️ **IMPORTANTE**: En producción SIEMPRE usa `pk_live_...`, NO `pk_test_...`

---

### 3. Configurar Variables de Entorno

#### Opción A: Desde Vercel Dashboard

1. Ir a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agregar cada variable:

```
VITE_FIREBASE_API_KEY = [tu valor]
VITE_FIREBASE_AUTH_DOMAIN = [tu valor]
VITE_FIREBASE_PROJECT_ID = [tu valor]
...todas las demás variables
```

4. Environment: **Production**
5. Save

#### Opción B: Desde CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Agregar variables (interactivo)
vercel env add VITE_FIREBASE_API_KEY

# O importar desde archivo
vercel env pull .env.vercel.local
```

---

## 🚀 Proceso de Deployment

### Opción 1: Deployment Automático (Recomendado)

#### Configuración Inicial

1. **Conectar GitHub con Vercel**

```bash
# Ir a Vercel Dashboard
https://vercel.com/new

# Import Git Repository
→ Seleccionar tu repositorio
→ Click "Import"
```

2. **Configurar Proyecto**

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

3. **Agregar Environment Variables**

```
Settings → Environment Variables
→ Pegar todas las variables de .env.production.example
→ Save
```

4. **Deploy**

```
Click "Deploy"
Esperar ~2-3 minutos
```

#### Deployments Subsecuentes

```bash
# Cada push a main dispara auto-deploy
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# Vercel automáticamente:
# 1. Detecta el push
# 2. Ejecuta build
# 3. Deploya si build exitoso
# 4. Notifica por email
```

---

### Opción 2: Deployment Manual

```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Deploy a preview
vercel

# Deploy a producción
vercel --prod

# Con variables específicas
vercel --prod -e VITE_ENV=production
```

---

## 🔍 Verificación Post-Deployment

### Checklist de Verificación

```bash
# 1. Abrir la URL de producción
https://tu-proyecto.vercel.app

# 2. Verificar en DevTools
Console: Sin errores
Network: Todos los requests 200
Application → Service Worker: Activado
Application → Manifest: Válido

# 3. Probar funcionalidades críticas
□ Login/Logout
□ Crear cita
□ Ver clientes
□ PWA instalable
□ Funciona offline
□ Actualizaciones automáticas

# 4. Lighthouse Audit
DevTools → Lighthouse → Generate report
□ Performance: >90
□ Accessibility: >90
□ Best Practices: >90
□ SEO: >90
□ PWA: 100
```

---

## 🌐 Configurar Dominio Custom (Opcional)

### En Vercel

1. **Agregar Dominio**

```bash
# Dashboard
Settings → Domains → Add

# Ingresar: sunanda-spa.com
```

2. **Configurar DNS**

En tu proveedor de DNS (Namecheap, GoDaddy, etc.):

```
Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com

Tipo: A
Nombre: @
Valor: 76.76.21.21
```

3. **Verificar**

```bash
# Esperar propagación DNS (5-60 min)
# Vercel automáticamente:
- Verifica dominio
- Genera SSL certificate
- Configura redirects
```

### En Firebase

Actualizar dominios autorizados:

```bash
Firebase Console → Authentication → Settings
Authorized domains → Add domain

Agregar:
- sunanda-spa.com
- www.sunanda-spa.com
- tu-proyecto.vercel.app
```

---

## 📊 Monitoreo y Analytics

### Vercel Analytics

```bash
# Habilitar en Dashboard
Analytics → Enable

# Ver métricas en tiempo real:
- Page views
- Unique visitors
- Performance metrics
- Error tracking
```

### Google Analytics

```env
# Agregar en .env.production
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Sentry (Error Tracking)

```bash
# 1. Crear cuenta en sentry.io
# 2. Crear proyecto
# 3. Obtener DSN

# 4. Agregar en .env.production
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.VITE_ENV === 'production') {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: "production",
    tracesSampleRate: 0.1,
  });
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Opcional)

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          # ... todas las demás variables
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🐛 Troubleshooting

### Error: "Failed to load resource"

**Problema**: Assets no cargan

**Solución**:
```bash
# Verificar vercel.json
# Asegurar que routes están correctas

# Revisar base URL
vite.config.ts → base: '/'
```

### Error: "Service Worker registration failed"

**Problema**: PWA no funciona

**Solución**:
```bash
# 1. Verificar HTTPS (Vercel lo hace automático)
# 2. Limpiar cache navegador
# 3. Revisar vercel.json headers para /sw.js
```

### Error: Firebase Auth domain mismatch

**Problema**: Login falla en producción

**Solución**:
```bash
# Firebase Console
Authentication → Settings → Authorized domains
→ Agregar: tu-proyecto.vercel.app
```

### Error: Environment variables no funcionan

**Problema**: Variables undefined

**Solución**:
```bash
# 1. Verificar prefijo VITE_
# 2. Rebuild después de agregar variables
# 3. Verificar en Vercel Dashboard que están en "Production"

# Forzar redeploy
vercel --prod --force
```

### Build falla en Vercel

**Problema**: Build exitoso local, falla en Vercel

**Solución**:
```bash
# 1. Verificar logs en Vercel Dashboard
# 2. Probar build local con producción

NODE_ENV=production npm run build

# 3. Verificar Node version
# package.json
"engines": {
  "node": ">=18.0.0"
}
```

---

## 📈 Optimizaciones Post-Deployment

### 1. Performance

```bash
# Habilitar Vercel Edge Network
Settings → Functions → Edge Functions

# Habilitar Image Optimization
next/image equivalente para Vite
```

### 2. SEO

```bash
# Agregar meta tags
# Verificar en:
https://search.google.com/search-console

# Sitemap
# Agregar public/sitemap.xml
```

### 3. Security Headers

Ya configurados en `vercel.json`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

---

## 🔐 Seguridad

### Firestore Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Clients - solo autenticados
    match /clients/{clientId} {
      allow read, write: if request.auth != null;
    }
    
    // Appointments - solo autenticados
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null;
    }
    
    // Public booking requests
    match /bookingRequests/{requestId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

### Storage Rules

```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /clients/{clientId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📞 Soporte

### Recursos Oficiales

- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev/)
- [Firebase Docs](https://firebase.google.com/docs)

### Comandos Útiles

```bash
# Ver logs de deployment
vercel logs tu-proyecto.vercel.app

# Listar deployments
vercel list

# Rollback a versión anterior
vercel rollback [deployment-url]

# Ver env variables
vercel env ls

# Pull env variables localmente
vercel env pull
```

---

## ✅ Checklist Final

Pre-deployment:
- [ ] Firebase configurado para producción
- [ ] Todas las env variables en Vercel
- [ ] Build local exitoso
- [ ] Tests pasando
- [ ] Lighthouse audit >90

Post-deployment:
- [ ] URL accesible
- [ ] Service Worker activo
- [ ] Login funcional
- [ ] CRUD operations funcionando
- [ ] PWA instalable
- [ ] Analytics configurado
- [ ] Dominio custom (si aplica)
- [ ] DNS propagado
- [ ] SSL activo
- [ ] Monitoreo configurado

---

**¡Listo para producción! 🎉**

Para actualizaciones futuras, solo haz push a `main` y Vercel se encarga del resto.
