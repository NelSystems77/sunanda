import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SetupPage } from './presentation/pages/SetupPage';
import { RecordsPage } from './presentation/pages/RecordsPage';
import { PaymentsPage } from './presentation/pages/PaymentsPage';
import { AuthProvider } from './presentation/context/AuthProvider';
import { ProtectedRoute } from './presentation/components/features/ProtectedRoute';
import { UpdatePrompt, InstallPrompt } from './presentation/components/pwa/UpdatePrompt';
import {
  LandingPage,
  DashboardPage,
  LoginPage,
  ClientsPage,
  ClientDetailPage,
  AppointmentsPage,
  ServicesPage,
  InventoryPage,
} from './presentation/pages';
import { PublicServicesPage } from './presentation/pages/PublicServicesPage';
import { ForgotPasswordPage } from './presentation/pages/ForgotPasswordPage';
import { AdminBootstrapPage } from './presentation/pages/AdminBootstrapPage';
import { BookingRequestPage } from './presentation/pages/BookingRequestPage';
import { BookingSuccessPage } from './presentation/pages/BookingSuccessPage';
import { BookingRequestsPage } from './presentation/pages/BookingRequestsPage';
import { ROUTES } from './shared/constants';
import { UserRole } from './core/domain/enums/roles';
import { UsersPage } from './presentation/pages/UsersPage';
import { Header } from './presentation/components/layout/Header';
import { Footer } from './presentation/components/layout/Footer';
import { ScrollToTopButton } from './presentation/components/landing/ScrollToTopButton';

// Layout para páginas públicas
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ScrollToTopButton />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Rutas Públicas (con Header + Footer) */}
          <Route path={ROUTES.HOME} element={
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          } />
          
          <Route
            path="/setup"
            element={
              <ProtectedRoute roles={[UserRole.SUPER_ADMIN]}>
                <SetupPage />
              </ProtectedRoute>
            }
          />

          <Route path="/services" element={
            <PublicLayout>
              <PublicServicesPage />
            </PublicLayout>
          } />
          
          <Route path="/booking" element={
            <PublicLayout>
              <BookingRequestPage />
            </PublicLayout>
          } />
          
          <Route path="/booking-success" element={
            <PublicLayout>
              <BookingSuccessPage />
            </PublicLayout>
          } />
          
          {/* Login y recuperación de contraseña (sin layout) */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/admin-bootstrap" element={<AdminBootstrapPage />} />
          
          {/* Rutas Protegidas - Dashboard Admin (con DashboardLayout) */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas de Clientes */}
          <Route
            path={ROUTES.CLIENTS}
            element={
              <ProtectedRoute>
                <ClientsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard/clients/:id"
            element={
              <ProtectedRoute>
                <ClientDetailPage />
              </ProtectedRoute>
            }
          />
          
          {/* Ruta de Citas/Agenda */}
          <Route
            path={ROUTES.APPOINTMENTS}
            element={
              <ProtectedRoute>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Ruta de Servicios (Admin) */}
          <Route
            path={ROUTES.SERVICES}
            element={
              <ProtectedRoute>
                <ServicesPage />
              </ProtectedRoute>
            }
          />
          
          {/* Ruta de Expedientes ← AQUÍ ESTÁ BIEN UBICADA */}
          <Route
            path={ROUTES.MEDICAL_RECORDS}
            element={
              <ProtectedRoute>
                <RecordsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Ruta de Pagos */}
          <Route
            path="/dashboard/payments"
            element={
              <ProtectedRoute roles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta de Inventario */}
          <Route
            path="/dashboard/inventory"
            element={
              <ProtectedRoute>
                <InventoryPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta de Solicitudes de Citas (Admin) */}
          <Route
            path="/admin/booking-requests"
            element={
              <ProtectedRoute>
                <BookingRequestsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Ruta de usuarios solo para SUPER_ADMIN */}
          <Route
            path={ROUTES.USERS}
            element={
              <ProtectedRoute roles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(234, 179, 8, 0.1)',
            },
          }}
        />
        
        {/* PWA Components */}
        <UpdatePrompt />
        <InstallPrompt />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;