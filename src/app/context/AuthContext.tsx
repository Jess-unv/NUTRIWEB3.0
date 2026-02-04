// AuthContext.tsx (corregido)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export interface User {
  id: string;  // UUID real de Supabase Auth
  nutriologoId?: string;  // ID numérico de nutriologos (opcional)
  adminId?: string;  // ID numérico de administradores (opcional)
  email: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  celular: string;
  rol: 'admin' | 'nutriologo';
  tarifa?: number;
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
    const restoreSession = async () => {
      console.log('[Auth] Iniciando restauración al cargar/refrescar...');
      try {
        const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout en getSession')), 10000)
        );

        const { data: { session } } = await Promise.race([
          supabase.auth.getSession(),
          timeout
        ]);

        if (session?.user) {
          console.log('[Auth] Sesión restaurada, cargando perfil...');
          await fetchUserData(session.user.id);
        }
      } catch (err) {
        console.error('[Auth] Error restaurando sesión:', err);
      } finally {
        console.log('[Auth] Restauración terminada → loading = false');
        setLoading(false);
      }
    };

    restoreSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    console.log('[fetchUserData] INICIO para ID:', userId);

    try {
      // Timeout por consulta
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout en consulta Supabase')), 8000)
      );

      // Administradores
      const adminPromise = supabase
        .from('administradores')
        .select('id_admin, nombre, apellido, correo, numero_celular')
        .eq('id_auth_user', userId)
        .maybeSingle();

      const adminResult = await Promise.race([adminPromise, timeout]);
      console.log('[fetchUserData] Administradores:', adminResult);

      if (adminResult.data) {
        console.log('[fetchUserData] ADMINISTRADOR ENCONTRADO');
        setUser({
          id: userId,  // UUID real
          adminId: adminResult.data.id_admin.toString(),
          email: adminResult.data.correo || '',
          nombre: adminResult.data.nombre || '',
          apellido: adminResult.data.apellido || '',
          nombreUsuario: '',
          celular: adminResult.data.numero_celular || '',
          rol: 'admin',
        });
        return;
      }

      // Nutriólogos
      const nutriPromise = supabase
        .from('nutriologos')
        .select('id_nutriologo, nombre, apellido, correo, numero_celular, tarifa_consulta')
        .eq('id_auth_user', userId)
        .maybeSingle();

      const nutriResult = await Promise.race([nutriPromise, timeout]);
      console.log('[fetchUserData] Nutriólogos:', nutriResult);

      if (nutriResult.data) {
        console.log('[fetchUserData] NUTRIÓLOGO ENCONTRADO');
        setUser({
          id: userId,  // UUID real
          nutriologoId: nutriResult.data.id_nutriologo.toString(),
          email: nutriResult.data.correo || '',
          nombre: nutriResult.data.nombre || '',
          apellido: nutriResult.data.apellido || '',
          nombreUsuario: '',
          celular: nutriResult.data.numero_celular || '',
          rol: 'nutriologo',
          tarifa: nutriResult.data.tarifa_consulta,
        });
        return;
      }

      console.warn('[fetchUserData] No encontrado');
      setUser(null);
    } catch (error: any) {
      console.error('[fetchUserData] Error o timeout:', error.message || error);
      setUser(null);
    } finally {
      console.log('[fetchUserData] FIN');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
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
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const table = user.rol === 'admin' ? 'administradores' : 'nutriologos';
    const { error } = await supabase
      .from(table)
      .update({ nombre: data.nombre, apellido: data.apellido })
      .eq('id_auth_user', user.id);
    if (!error) setUser(prev => prev ? { ...prev, ...data } : null);
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