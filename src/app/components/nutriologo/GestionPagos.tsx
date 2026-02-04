import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/context/supabaseClient';
import { DollarSign, Download, TrendingUp, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function GestionPagos() {
  const { user } = useAuth();
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [pendientesCobro, setPendientesCobro] = useState(0);
  const [citasEsteMes, setCitasEsteMes] = useState(0);

  useEffect(() => {
    if (!user?.nutriologoId) {
      setLoading(false);
      toast.error('No se detectó ID de nutriólogo');
      return;
    }

    const fetchPagos = async () => {
      setLoading(true);
      try {
        const nutriologoId = Number(user.nutriologoId);

        // Consulta corregida: sin alias en 'estado', join correcto a pagos y pacientes
        const { data: citasData, error: errCitas } = await supabase
          .from('citas')
          .select(`
            id_cita,
            fecha_hora,
            estado,
            pacientes!inner (nombre, apellido, correo),
            pagos!left (monto, estado)
          `)
          .eq('id_nutriologo', nutriologoId)
          .order('fecha_hora', { ascending: false });

        if (errCitas) throw errCitas;

        // Formatear y calcular
        const citasFormateadas = citasData?.map(c => {
          const montoTotal = c.pagos?.reduce((sum, p) => sum + Number(p.monto || 0), 0) || 0;
          const pagada = c.pagos?.some(p => p.estado === 'completado') || false;

          return {
            id: c.id_cita,
            fecha: new Date(c.fecha_hora).toLocaleDateString('es-MX'),
            hora: new Date(c.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
            estado: c.estado,
            paciente: {
              nombre: c.pacientes?.nombre || 'Sin nombre',
              apellido: c.pacientes?.apellido || '',
              email: c.pacientes?.correo || 'Sin email'
            },
            pagada,
            monto: montoTotal
          };
        }) || [];

        setCitas(citasFormateadas);

        // Cálculos reales
        const ingresos = citasFormateadas.reduce((acc, c) => acc + (c.pagada ? c.monto : 0), 0);
        const pendientes = citasFormateadas.reduce((acc, c) => acc + (!c.pagada ? c.monto : 0), 0);

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const citasMes = citasFormateadas.filter(c => new Date(c.fecha_hora) >= monthStart).length;

        setIngresosTotales(ingresos);
        setPendientesCobro(pendientes);
        setCitasEsteMes(citasMes);
      } catch (err: any) {
        console.error('Error cargando pagos:', err);
        toast.error('No se pudieron cargar los pagos');
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, [user?.nutriologoId]);

  const descargarRecibo = (id: string) => {
    toast.success(`Generando recibo de pago #${id}...`);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-10 flex items-center justify-center bg-[#F8FFF9]">
        <div className="text-[#2E8B57] font-bold text-xl animate-pulse">Cargando pagos...</div>
      </div>
    );
  }

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
                <p className="text-3xl font-[900]">{citasEsteMes} Consultas</p>
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
                {citas.map((cita) => (
                  <TableRow key={cita.id} className="border-b border-[#F0FFF4] hover:bg-[#F8FFF9] transition-colors group">
                    <TableCell className="py-6 pl-8">
                      <p className="font-black text-[#1A3026] uppercase text-xs tracking-tight">
                        {cita.paciente.nombre} {cita.paciente.apellido}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400">{cita.paciente.email}</p>
                    </TableCell>
                    <TableCell className="font-bold text-gray-600 text-xs uppercase">{cita.fecha}</TableCell>
                    <TableCell className="font-[900] text-[#1A3026] text-sm">${cita.monto.toLocaleString()}</TableCell>
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
                ))}
                {citas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      No hay transacciones registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}