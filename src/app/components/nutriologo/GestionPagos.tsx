import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { mockPacientes, mockCitas } from '@/app/data/mockData';
import { useAuth } from '@/app/context/AuthContext';
import { DollarSign, Download, TrendingUp, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

// EL NOMBRE DEBE COINCIDIR EXACTAMENTE CON EL QUE IMPORTAS EN APP.TSX
export function GestionPagos() {
  const { user } = useAuth();
  
  // Filtramos las citas que pertenecen a los pacientes de este nutriólogo
  const misCitas = mockCitas.filter(c => c.nutriologoId === user?.id);
  
  const ingresosTotales = misCitas
    .filter(c => c.pagada)
    .reduce((acc, curr) => acc + curr.monto, 0);

  const pendientesCobro = misCitas
    .filter(c => !c.pagada)
    .reduce((acc, curr) => acc + curr.monto, 0);

  const descargarRecibo = (id: string) => {
    toast.success(`Generando recibo de pago #${id}...`);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans bg-[#F8FFF9] space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div>
            <div className="inline-flex flex-col items-start">
              <h1 className="text-4xl font-[900] text-[#2E8B57] tracking-[4px] uppercase">
                Control Financiero
              </h1>
              <div className="w-16 h-1.5 bg-[#3CB371] rounded-full mt-2" />
            </div>
            <p className="text-[#3CB371] font-bold text-sm mt-4 uppercase tracking-[2px]">
              Ingresos y seguimiento de pagos
            </p>
          </div>
        </div>

        {/* Resumen de Ingresos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="rounded-[2.5rem] border-2 border-[#D1E8D5] bg-white shadow-sm overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="h-16 w-16 bg-[#F0FFF4] rounded-2xl flex items-center justify-center border-2 border-[#D1E8D5]">
                <TrendingUp className="text-[#2E8B57]" size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ingresos Totales</p>
                <p className="text-3xl font-[900] text-[#1A3026]">${ingresosTotales.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-2 border-[#D1E8D5] bg-white shadow-sm overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center border-2 border-orange-100">
                <Clock className="text-orange-600" size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pendiente de Cobro</p>
                <p className="text-3xl font-[900] text-[#1A3026]">${pendientesCobro.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-2 border-[#D1E8D5] bg-[#1A3026] shadow-xl overflow-hidden md:col-span-2 lg:col-span-1">
            <CardContent className="p-8 flex items-center gap-6 text-white">
              <div className="h-16 w-16 bg-[#2E8B57] rounded-2xl flex items-center justify-center border-2 border-[#3CB371]">
                <DollarSign className="text-white" size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Citas este mes</p>
                <p className="text-3xl font-[900]">{misCitas.length} Consultas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Transacciones */}
        <div className="bg-white rounded-[2.5rem] border-2 border-[#D1E8D5] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-[#F0FFF4] flex items-center justify-between bg-[#F8FFF9]/50">
            <h3 className="text-sm font-[900] text-[#1A3026] uppercase tracking-[2px]">
              Historial de Transacciones
            </h3>
            <CreditCard className="text-[#3CB371]" size={20} />
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-none hover:bg-transparent px-4">
                  <TableHead className="pl-8 text-[10px] font-black uppercase text-gray-400 tracking-wider">Paciente</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Fecha de Cita</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Monto</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Estado</TableHead>
                  <TableHead className="text-right pr-8 text-[10px] font-black uppercase text-gray-400 tracking-wider">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {misCitas.map((cita) => {
                  const paciente = mockPacientes.find(p => p.id === cita.pacienteId);
                  return (
                    <TableRow key={cita.id} className="border-b border-[#F0FFF4] hover:bg-[#F8FFF9] transition-colors group">
                      <TableCell className="py-6 pl-8">
                        <p className="font-black text-[#1A3026] uppercase text-xs tracking-tight">
                          {paciente?.nombre} {paciente?.apellido}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400">{paciente?.email}</p>
                      </TableCell>
                      <TableCell className="font-bold text-gray-600 text-xs uppercase">{cita.fecha}</TableCell>
                      <TableCell className="font-[900] text-[#1A3026] text-sm">${cita.monto}</TableCell>
                      <TableCell>
                        <Badge className={`
                          ${cita.pagada 
                            ? 'bg-[#F0FFF4] text-[#2E8B57] border-[#D1E8D5]' 
                            : 'bg-orange-50 text-orange-600 border-orange-100'} 
                          border-2 px-3 py-1 rounded-xl font-black text-[9px] uppercase shadow-none
                        `}>
                          {cita.pagada ? 'Completado' : 'Pendiente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => descargarRecibo(cita.id)}
                          className="text-[#2E8B57] hover:bg-[#F0FFF4] hover:text-[#1A3026] rounded-xl group-hover:scale-110 transition-transform"
                        >
                          <Download size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}