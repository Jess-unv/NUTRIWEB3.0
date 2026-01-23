import { useState, useEffect, memo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { 
  User, 
  Lock, 
  Leaf, 
  Apple, 
  Stethoscope, 
  HeartPulse, 
  Salad, 
  ChevronRight, 
  AlertCircle,
  Activity,
  Eye,
  EyeOff,
  X
} from 'lucide-react';

// --- FONDO ANIMADO INDEPENDIENTE (MEMOIZADO) ---
const FloatingBackground = memo(() => {
  const icons = [
    <Leaf size={40} />, <Apple size={40} />, 
    <Stethoscope size={40} />, <HeartPulse size={40} />, 
    <Salad size={40} />, <Activity size={40} />
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#F0FFF4]">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute opacity-0 animate-float-random"
          style={{
            left: `${(i * 13) % 100}%`,
            top: `${(i * 7) % 100}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${15 + (i % 10)}s`,
            color: '#2D6A4F',
          }}
        >
          {icons[i % icons.length]}
        </div>
      ))}
    </div>
  );
});

FloatingBackground.displayName = 'FloatingBackground';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: 'error' | 'success' } | null>(null);
  const { login } = useAuth();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const validateEmail = (email: string) => {
    const allowedDomains = /@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|nutriu\.com)$/i;
    return allowedDomains.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setNotification({ msg: 'Por favor, completa todos los campos', type: 'error' });
      return;
    }

    if (!validateEmail(email)) {
      setNotification({ msg: 'Usa un correo válido (Gmail, Hotmail, etc.)', type: 'error' });
      return;
    }

    const success = login(email, password);
    if (!success) {
      setNotification({ msg: 'Credenciales incorrectas', type: 'error' });
    } else {
      setNotification({ msg: '¡Bienvenido de nuevo!', type: 'success' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-sans relative overflow-hidden bg-[#F0FFF4]">
      <FloatingBackground />

      {/* Notificación Flotante */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-2 animate-slide-in ${
          notification.type === 'error' 
            ? 'bg-white border-red-200 text-red-600' 
            : 'bg-white border-green-200 text-green-600'
        }`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <Leaf size={20} />}
          <p className="font-bold text-sm uppercase tracking-tight">{notification.msg}</p>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-50 transition-opacity">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_60px_rgba(45,106,79,0.15)] border-2 border-[#D1E8D5] overflow-hidden z-10 relative">
        
        {/* Header con Nombre y Línea */}
        <div className="px-8 pt-12 pb-6 text-center">
          <div className="inline-flex flex-col items-center">
            <h1 className="text-4xl font-[900] text-[#2E8B57] tracking-[4px]">NUTRI U</h1>
            <div className="w-12 h-1.5 bg-[#3CB371] rounded-full mt-2" />
          </div>
          <p className="text-[#4A4A4A] text-[11px] font-bold mt-6 uppercase tracking-[3px] opacity-70">
            Panel de Acceso
          </p>
        </div>

        <div className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Correo */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[2px] text-[#4A4A4A] ml-1">
                Correo Institucional
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2E8B57]">
                  <User size={20} />
                </div>
                <input
                  type="email"
                  placeholder="ejemplo@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#D1E8D5] rounded-2xl focus:border-[#2E8B57] focus:ring-4 focus:ring-green-50 outline-none transition-all text-[#1A3026] font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[2px] text-[#4A4A4A] ml-1">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2E8B57]">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-[#D1E8D5] rounded-2xl focus:border-[#2E8B57] focus:ring-4 focus:ring-green-50 outline-none transition-all text-[#1A3026] shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0AEC0] hover:text-[#2E8B57] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#2E8B57] hover:bg-[#3CB371] text-white font-black text-sm uppercase tracking-[3px] rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-[0.97] flex items-center justify-center gap-3 mt-4"
            >
              Entrar al Sistema
              <ChevronRight size={20} />
            </button>
          </form>

          <p className="text-center text-[10px] text-[#A0AEC0] mt-10 font-black tracking-[4px] uppercase">
            Nutri U • v1.0
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes floatRandom {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .animate-float-random {
          animation: floatRandom linear infinite;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
}