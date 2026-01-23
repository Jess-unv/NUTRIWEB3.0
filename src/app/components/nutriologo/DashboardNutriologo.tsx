import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Users, Calendar, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';
import { mockPacientes, mockCitas, mockPagos } from '@/app/data/mockData';
import { useAuth } from '@/app/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function DashboardNutriologo() {
  const { user } = useAuth();

  // Filtrar datos por nutriólogo
  const misPacientes = mockPacientes.filter(p => p.nutriologoId === user?.id);
  const misCitas = mockCitas.filter(c => c.nutriologoId === user?.id);
  const misPagos = mockPagos.filter(p => p.nutriologoId === user?.id);

  const citasActivas = misCitas.filter(c => c.estado === 'confirmada' || c.estado === 'pendiente').length;
  const citasCompletadas = misCitas.filter(c => c.estado === 'completada').length;
  const ingresosMes = misPagos
    .filter(p => p.fecha.startsWith('2026-01'))
    .reduce((sum, p) => sum + p.monto, 0);

  // Configuración estética
  const COLORS = ['#2E8B57', '#3CB371', '#D1E8D5']; // Gama de verdes del Perfil

  const citasPorEstado = [
    { name: 'Confirmadas', value: misCitas.filter(c => c.estado === 'confirmada').length },
    { name: 'Completadas', value: citasCompletadas },
    { name: 'Pendientes', value: misCitas.filter(c => c.estado === 'pendiente').length }
  ];

  const ingresosPorMes = [
    { mes: 'Sep', ingresos: 2000 },
    { mes: 'Oct', ingresos: 2500 },
    { mes: 'Nov', ingresos: 3000 },
    { mes: 'Dic', ingresos: 2800 },
    { mes: 'Ene', ingresos: ingresosMes }
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans bg-[#F8FFF9] space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Encabezado estilo Perfil */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div>
            <div className="inline-flex flex-col items-start">
              <h1 className="text-4xl font-[900] text-[#2E8B57] tracking-[4px] uppercase">
                Panel de Control
              </h1>
              <div className="w-16 h-1.5 bg-[#3CB371] rounded-full mt-2" />
            </div>
            <p className="text-[#3CB371] font-bold text-sm mt-4 uppercase tracking-[2px]">
              Bienvenido de nuevo, {user?.nombre}
            </p>
          </div>
        </div>

        {/* Tarjetas de estadísticas con estilo Perfil */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Mis Pacientes', val: misPacientes.length, desc: 'Pacientes activos', icon: Users, color: '#2E8B57' },
            { title: 'Citas Activas', val: citasActivas, desc: `${citasCompletadas} completadas`, icon: Calendar, color: '#3CB371' },
            { title: 'Ingresos Mes', val: `$${ingresosMes.toLocaleString()}`, desc: 'Enero 2026', icon: DollarSign, color: '#2E8B57' },
            { title: 'Consultas Totales', val: misCitas.length, desc: 'Histórico global', icon: TrendingUp, color: '#3CB371' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border-2 border-[#D1E8D5] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-[2px] text-gray-500">{stat.title}</span>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div className="text-3xl font-black text-[#1A3026] tracking-tight">{stat.val}</div>
              <p className="text-[10px] font-bold text-[#3CB371] uppercase mt-1 tracking-wider">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Gráficas con bordes redondeados y estilo visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#D1E8D5] shadow-sm">
            <h3 className="text-lg font-black text-[#1A3026] uppercase tracking-[2px] mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#2E8B57]" /> Ingresos por Mes
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ingresosPorMes}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0FFF4" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#1A3026', fontWeight: 'bold', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#1A3026', fontWeight: 'bold', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#F0FFF4'}} contentStyle={{borderRadius: '15px', border: '2px solid #D1E8D5'}} />
                  <Bar dataKey="ingresos" fill="#2E8B57" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#D1E8D5] shadow-sm">
            <h3 className="text-lg font-black text-[#1A3026] uppercase tracking-[2px] mb-6 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#2E8B57]" /> Estado de Citas
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={citasPorEstado}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {citasPorEstado.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '15px', border: '2px solid #D1E8D5'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {citasPorEstado.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}} />
                    <span className="text-[9px] font-black uppercase text-gray-500">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Próximas citas con estilo de lista de Perfil */}
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#D1E8D5] shadow-sm">
          <h3 className="text-lg font-black text-[#1A3026] uppercase tracking-[3px] mb-8">Próximas Citas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {misCitas
              .filter(c => c.estado === 'confirmada')
              .slice(0, 6)
              .map((cita) => {
                const paciente = mockPacientes.find(p => p.id === cita.pacienteId);
                return (
                  <div key={cita.id} className="flex items-center justify-between p-5 bg-white border-2 border-[#F0FFF4] hover:border-[#D1E8D5] rounded-3xl transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-[#F0FFF4] rounded-2xl flex items-center justify-center border border-[#D1E8D5]">
                        <Users className="h-6 w-6 text-[#2E8B57]" />
                      </div>
                      <div>
                        <p className="font-black text-[#1A3026] uppercase text-sm tracking-tight">
                          {paciente?.nombre} {paciente?.apellido}
                        </p>
                        <p className="text-[11px] font-bold text-[#3CB371] uppercase tracking-tighter">
                          {cita.fecha} • {cita.hora}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#2E8B57] text-lg">${cita.monto}</p>
                      <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${cita.pagada ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                        {cita.pagada ? 'Pagada' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}