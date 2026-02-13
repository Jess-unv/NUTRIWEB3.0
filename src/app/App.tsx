import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider} from '@/app/context/AuthContext';
import { Login } from '@/app/components/Login';
import { ResetPassword } from '@/app/components/ResetPassword';
import { Layout } from '@/app/components/Layout';
import { Toaster } from '@/app/components/ui/sonner';
import { useAuth } from '@/app/context/useAuth';

// Admin components
import { DashboardAdmin } from '@/app/components/admin/DashboardAdmin';
import { GestionNutriologos } from '@/app/components/admin/GestionNutriologos';
import { EstadisticasAdmin } from '@/app/components/admin/EstadisticasAdmin';

// Nutriologo components
import { DashboardNutriologo } from '@/app/components/nutriologo/DashboardNutriologo';
import { GestionPacientes } from '@/app/components/nutriologo/GestionPacientes';
import { GestionCitas } from '@/app/components/nutriologo/GestionCitas';
import { GestionDietas } from '@/app/components/nutriologo/GestionDietas';
import { GestionPagos } from '@/app/components/nutriologo/GestionPagos';
import { Gamificacion } from '@/app/components/nutriologo/Gamificacion';
import { Perfil } from '@/app/components/nutriologo/Perfil';

// Componente protegido (modificado para permitir reset-password siempre)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Permitir SIEMPRE acceso a reset-password (para el flujo de recuperación)
  if (location.pathname === '/reset-password') {
    return children;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0FFF4]">
        <div className="text-[#2E8B57] font-bold text-2xl animate-pulse">
          Cargando sesión...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return null;
  }

  console.log('[AppContent] Renderizando dashboard para rol:', user.rol);

  const renderContent = () => {
    if (user.rol === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <DashboardAdmin />;
        case 'nutriologos':
          return <GestionNutriologos />;
        case 'estadisticas':
          return <EstadisticasAdmin />;
        default:
          return <DashboardAdmin />;
      }
    } else if (user.rol === 'nutriologo') {
      switch (activeTab) {
        case 'dashboard':
          return <DashboardNutriologo />;
        case 'pacientes':
          return <GestionPacientes />;
        case 'citas':
          return <GestionCitas />;
        case 'dietas':
          return <GestionDietas />;
        case 'pagos':
          return <GestionPagos />;
        case 'gamificacion':
          return <Gamificacion />;
        case 'perfil':
          return <Perfil />;
        default:
          return <DashboardNutriologo />;
      }
    } else {
      return (
        <div className="p-10 text-center text-xl text-red-600 font-bold">
          Rol no reconocido: {user.rol}
        </div>
      );
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}