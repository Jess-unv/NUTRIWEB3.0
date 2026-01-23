import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { mockPacientes, mockCitas } from '@/app/data/mockData';
import { useAuth } from '@/app/context/AuthContext';
import { Calendar, Clock, Plus, CheckCircle, History, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

export function GestionCitas() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const misPacientes = mockPacientes.filter(p => p.nutriologoId === user?.id);
  const misCitas = mockCitas.filter(c => c.nutriologoId === user?.id);

  const citasPendientes = misCitas.filter(c => c.estado === 'pendiente' || c.estado === 'confirmada');
  const citasCompletadas = misCitas.filter(c => c.estado === 'completada');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cita agendada exitosamente. Se notificará al paciente.');
    setIsDialogOpen(false);
    setSelectedPaciente('');
    setFecha('');
    setHora('');
  };

  const marcarComoCompletada = (citaId: string) => {
    toast.success('Cita marcada como completada');
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completada':
        return 'bg-[#F0FFF4] text-[#2E8B57] border-[#D1E8D5]';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelada':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans bg-[#F8FFF9] space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div>
            <div className="inline-flex flex-col items-start">
              <h1 className="text-4xl font-[900] text-[#2E8B57] tracking-[4px] uppercase">
                Gestión de Citas
              </h1>
              <div className="w-16 h-1.5 bg-[#3CB371] rounded-full mt-2" />
            </div>
            <p className="text-[#3CB371] font-bold text-sm mt-4 uppercase tracking-[2px]">
              Administra tu agenda y consultas
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2E8B57] hover:bg-[#1A3026] text-white font-black py-6 px-8 rounded-2xl shadow-lg transition-all uppercase tracking-widest text-xs flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Agendar Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] border-2 border-[#D1E8D5] bg-white p-8 max-w-md font-sans">
              <DialogHeader>
                <DialogTitle className="text-2xl font-[900] text-[#2E8B57] uppercase tracking-[2px]">
                  Nueva Consulta
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-gray-400 tracking-[1px] ml-1">Paciente</Label>
                  <Select value={selectedPaciente} onValueChange={setSelectedPaciente}>
                    <SelectTrigger className="border-2 border-[#D1E8D5] rounded-xl h-12 focus:ring-[#2E8B57]">
                      <SelectValue placeholder="Selecciona un paciente" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-[#D1E8D5]">
                      {misPacientes
                        .filter(p => {
                          const citasPagadas = misCitas.filter(c => c.pacienteId === p.id && c.pagada);
                          return citasPagadas.length > 0;
                        })
                        .map((paciente) => (
                          <SelectItem key={paciente.id} value={paciente.id} className="font-bold text-xs">
                            {paciente.nombre} {paciente.apellido}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[9px] font-bold text-gray-400 uppercase leading-tight mt-1">
                    * Solo pacientes con suscripción activa/pagada
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha" className="text-[10px] font-black uppercase text-gray-400 tracking-[1px] ml-1">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      required
                      className="border-2 border-[#D1E8D5] rounded-xl h-12 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora" className="text-[10px] font-black uppercase text-gray-400 tracking-[1px] ml-1">Hora</Label>
                    <Input
                      id="hora"
                      type="time"
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      required
                      className="border-2 border-[#D1E8D5] rounded-xl h-12 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 border-2 border-[#D1E8D5] text-gray-400 font-black text-[10px] uppercase rounded-xl h-12 hover:bg-gray-50"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-[#2E8B57] text-white font-black text-[10px] uppercase rounded-xl h-12 hover:bg-[#1A3026]">
                    Confirmar Cita
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Citas Activas', val: citasPendientes.length, icon: Calendar, color: 'text-blue-500' },
            { label: 'Completadas', val: citasCompletadas.length, icon: CheckCircle, color: 'text-[#2E8B57]' },
            { label: 'Total del Mes', val: misCitas.length, icon: LayoutDashboard, color: 'text-purple-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border-2 border-[#D1E8D5] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-4xl font-[900] text-[#1A3026]">{stat.val}</p>
              </div>
              <div className={`p-4 rounded-2xl bg-[#F8FFF9] border border-[#D1E8D5] ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Próximas citas */}
        <Card className="rounded-[2.5rem] border-2 border-[#D1E8D5] shadow-sm overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-[#F0FFF4] bg-[#F8FFF9]/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-[900] text-[#1A3026] uppercase tracking-[2px]">Próximas Citas</CardTitle>
              <Clock className="text-[#3CB371]" size={20} />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {citasPendientes.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-[#D1E8D5]" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No hay citas pendientes</p>
                </div>
              ) : (
                citasPendientes.map((cita) => {
                  const paciente = mockPacientes.find(p => p.id === cita.pacienteId);
                  return (
                    <div key={cita.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 border-2 border-[#F0FFF4] rounded-[2rem] hover:border-[#2E8B57] transition-all bg-white group">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-[#F0FFF4] rounded-2xl flex items-center justify-center border border-[#D1E8D5] group-hover:bg-[#2E8B57] transition-colors">
                          <Calendar className="h-6 w-6 text-[#2E8B57] group-hover:text-white" />
                        </div>
                        <div>
                          <p className="font-black text-[#1A3026] uppercase text-sm tracking-tight">
                            {paciente?.nombre} {paciente?.apellido}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                              <Calendar className="h-3 w-3 text-[#3CB371]" /> {cita.fecha}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                              <Clock className="h-3 w-3 text-[#3CB371]" /> {cita.hora}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-4 md:mt-0">
                        <Badge className={`${getEstadoBadge(cita.estado)} border-2 px-3 py-1 rounded-xl font-black text-[9px] uppercase shadow-none`}>
                          {cita.estado}
                        </Badge>
                        <Badge className={`${cita.pagada ? 'bg-[#F0FFF4] text-[#2E8B57]' : 'bg-red-50 text-red-600'} border-2 px-3 py-1 rounded-xl font-black text-[9px] uppercase shadow-none`}>
                          {cita.pagada ? 'PAGADA' : 'PENDIENTE PAGO'}
                        </Badge>
                        {cita.estado === 'confirmada' && (
                          <Button 
                            size="sm"
                            onClick={() => marcarComoCompletada(cita.id)}
                            className="bg-white border-2 border-[#2E8B57] text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white font-black text-[9px] uppercase rounded-xl px-4 transition-all"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Finalizar
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Historial de citas */}
        <Card className="rounded-[2.5rem] border-2 border-[#D1E8D5] shadow-sm overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-[#F0FFF4] bg-[#F8FFF9]/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-[900] text-[#1A3026] uppercase tracking-[2px]">Historial de Consultas</CardTitle>
              <History className="text-[#3CB371]" size={20} />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {citasCompletadas.map((cita) => {
                const paciente = mockPacientes.find(p => p.id === cita.pacienteId);
                return (
                  <div key={cita.id} className="flex items-center justify-between p-5 bg-[#F8FFF9] border border-[#D1E8D5] rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-[#D1E8D5]">
                        <CheckCircle size={18} className="text-[#2E8B57]" />
                      </div>
                      <div>
                        <p className="font-black text-[#1A3026] uppercase text-xs">
                          {paciente?.nombre} {paciente?.apellido}
                        </p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">
                          {cita.fecha} • {cita.hora}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-2 border-[#D1E8D5] text-[#2E8B57] font-black text-[8px] uppercase px-2 py-0.5 rounded-lg mb-1">
                        COMPLETADA
                      </Badge>
                      <p className="text-xs font-black text-[#1A3026] tracking-tight">${cita.monto}</p>
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