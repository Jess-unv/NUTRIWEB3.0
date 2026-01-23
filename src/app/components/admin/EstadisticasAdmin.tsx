import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { mockPacientes, mockCitas, mockPagos, mockNutriologos } from '@/app/data/mockData';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Users, Calendar, TrendingUp, DollarSign, Award, ArrowUpRight } from 'lucide-react';

export function EstadisticasAdmin() {
  // Memoizamos los cálculos para mejorar el rendimiento
  const stats = useMemo(() => {
    const totalPacientes = mockPacientes.length;
    const totalNutriologos = mockNutriologos.length;
    const citasMes = mockCitas.filter(c => c.fecha.startsWith('2026-01')).length;
    const ingresosMes = mockPagos
      .filter(p => p.fecha.startsWith('2026-01'))
      .reduce((sum, p) => sum + p.monto, 0);

    return { totalPacientes, totalNutriologos, citasMes, ingresosMes };
  }, []);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header con gradiente sutil */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Panel de Control</h1>
          <p className="text-muted-foreground mt-1 text-lg">Análisis de rendimiento y métricas del consultorio.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-sm">Enero 2026</span>
        </div>
      </div>

      {/* Tarjetas de Resumen con Hover Effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Pacientes Totales', value: stats.totalPacientes, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Usuarios registrados' },
          { title: 'Nutriólogos', value: stats.totalNutriologos, icon: Award, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Equipo activo' },
          { title: 'Citas del Mes', value: stats.citasMes, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', desc: '+12% vs mes anterior' },
          { title: 'Ingresos Mensuales', value: `$${stats.ingresosMes.toLocaleString()}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Facturación bruta' },
        ].map((item, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow border-none shadow-sm outline outline-1 outline-gray-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{item.title}</CardTitle>
              <div className={`p-2 rounded-md ${item.bg}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                {item.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sección de Gráficas de Tendencia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border-none ring-1 ring-gray-200">
          <CardHeader>
            <CardTitle>Flujo de Pacientes</CardTitle>
            <CardDescription>Volumen de visitas en los últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitasEjemplo}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="visitas" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none ring-1 ring-gray-200">
          <CardHeader>
            <CardTitle>Distribución de Ingresos</CardTitle>
            <CardDescription>Ingresos mensuales por consultorio (MXN)</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ingresosEjemplo}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="ingresos" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Listado de Rendimiento con Diseño de List Items */}
      <Card className="shadow-sm border-none ring-1 ring-gray-200 overflow-hidden">
        <CardHeader className="bg-white border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rendimiento por Especialista</CardTitle>
              <CardDescription>Métricas individuales de productividad y captación.</CardDescription>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:underline">Exportar reporte</button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {mockNutriologos.map((nutriologo) => {
              const pacientes = mockPacientes.filter(p => p.nutriologoId === nutriologo.id).length;
              const ingresos = mockPagos.filter(p => p.nutriologoId === nutriologo.id).reduce((sum, p) => sum + p.monto, 0);
              
              return (
                <div key={nutriologo.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                        {nutriologo.nombre[0]}{nutriologo.apellido[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{nutriologo.nombre} {nutriologo.apellido}</h4>
                        <p className="text-sm text-muted-foreground">{nutriologo.especialidad || 'Nutrición Clínica'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-8 md:w-1/2">
                    <div className="text-center md:text-left">
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Pacientes</p>
                      <p className="text-xl font-bold text-emerald-600">{pacientes}</p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Citas</p>
                      <p className="text-xl font-bold text-blue-600">
                        {mockCitas.filter(c => c.nutriologoId === nutriologo.id).length}
                      </p>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Ingresos</p>
                      <p className="text-xl font-bold text-amber-600">${ingresos.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Datos de ejemplo para las gráficas
const visitasEjemplo = [
  { mes: 'Ago', visitas: 45 }, { mes: 'Sep', visitas: 52 }, { mes: 'Oct', visitas: 58 },
  { mes: 'Nov', visitas: 65 }, { mes: 'Dic', visitas: 62 }, { mes: 'Ene', visitas: 74 }
];

const ingresosEjemplo = [
  { mes: 'Ago', ingresos: 22500 }, { mes: 'Sep', ingresos: 26000 }, { mes: 'Oct', ingresos: 29000 },
  { mes: 'Nov', ingresos: 32500 }, { mes: 'Dic', ingresos: 31000 }, { mes: 'Ene', ingresos: 42000 }
];