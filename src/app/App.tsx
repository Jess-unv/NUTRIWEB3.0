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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Login />;
  }

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
    } else {
      // nutriologo
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
