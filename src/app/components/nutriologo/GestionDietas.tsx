import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { mockPacientes, mockDietas } from '@/app/data/mockData';
import { useAuth } from '@/app/context/useAuth';
import { FileText, Download, Plus, Utensils, Coffee, Sun, Apple, Moon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function GestionDietas() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [dietaData, setDietaData] = useState({
    desayuno: '',
    comidaMediaManana: '',
    comida: '',
    merienda: '',
    cena: '',
    calorias: ''
  });

  const misPacientes = mockPacientes.filter(p => p.nutriologoId === user?.id);
  const misDietas = mockDietas.filter(d => d.nutriologoId === user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Dieta asignada exitosamente');
    setIsDialogOpen(false);
    setDietaData({
      desayuno: '',
      comidaMediaManana: '',
      comida: '',
      merienda: '',
      cena: '',
      calorias: ''
    });
    setSelectedPaciente('');
  };

  const exportarDieta = (dieta: any) => {
    toast.success('Generando PDF de la dieta...');
  };

  return (
    <div className="min-h-screen p-4 md:p-10 font-sans bg-[#F8FFF9] space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div>
            <div className="inline-flex flex-col items-start">
              <h1 className="text-3xl md:text-4xl font-[900] text-[#2E8B57] tracking-[4px] uppercase">
                Gestión de Dietas
              </h1>
              <div className="w-16 h-1.5 bg-[#3CB371] rounded-full mt-2" />
            </div>
            <p className="text-[#3CB371] font-bold text-sm mt-4 uppercase tracking-[2px]">
              Planes alimenticios personalizados
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto bg-[#2E8B57] hover:bg-[#1A3026] text-white font-black py-6 px-8 rounded-2xl shadow-lg transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                <Plus className="h-5 w-5" />
                Nueva Dieta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-2 border-[#D1E8D5] bg-white p-6 md:p-10 font-sans">
              <DialogHeader>
                <DialogTitle className="text-2xl font-[900] text-[#2E8B57] uppercase tracking-[2px]">
                  Crear Plan Nutricional
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-gray-400 tracking-[1px] ml-1">Seleccionar Paciente</Label>
                  <Select value={selectedPaciente} onValueChange={setSelectedPaciente}>
                    <SelectTrigger className="border-2 border-[#D1E8D5] rounded-xl h-12 focus:ring-[#2E8B57]">
                      <SelectValue placeholder="Elige un paciente" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2 border-[#D1E8D5]">
                      {misPacientes.map((paciente) => (
                        <SelectItem key={paciente.id} value={paciente.id} className="font-bold text-xs uppercase">
                          {paciente.nombre} {paciente.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {[
                  { id: 'desayuno', label: 'Desayuno', icon: Coffee, placeholder: 'Ej: 2 claras de huevo, avena...' },
                  { id: 'comidaMediaManana', label: 'Colación Mañana', icon: Apple, placeholder: 'Ej: Yogurt griego, almendras...' },
                  { id: 'comida', label: 'Comida Principal', icon: Sun, placeholder: 'Ej: Pechuga de pollo, arroz...' },
                  { id: 'merienda', label: 'Merienda / Snack', icon: Sparkles, placeholder: 'Ej: Fruta de temporada...' },
                  { id: 'cena', label: 'Cena', icon: Moon, placeholder: 'Ej: Pescado blanco, verduras...' },
                ].map((input) => (
                  <div key={input.id} className="space-y-2">
                    <Label htmlFor={input.id} className="text-[10px] font-black uppercase text-gray-400 tracking-[1px] ml-1 flex items-center gap-2">
                      <input.icon size={14} className="text-[#2E8B57]" /> {input.label}
                    </Label>
                    <Textarea
                      id={input.id}
                      placeholder={input.placeholder}
                      className="border-2 border-[#D1E8D5] rounded-xl focus:border-[#2E8B57] min-h-[100px] text-xs font-bold p-4"
                      value={(dietaData as any)[input.id]}
                      onChange={(e) => setDietaData({...dietaData, [input.id]: e.target.value})}
                      required
                    />
                  </div>
                ))}

                <div className="md:col-span-2 flex flex-col md:flex-row gap-3 pt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 border-2 border-[#D1E8D5] text-gray-400 font-black text-[10px] uppercase rounded-xl h-14 hover:bg-gray-50"
                  >
                    Descartar
                  </Button>
                  <Button type="submit" className="flex-1 bg-[#2E8B57] text-white font-black text-[10px] uppercase rounded-xl h-14 hover:bg-[#1A3026]">
                    Asignar Plan al Paciente
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Listado de Dietas - Grid Responsive */}
        <div className="grid grid-cols-1 gap-8">
          {misDietas.map((dieta) => {
            const paciente = mockPacientes.find(p => p.id === dieta.pacienteId);
            return (
              <Card key={dieta.id} className="rounded-[2.5rem] border-2 border-[#D1E8D5] shadow-sm overflow-hidden bg-white hover:border-[#2E8B57] transition-all duration-300">
                <CardHeader className="p-6 md:p-8 border-b border-[#F0FFF4] bg-[#F8FFF9]/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center border-2 border-[#D1E8D5]">
                        <Utensils className="text-[#2E8B57]" size={20} />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-[900] text-[#1A3026] uppercase tracking-[1px]">
                          Plan Nutricional: {paciente?.nombre} {paciente?.apellido}
                        </CardTitle>
                        <p className="text-[10px] font-black text-[#3CB371] uppercase tracking-widest mt-1">
                          Emitido el {dieta.fecha} • {dieta.calorias} KCAL OBJETIVO
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => exportarDieta(dieta)}
                      className="border-2 border-[#D1E8D5] text-[#2E8B57] font-black text-[10px] uppercase rounded-xl hover:bg-[#F0FFF4] px-6 h-10"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[
                      { label: 'Desayuno', val: dieta.comidas.desayuno, icon: Coffee, bg: 'bg-orange-50', text: 'text-orange-700' },
                      { label: 'Colación', val: dieta.comidas.comidaMediaManana, icon: Apple, bg: 'bg-green-50', text: 'text-green-700' },
                      { label: 'Comida', val: dieta.comidas.comida, icon: Sun, bg: 'bg-blue-50', text: 'text-blue-700' },
                      { label: 'Merienda', val: dieta.comidas.merienda, icon: Sparkles, bg: 'bg-yellow-50', text: 'text-yellow-700' },
                      { label: 'Cena', val: dieta.comidas.cena, icon: Moon, bg: 'bg-purple-50', text: 'text-purple-700' },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-3 p-4 rounded-2xl border-2 border-[#F0FFF4] hover:bg-[#F8FFF9] transition-colors">
                        <div className={`h-8 w-8 ${item.bg} ${item.text} rounded-lg flex items-center justify-center mb-2`}>
                          <item.icon size={16} />
                        </div>
                        <p className="font-[900] text-[10px] text-[#1A3026] uppercase tracking-wider">{item.label}</p>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed italic">
                          "{item.val}"
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Estado Vacío */}
        {misDietas.length === 0 && (
          <div className="bg-white rounded-[2.5rem] border-2 border-[#D1E8D5] p-20 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 bg-[#F8FFF9] rounded-3xl flex items-center justify-center mb-6 border-2 border-[#F0FFF4]">
              <FileText className="h-10 w-10 text-[#D1E8D5]" />
            </div>
            <h3 className="text-lg font-black text-[#1A3026] uppercase tracking-widest">No hay dietas activas</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2 max-w-xs">
              Comienza diseñando un plan de alimentación para tus pacientes registrados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}