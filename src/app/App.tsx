import { useState } from 'react';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { Login } from '@/app/components/Login';
import { Layout } from '@/app/components/Layout';
import { Toaster } from '@/app/components/ui/sonner';

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

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  console.log('[AppContent] Estado actual - loading:', loading, 'user:', user);

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
    return <Login />;
  }

  // Seguridad extra: si user existe pero rol no está definido
  if (!user.rol) {
    console.error('[AppContent] User existe pero rol es undefined:', user);
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0FFF4]">
        <div className="text-red-600 font-bold text-2xl">
          Error: Sesión restaurada pero rol no detectado.  
          <br />
          Cierra sesión y vuelve a entrar.
        </div>
      </div>
    );
  }

  console.log('[AppContent] Renderizando dashboard para rol:', user.rol);

  const renderContent = () => {
    if (user.rol === 'admin') {
      switch (activeTab) {
        case 'dashboard': return <DashboardAdmin />;
        case 'nutriologos': return <GestionNutriologos />;
        case 'estadisticas': return <EstadisticasAdmin />;
        default: return <DashboardAdmin />;
      }
    } else if (user.rol === 'nutriologo') {
      switch (activeTab) {
        case 'dashboard': return <DashboardNutriologo />;
        case 'pacientes': return <GestionPacientes />;
        case 'citas': return <GestionCitas />;
        case 'dietas': return <GestionDietas />;
        case 'pagos': return <GestionPagos />;
        case 'gamificacion': return <Gamificacion />;
        case 'perfil': return <Perfil />;
        default: return <DashboardNutriologo />;
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
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}