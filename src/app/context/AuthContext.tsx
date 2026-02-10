import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { toast } from 'sonner';

export interface User {
  id: string; // UUID de auth (para id_auth_user)
  nutriologoId?: string; // ID numérico de nutriólogos
  adminId?: string; // ID numérico de administradores
  email: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string; // Lo dejamos en la interfaz, pero lo seteamos vacío si no existe
  celular: string;
  rol: 'admin' | 'nutriologo';
  tarifa?: number;
  descripcion?: string; // Lo dejamos opcional, pero lo seteamos vacío
  fotoPerfil?: string; // Lo dejamos opcional, pero lo seteamos null
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cargar cache inmediatamente (instantáneo)
    const cached = localStorage.getItem('nutriu_user');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as User;
        setUser(parsed);
        console.log('[Auth] User cargado desde cache al inicio:', parsed.rol);
      } catch (e) {
        console.error('[Auth] Cache corrupto:', e);
        localStorage.removeItem('nutriu_user');
      }
    }

    setLoading(false); // Siempre termina loading inicial después de cache sync

    // 2. Validar sesión real (background)
    const validateSession = async () => {
      console.log('[Auth] Validando sesión real en background...');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('[Auth] Sesión válida, cargando perfil...');
          fetchUserData(session.user.id);
        } else {
          console.log('[Auth] No hay sesión activa');
          setUser(null);
          localStorage.removeItem('nutriu_user');
        }
      } catch (err) {
        console.error('[Auth] Error validando sesión:', err);
      }
    };

    validateSession();

    // Listener de cambios de auth
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        fetchUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('nutriu_user');
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    console.log('[fetchUserData] Iniciando para UUID:', userId);

    try {
      // Administradores - SOLO columnas que existen en tu tabla
      const { data: adminData } = await supabase
        .from('administradores')
        .select('id_admin, nombre, apellido, correo, numero_celular')
        .eq('id_auth_user', userId)
        .maybeSingle();

      if (adminData) {
        const newUser: User = {
          id: userId,
          adminId: adminData.id_admin.toString(),
          email: adminData.correo || '',
          nombre: adminData.nombre || '',
          apellido: adminData.apellido || '',
          nombreUsuario: '',       // No existe → vacío
          celular: adminData.numero_celular || '',
          rol: 'admin',
          descripcion: '',         // No existe → vacío
          fotoPerfil: null,        // No existe → null
        };
        console.log('[fetchUserData] Admin encontrado - UUID:', userId);
        setUser(newUser);
        localStorage.setItem('nutriu_user', JSON.stringify(newUser));
        return;
      }

      // Nutriólogos (deja como está, ya funciona)
      const { data: nutriData } = await supabase
        .from('nutriologos')
        .select('id_nutriologo, nombre, apellido, correo, numero_celular, tarifa_consulta, nombre_usuario, descripcion, foto_perfil')
        .eq('id_auth_user', userId)
        .maybeSingle();

      if (nutriData) {
        const newUser: User = {
          id: userId,
          nutriologoId: nutriData.id_nutriologo.toString(),
          email: nutriData.correo || '',
          nombre: nutriData.nombre || '',
          apellido: nutriData.apellido || '',
          nombreUsuario: nutriData.nombre_usuario || '',
          celular: nutriData.numero_celular || '',
          rol: 'nutriologo',
          tarifa: nutriData.tarifa_consulta,
          descripcion: nutriData.descripcion || '',
          fotoPerfil: nutriData.foto_perfil || null,
        };
        console.log('[fetchUserData] Nutriólogo encontrado - UUID:', userId, 'Nutri ID:', newUser.nutriologoId);
        setUser(newUser);
        localStorage.setItem('nutriu_user', JSON.stringify(newUser));
        return;
      }

      console.warn('[fetchUserData] No encontrado');
      toast.warning('No se encontró perfil asociado. Verifica tu cuenta.');
      setUser(null);
      localStorage.removeItem('nutriu_user');
    } catch (error: any) {
      console.error('[fetchUserData] Error:', error?.message || error);
      toast.error('Error cargando perfil: ' + (error?.message || 'Intenta de nuevo'));
      setUser(null);
      localStorage.removeItem('nutriu_user');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        await fetchUserData(data.user.id);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error.message);
      toast.error('Error en login: ' + (error.message || 'Credenciales inválidas'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('nutriu_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      console.warn('[updateProfile] No hay usuario autenticado');
      return;
    }

    const table = user.rol === 'admin' ? 'administradores' : 'nutriologos';

    const updateData: any = {};

    // Solo campos que existen en ambas tablas
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.apellido !== undefined) updateData.apellido = data.apellido;
    if (data.celular !== undefined) updateData.numero_celular = data.celular;

    // Campos solo para nutriólogos (admin no los tiene)
    if (user.rol === 'nutriologo') {
      if (data.tarifa !== undefined) updateData.tarifa_consulta = data.tarifa;
      if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
      if (data.fotoPerfil !== undefined) updateData.foto_perfil = data.fotoPerfil;
      if (data.nombreUsuario !== undefined) updateData.nombre_usuario = data.nombreUsuario;
    }

    if (Object.keys(updateData).length === 0) {
      console.log('[updateProfile] No hay cambios para guardar');
      return;
    }

    try {
      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id_auth_user', user.id);

      if (error) throw error;

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('nutriu_user', JSON.stringify(updatedUser));

      toast.success('Perfil actualizado correctamente');
    } catch (error: any) {
      console.error('[updateProfile] Error:', error.message);
      toast.error('No se pudo guardar el perfil: ' + (error.message || 'Intenta de nuevo'));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}