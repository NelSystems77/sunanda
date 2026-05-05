# 🌸 SUNANDA Estética y Spa

**Sistema de gestión profesional completo para centros de estética y spa.**

![Version](https://img.shields.io/badge/version-1.0.0-gold)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178c6)
![PWA](https://img.shields.io/badge/PWA-enabled-success)
![Lighthouse](https://img.shields.io/badge/Lighthouse-90+-success)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Demo](#-demo)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Desarrollo](#-desarrollo)
- [Deployment](#-deployment)
- [PWA](#-pwa)
- [Estructura](#-estructura-del-proyecto)
- [Scripts](#-scripts-disponibles)
- [Documentación](#-documentación)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### 🎯 Gestión Completa

#### ✅ Módulos Completados

- **Gestión de Clientes**
  - Expedientes completos con datos personales
  - Historial médico detallado
  - Fotos de antes/después
  - Búsqueda y filtros avanzados
  - Exportación de datos

- **Agenda Inteligente**
  - Calendario interactivo
  - Vista día/semana/mes
  - Asignación a especialistas
  - Recordatorios automáticos
  - Estados de cita (pendiente, confirmada, completada, cancelada)

- **Servicios**
  - Catálogo completo de tratamientos
  - Precios y duraciones
  - Categorías (facial, corporal, especial)
  - Vista pública para clientes

- **Solicitudes de Citas Públicas**
  - Formulario web para clientes
  - Selección de servicio y fecha
  - Notificaciones al admin
  - Gestión de solicitudes en dashboard

- **Sistema de Pagos** (Estructura completa)
  - Múltiples métodos (efectivo, tarjeta, SINPE, transferencia)
  - Estados de pago (pending, processing, completed, failed, refunded)
  - Integración preparada para Stripe
  - Historial de transacciones

#### ⏳ En Desarrollo

- Expedientes médicos completos
- Inventario de productos
- Reportes y analíticas avanzadas
- Sistema de membresías

### 👥 Sistema de Roles

- **Super Admin**: Control total del sistema, gestión de usuarios
- **Admin**: Gestión completa excepto usuarios
- **Recepcionista**: Agendas, clientes y asignaciones
- **Esteticista**: Agenda personal y expedientes de pacientes

### 📱 Progressive Web App (PWA)

- ✅ **Instalable** en desktop y móvil
- ✅ **Funciona offline** con cache inteligente
- ✅ **Actualizaciones automáticas** con notificación
- ✅ **Splash screen** personalizado
- ✅ **App shortcuts** para acceso rápido
- ✅ **Background sync** para operaciones offline

### 🎨 Diseño Premium

- Paleta: Negro (#000000), Blanco (#FFFFFF), Dorado (#EAB308)
- Modo oscuro y claro
- Animaciones elegantes con Framer Motion
- Responsive design (mobile-first)
- Componentes reutilizables y modulares

### 🔒 Seguridad

- Autenticación robusta con Firebase
- Permisos basados en roles (RBAC)
- Validaciones con Zod
- Headers de seguridad configurados
- HTTPS obligatorio en producción
- Firestore y Storage rules configuradas

### ⚡ Performance

- **Lighthouse Score**: >90 en todas las categorías
- **Code splitting** automático en 13+ chunks
- **Lazy loading** de rutas y componentes
- **Tree shaking** optimizado
- **Assets** comprimidos y optimizados
- **Bundle size**: ~180kb (gzipped)

---

## 🎥 Demo

**URL de Producción:** https://sunanda-spa.vercel.app *(Próximamente)*

**Credenciales de Demo:**
```
Email: demo@sunanda.com
Password: demo123456
```

---

## 🚀 Tecnologías

### Core

- **Frontend Framework**: React 18.2.0
- **Language**: TypeScript 5.3.3
- **Build Tool**: Vite 5.1.0
- **Styling**: Tailwind CSS 3.4.1

### State & Data

- **State Management**: Zustand 4.5.0
- **Backend**: Firebase 10.8.0
  - Authentication
  - Firestore Database
  - Storage
  - Functions (preparado)
- **Forms**: React Hook Form 7.50.0 + Zod 3.22.4

### UI/UX

- **Routing**: React Router DOM 6.22.0
- **Animations**: Framer Motion 11.0.3
- **Icons**: Lucide React 0.323.0
- **Toasts**: React Hot Toast 2.4.1

### PWA & Performance

- **PWA**: Vite Plugin PWA 0.17.5
- **Service Worker**: Workbox 7.0.0
- **Optimization**: SWC, Terser, Code Splitting

---

## 📦 Instalación

### Pre-requisitos

- Node.js 18+ y npm
- Cuenta de Firebase
- Git

### Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/sunanda-spa.git
cd sunanda-spa
```

### Instalar Dependencias

```bash
npm install
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

```bash
# Copiar template
cp .env.example .env

# Editar con tus credenciales
nano .env
```

Ver [.env.example](.env.example) para lista completa de variables requeridas.

### 2. Firebase Setup

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication (Email/Password)
3. Crear Firestore Database
4. Crear Storage bucket
5. Copiar credenciales a `.env`

**Guía completa:** Ver [README_DEPLOY.md](README_DEPLOY.md)

---

## 💻 Desarrollo

### Iniciar Dev Server

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Hot Module Replacement (HMR)

Vite provee HMR instantáneo. Cualquier cambio se refleja automáticamente.

### Linting y Type Checking

```bash
npm run lint             # ESLint
npm run type-check       # TypeScript
npm run format           # Prettier
```

---

## 🚀 Deployment

### Build para Producción

```bash
npm run build
```

### Preview Local

```bash
npm run preview
```

### Deploy a Vercel

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Guía completa:** Ver [README_DEPLOY.md](README_DEPLOY.md)  
**Checklist:** Ver [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

---

## 📱 PWA

### Instalación

**Desktop:** Click en ícono de instalación en barra de direcciones  
**iOS:** Compartir → Agregar a pantalla de inicio  
**Android:** Menu → Instalar app

### Funcionalidad Offline

- ✅ Navegación entre páginas cacheadas
- ✅ Datos previamente cargados
- ✅ UI completa
- ⚠️ Operaciones de escritura con sync pendiente

**Guía completa:** Ver [PWA_GUIDE.md](PWA_GUIDE.md)

---

## 📁 Estructura del Proyecto

```
sunanda-spa/
├── public/                # Assets estáticos e íconos PWA
├── src/
│   ├── core/              # Clean Architecture Core
│   │   ├── domain/        # Entidades y enums
│   │   ├── application/   # Casos de uso
│   │   └── infrastructure/# Repositorios Firebase
│   ├── presentation/      # UI Layer
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── store/         # Zustand stores
│   │   ├── context/       # React Context
│   │   └── hooks/         # Custom hooks
│   ├── shared/            # Utilidades compartidas
│   ├── styles/            # Estilos globales
│   ├── service-worker.ts  # Service Worker
│   ├── App.tsx
│   └── main.tsx
├── docs/                  # Documentación
├── vite.config.ts         # Configuración Vite + PWA
├── vercel.json            # Configuración Vercel
└── README.md
```

---

## 📜 Scripts Disponibles

```bash
npm run dev              # Dev server
npm run build            # Build producción
npm run preview          # Preview build
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript check
```

---

## 📚 Documentación

- **[README_DEPLOY.md](README_DEPLOY.md)** - Deployment completo
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Checklist paso a paso
- **[PWA_GUIDE.md](PWA_GUIDE.md)** - Progressive Web App
- **[PAYMENT_INTEGRATION_GUIDE.md](PAYMENT_INTEGRATION_GUIDE.md)** - Integración pagos
- **[FASE_8_COMPLETADA.md](FASE_8_COMPLETADA.md)** - Resumen Fase 8
- **[PROYECTO_COMPLETO.md](PROYECTO_COMPLETO.md)** - Resumen ejecutivo

---

## 🗺️ Roadmap

### ✅ Completado

- [x] Fase 1-7: Core funcional
- [x] Fase 8: PWA + Pagos + Optimizaciones + Deploy Setup

### 📋 Planeado

- [ ] Expedientes médicos detallados
- [ ] Reportes y analíticas
- [ ] Integración Stripe completa
- [ ] Sistema de inventario
- [ ] Tests E2E

---

## 🤝 Contribuir

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea tu Feature Branch
3. Commit tus cambios
4. Push a la Branch
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE)

---

## 📞 Contacto

**WhatsApp:** +506 8808-3390  
**Facebook:** [facebook.com/sunanda.spa](https://facebook.com/sunanda.spa)

---

**Hecho con ❤️ para SUNANDA Estética y Spa**
