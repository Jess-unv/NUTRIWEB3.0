import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Users, Calendar, TrendingUp, DollarSign, Activity, ArrowUpRight } from 'lucide-react';
import { mockPacientes, mockCitas, mockPagos } from '@/app/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';

export function DashboardAdmin() {
  // --- Lógica original mantenida ---
  const totalPacientes = mockPacientes.length;
  const citasHoy = mockCitas.filter(c => c.fecha === '2026-01-16').length;
  const citasMes = mockCitas.filter(c => c.fecha.startsWith('2026-01')).length;
  const ingresosMes = mockPagos
    .filter(p => p.fecha.startsWith('2026-01'))
    .reduce((sum, p) => sum + p.monto, 0);

  const citasPorDia = [
    { dia: 'Lun', citas: 3 },
    { dia: 'Mar', citas: 5 },
    { dia: 'Mié', citas: 4 },
    { dia: 'Jue', citas: 6 },
    { dia: 'Vie', citas: 7 },
    { dia: 'Sab', citas: 2 },
    { dia: 'Dom', citas: 1 }
  ];

  const ingresosPorSemana = [
    { semana: 'Sem 1', ingresos: 4500 },
    { semana: 'Sem 2', ingresos: 5200 },
    { semana: 'Sem 3', ingresos: 6100 },
    { semana: 'Sem 4', ingresos: 5800 }
  ];

  return (
    <div className="min-h-screen p-4 md:p-10 font-sans bg-[#F8FFF9] space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Encabezado Estilizado */}
        <div className="px-2">
          <div className="inline-flex flex-col items-start">
            <h1 className="text-3xl md:text-4xl font-[900] text-[#1A3026] tracking-[4px] uppercase leading-none">
              Dashboard <span className="text-[#2E8B57]">Admin</span>
            </h1>
            <div className="w-16 h-1.5 bg-[#3CB371] rounded-full mt-3" />
          </div>
          <p className="text-[#3CB371] font-bold text-sm mt-4 uppercase tracking-[2px]">
            Vista general del consultorio NUTRI U
          </p>
        </div>

        {/* Tarjetas de Estadísticas con diseño de burbuja */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Pacientes" 
            value={totalPacientes} 
            sub="Pacientes activos" 
            icon={<Users size={20} />} 
            color="bg-emerald-50 text-emerald-600" 
          />
          <StatCard 
            title="Citas Este Mes" 
            value={citasMes} 
            sub={`+${citasHoy} agendadas hoy`} 
            icon={<Calendar size={20} />} 
            color="bg-blue-50 text-blue-600" 
          />
          <StatCard 
            title="Ingresos Mensuales" 
            value={`$${ingresosMes.toLocaleString()}`} 
            sub="Enero 2026" 
            icon={<DollarSign size={20} />} 
            color="bg-yellow-50 text-yellow-600" 
          />
          <StatCard 
            title="Tasa Asistencia" 
            value="92%" 
            sub="+5% vs mes anterior" 
            icon={<TrendingUp size={20} />} 
            color="bg-purple-50 text-purple-600" 
          />
        </div>

        {/* Sección de Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfica de Barras */}
          <Card className="rounded-[2.5rem] border-2 border-[#D1E8D5] overflow-hidden bg-white shadow-sm">
            <CardHeader className="bg-[#F8FFF9] border-b border-[#F0FFF4] p-8">
              <CardTitle className="text-xs font-[900] text-[#1A3026] uppercase tracking-[2px] flex items-center gap-2">
                <Activity size={18} className="text-[#2E8B57]" /> Volumen de Citas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={citasPorDia}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0FFF4" />
                  <XAxis 
                    dataKey="dia" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#F8FFF9'}}
                    contentStyle={{borderRadius: '15px', border: '2px solid #D1E8D5', fontWeight: 'bold'}}
                  />
                  <Bar dataKey="citas" radius={[10, 10, 10, 10]} barSize={35}>
                    {citasPorDia.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2E8B57' : '#3CB371'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfica de Líneas */}
          <Card className="rounded-[2.5rem] border-2 border-[#D1E8D5] overflow-hidden bg-white shadow-sm">
            <CardHeader className="bg-[#F8FFF9] border-b border-[#F0FFF4] p-8">
              <CardTitle className="text-xs font-[900] text-[#1A3026] uppercase tracking-[2px] flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-600" /> Rendimiento Semanal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ingresosPorSemana}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0FFF4" />
                  <XAxis 
                    dataKey="semana" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                  />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '15px', border: '2px solid #D1E8D5', fontWeight: 'bold'}} />
                  <Line 
                    type="smooth" 
                    dataKey="ingresos" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Actividad Reciente */}
        <Card className="rounded-[2.5rem] border-2 border-[#D1E8D5] overflow-hidden bg-white shadow-sm">
          <CardHeader className="bg-[#F8FFF9] border-b border-[#F0FFF4] p-8 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-[900] text-[#1A3026] uppercase tracking-[2px]">
              Actividad Reciente
            </CardTitle>
            <ArrowUpRight className="text-[#3CB371]" size={20} />
          </CardHeader>
          <CardContent className="p-4 md:p-8">
            <div className="space-y-4">
              {mockCitas.slice(0, 5).map((cita) => {
                const paciente = mockPacientes.find(p => p.id === cita.pacienteId);
                return (
                  <div key={cita.id} className="flex items-center justify-between p-5 bg-[#F8FFF9] border-2 border-[#F0FFF4] rounded-3xl hover:border-[#D1E8D5] transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center border-2 border-[#D1E8D5] group-hover:scale-110 transition-transform">
                        <Users className="h-5 w-5 text-[#2E8B57]" />
                      </div>
                      <div>
                        <p className="font-[900] text-[#1A3026] uppercase text-[11px] tracking-wide">
                          {paciente?.nombre} {paciente?.apellido}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                          {cita.fecha} • {cita.hora}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-1.5 text-[9px] font-[900] uppercase rounded-xl border-2 tracking-widest ${
                        cita.estado === 'completada' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        cita.estado === 'confirmada' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        cita.estado === 'pendiente' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {cita.estado}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente auxiliar para las tarjetas de estadísticas
function StatCard({ title, value, sub, icon, color }: { title: string, value: string | number, sub: string, icon: any, color: string }) {
  return (
    <Card className="rounded-[2.5rem] border-2 border-[#D1E8D5] bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${color} border-2 border-white shadow-sm`}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-[900] text-gray-400 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-3xl font-[900] text-[#1A3026] tracking-tight">{value}</p>
          <p className="text-[10px] font-bold text-[#3CB371] mt-2 uppercase">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}