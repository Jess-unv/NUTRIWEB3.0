import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/app/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/app/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { UserPlus, Edit, Trash2, Eye, EyeOff, Save, X, AlertTriangle, BadgeDollarSign, Mail, Phone, UserCircle } from 'lucide-react';
import { mockNutriologos, agregarNutriologo, actualizarNutriologo, eliminarNutriologo, Nutriologo as MockNutriologo } from '@/app/data/mockData';
import { toast } from 'sonner';

export function GestionNutriologos() {
  const [nutriologos, setNutriologos] = useState<MockNutriologo[]>(mockNutriologos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    email: '',
    celular: '',
    contrasena: '',
    tarifa: ''
  });

  // --- Lógica de handlers original (Mantenida exactamente igual) ---
  const handleInputChange = (field: string, value: string) => {
    if (field === 'celular') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [field]: numericValue }));
    } else if (field === 'tarifa') {
      const numericValue = value.replace(/[^\d.]/g, '');
      const parts = numericValue.split('.');
      if (parts.length <= 2) setFormData(prev => ({ ...prev, [field]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.contrasena.length < 6) { toast.error('La contraseña debe tener al menos 6 caracteres'); return; }
    if (formData.celular.length !== 10) { toast.error('El número celular debe tener 10 dígitos'); return; }
    const tarifaNum = parseFloat(formData.tarifa);
    if (isNaN(tarifaNum) || tarifaNum <= 0) { toast.error('La tarifa debe ser un número mayor a 0'); return; }

    const nuevoNutriologo: MockNutriologo = {
      id: String(Date.now()),
      nombre: formData.nombre,
      apellido: formData.apellido,
      nombreUsuario: formData.nombreUsuario,
      email: formData.email,
      celular: formData.celular,
      contrasena: formData.contrasena,
      tarifa: Number(tarifaNum.toFixed(2)),
      fechaRegistro: new Date().toISOString()
    };

    agregarNutriologo(nuevoNutriologo);
    setNutriologos([...mockNutriologos]);
    toast.success('Nutriólogo registrado exitosamente');
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (nutriologo: MockNutriologo) => {
    setEditingId(nutriologo.id);
    setFormData({
      nombre: nutriologo.nombre,
      apellido: nutriologo.apellido,
      nombreUsuario: nutriologo.nombreUsuario,
      email: nutriologo.email,
      celular: nutriologo.celular,
      contrasena: '',
      tarifa: nutriologo.tarifa.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingId) return;
    if (formData.celular.length !== 10) { toast.error('El número celular debe tener 10 dígitos'); return; }
    const tarifaNum = parseFloat(formData.tarifa);
    if (isNaN(tarifaNum) || tarifaNum <= 0) { toast.error('La tarifa debe ser un número mayor a 0'); return; }

    const nutriologoActualizado: MockNutriologo = {
      id: editingId,
      nombre: formData.nombre,
      apellido: formData.apellido,
      nombreUsuario: formData.nombreUsuario,
      email: formData.email,
      celular: formData.celular,
      tarifa: Number(tarifaNum.toFixed(2)),
      ...(formData.contrasena && formData.contrasena.length >= 6 && { contrasena: formData.contrasena })
    };

    actualizarNutriologo(nutriologoActualizado);
    setNutriologos([...mockNutriologos]);
    toast.success('Nutriólogo actualizado exitosamente');
    setIsEditDialogOpen(false);
    resetForm();
    setEditingId(null);
  };

  const handleDelete = (id: string, nombre: string, apellido: string) => {
    eliminarNutriologo(id);
    setNutriologos([...mockNutriologos]);
    toast.success(`Nutriólogo ${nombre} ${apellido} eliminado exitosamente`);
  };

  const resetForm = () => {
    setFormData({
      nombre: '', apellido: '', nombreUsuario: '',
      email: '', celular: '', contrasena: '', tarifa: ''
    });
    setShowPassword(false);
  };

  return (
    <div className="p-4 md:p-10 bg-[#F8FFF9] min-h-screen space-y-10 font-sans">
      
      {/* Header Estilizado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <div className="inline-flex flex-col items-start">
            <h1 className="text-3xl md:text-4xl font-[900] text-[#1A3026] tracking-[4px] uppercase leading-none">
              Gestión de <span className="text-[#2E8B57]">Nutriólogos</span>
            </h1>
            <div className="w-16 h-1.5 bg-[#3CB371] rounded-full mt-3" />
          </div>
          <p className="text-[#3CB371] font-bold text-sm mt-4 uppercase tracking-[2px]">
            Panel de administración de profesionales
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#2E8B57] hover:bg-[#256e45] text-white font-[900] uppercase tracking-widest text-[11px] h-14 px-8 rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95">
              <UserPlus className="h-4 w-4 mr-3" />
              Registrar Nutriólogo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-[2.5rem] border-2 border-[#D1E8D5] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-[900] text-[#1A3026] uppercase tracking-tight">Nuevo Profesional</DialogTitle>
              <DialogDescription className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                Ingresa las credenciales para el nuevo miembro de NUTRI U
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-[900] uppercase text-[#1A3026] ml-1">Nombre</Label>
                <Input value={formData.nombre} onChange={(e) => handleInputChange('nombre', e.target.value)} placeholder="Ej: Juan" className="rounded-xl border-2 border-[#F0FFF4] focus:border-[#D1E8D5] h-12 bg-[#F8FFF9] font-bold" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-[900] uppercase text-[#1A3026] ml-1">Apellido</Label>
                <Input value={formData.apellido} onChange={(e) => handleInputChange('apellido', e.target.value)} placeholder="Ej: Pérez" className="rounded-xl border-2 border-[#F0FFF4] focus:border-[#D1E8D5] h-12 bg-[#F8FFF9] font-bold" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-[900] uppercase text-[#1A3026] ml-1">Usuario</Label>
                <Input value={formData.nombreUsuario} onChange={(e) => handleInputChange('nombreUsuario', e.target.value)} placeholder="juan.perez" className="rounded-xl border-2 border-[#F0FFF4] focus:border-[#D1E8D5] h-12 bg-[#F8FFF9] font-mono font-bold" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-[900] uppercase text-[#1A3026] ml-1">Email</Label>
                <Input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="rounded-xl border-2 border-[#F0FFF4] focus:border-[#D1E8D5] h-12 bg-[#F8FFF9] font-bold" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-[900] uppercase text-[#1A3026] ml-1">Celular</Label>
                <Input value={formData.celular} onChange={(e) => handleInputChange('celular', e.target.value)} maxLength={10} className="rounded-xl border-2 border-[#F0FFF4] h-12 bg-[#F8FFF9] font-bold" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-[900] uppercase text-[#1A3026] ml-1">Tarifa ($)</Label>
                <Input value={formData.tarifa} onChange={(e) => handleInputChange('tarifa', e.target.value)} className="rounded-xl border-2 border-[#F0FFF4] h-12 bg-[#F8FFF9] font-bold" required />
              </div>
              <div className="space-y-2 md:col-span-2 relative">
                <Label className="text-[10px] font-[900] uppercase text-[#1A3026] ml-1">Contraseña</Label>
                <Input type={showPassword ? "text" : "password"} value={formData.contrasena} onChange={(e) => handleInputChange('contrasena', e.target.value)} className="rounded-xl border-2 border-[#F0FFF4] h-12 bg-[#F8FFF9] font-bold pr-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-9 text-gray-400 hover:text-[#2E8B57]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <DialogFooter className="md:col-span-2 pt-6">
                <Button type="submit" className="w-full bg-[#2E8B57] hover:bg-[#256e45] h-14 rounded-2xl font-[900] uppercase tracking-widest text-[11px]">
                  Confirmar Registro
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla Principal */}
      <Card className="rounded-[2.5rem] border-2 border-[#D1E8D5] overflow-hidden bg-white shadow-sm">
        <CardHeader className="bg-[#F8FFF9] border-b border-[#F0FFF4] p-8 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xs font-[900] text-[#1A3026] uppercase tracking-[2px]">Nutriólogos Registrados</CardTitle>
            <p className="text-[10px] font-bold text-[#3CB371] uppercase mt-1 tracking-wider">Total: {nutriologos.length} Profesionales</p>
          </div>
          <UserCircle className="text-[#3CB371] opacity-20" size={40} />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="border-b border-[#F0FFF4] hover:bg-transparent">
                <TableHead className="py-6 px-8 text-[10px] font-[900] uppercase text-gray-400 tracking-widest">Profesional</TableHead>
                <TableHead className="text-[10px] font-[900] uppercase text-gray-400 tracking-widest">Contacto</TableHead>
                <TableHead className="text-[10px] font-[900] uppercase text-gray-400 tracking-widest text-center">Tarifa</TableHead>
                <TableHead className="text-right py-6 px-8 text-[10px] font-[900] uppercase text-gray-400 tracking-widest">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nutriologos.map((nutriologo) => (
                <TableRow key={nutriologo.id} className="border-b border-[#F8FFF9] hover:bg-[#F8FFF9]/50 transition-colors group">
                  <TableCell className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-[#F8FFF9] border-2 border-[#D1E8D5] rounded-2xl flex items-center justify-center font-[900] text-[#2E8B57] text-sm group-hover:bg-[#2E8B57] group-hover:text-white transition-all duration-300">
                        {nutriologo.nombre[0]}{nutriologo.apellido[0]}
                      </div>
                      <div>
                        <p className="font-[900] text-[#1A3026] uppercase text-[12px] tracking-tight">{nutriologo.nombre} {nutriologo.apellido}</p>
                        <p className="font-mono text-[10px] text-gray-400 font-bold">@{nutriologo.nombreUsuario}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase">
                        <Mail size={12} className="text-[#3CB371]" /> {nutriologo.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase">
                        <Phone size={12} className="text-[#3CB371]" /> {nutriologo.celular}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-[#2E8B57] font-[900] text-[12px]">
                      <BadgeDollarSign size={14} /> ${nutriologo.tarifa.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-6 px-8">
                    <div className="flex justify-end gap-3">
                      
                      {/* Botón Editar con Dialog */}
                      <Dialog open={isEditDialogOpen && editingId === nutriologo.id} onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open) { resetForm(); setEditingId(null); }
                      }}>
                        <DialogTrigger asChild>
                          <Button onClick={() => handleEdit(nutriologo)} variant="ghost" className="h-10 w-10 p-0 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                            <Edit size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-[2.5rem] border-2 border-[#D1E8D5] p-8">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-[900] text-[#1A3026] uppercase tracking-tight">Editar Profesional</DialogTitle>
                          </DialogHeader>
                          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Inputs de edición similares al registro */}
                            <div className="space-y-2"><Label className="text-[10px] font-[900] uppercase text-[#1A3026]">Nombre</Label><Input value={formData.nombre} onChange={(e) => handleInputChange('nombre', e.target.value)} className="rounded-xl border-2 border-[#F0FFF4] h-12 bg-[#F8FFF9] font-bold" /></div>
                            <div className="space-y-2"><Label className="text-[10px] font-[900] uppercase text-[#1A3026]">Apellido</Label><Input value={formData.apellido} onChange={(e) => handleInputChange('apellido', e.target.value)} className="rounded-xl border-2 border-[#F0FFF4] h-12 bg-[#F8FFF9] font-bold" /></div>
                            <div className="space-y-2 md:col-span-2"><Label className="text-[10px] font-[900] uppercase text-[#1A3026]">Email</Label><Input value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="rounded-xl border-2 border-[#F0FFF4] h-12 bg-[#F8FFF9] font-bold" /></div>
                            <div className="space-y-2"><Label className="text-[10px] font-[900] uppercase text-[#1A3026]">Celular</Label><Input value={formData.celular} onChange={(e) => handleInputChange('celular', e.target.value)} className="rounded-xl border-2 border-[#F0FFF4] h-12 bg-[#F8FFF9] font-bold" /></div>
                            <div className="space-y-2"><Label className="text-[10px] font-[900] uppercase text-[#1A3026]">Tarifa</Label><Input value={formData.tarifa} onChange={(e) => handleInputChange('tarifa', e.target.value)} className="rounded-xl border-2 border-[#F0FFF4] h-12 bg-[#F8FFF9] font-bold" /></div>
                            
                            <DialogFooter className="md:col-span-2 pt-6">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button className="w-full bg-[#2E8B57] hover:bg-[#256e45] h-14 rounded-2xl font-[900] uppercase tracking-widest text-[11px]">
                                    Guardar Cambios
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-[2.5rem] border-2 border-[#D1E8D5] p-8">
                                  <AlertDialogHeader>
                                    <div className="flex items-center gap-4 mb-4">
                                      <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Save size={24}/></div>
                                      <AlertDialogTitle className="font-[900] uppercase tracking-tight">¿Confirmar cambios?</AlertDialogTitle>
                                    </div>
                                    <AlertDialogDescription className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">La información del profesional será actualizada permanentemente.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="mt-8 gap-4">
                                    <AlertDialogCancel className="h-12 rounded-xl font-[900] uppercase text-[10px]">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleUpdate} className="h-12 rounded-xl bg-blue-600 font-[900] uppercase text-[10px]">Sí, Guardar</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      {/* Botón Eliminar */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" className="h-10 w-10 p-0 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem] border-2 border-red-100 p-8">
                          <AlertDialogHeader>
                            <div className="flex items-center gap-4 mb-4">
                              <div className="p-3 bg-red-50 rounded-2xl text-red-600"><AlertTriangle size={24}/></div>
                              <AlertDialogTitle className="font-[900] uppercase tracking-tight text-red-600">Eliminar Nutriólogo</AlertDialogTitle>
                            </div>
                            <AlertDialogDescription className="font-bold text-gray-500 uppercase text-[10px] tracking-widest leading-relaxed">
                              ¿Estás seguro de eliminar a <span className="text-[#1A3026] text-[12px]">{nutriologo.nombre} {nutriologo.apellido}</span>? <br/>
                              Esta acción es irreversible y se perderán todos los datos vinculados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-8 gap-4">
                            <AlertDialogCancel className="h-12 rounded-xl border-2 font-[900] uppercase text-[10px] tracking-widest">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(nutriologo.id, nutriologo.nombre, nutriologo.apellido)} className="h-12 rounded-xl bg-red-600 hover:bg-red-700 font-[900] uppercase text-[10px] tracking-widest">Eliminar Profesional</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}