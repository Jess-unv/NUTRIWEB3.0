import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// --- INTERFACES ---
export interface User {
  id: string;
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
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  loading: boolean; // Añadido para controlar la hidratación
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- DATOS MOCK ---
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@nutriu.com',
    password: 'admin123',
    nombre: 'Admin',
    apellido: 'Principal',
    nombreUsuario: 'admin',
    celular: '5551234567',
    rol: 'admin'
  },
  {
    id: '2',
    email: 'maria@nutriu.com',
    password: 'nutri123',
    nombre: 'María',
    apellido: 'González',
    nombreUsuario: 'mariag',
    celular: '5559876543',
    rol: 'nutriologo',
    tarifa: 500
  },
  {
    id: '3',
    email: 'carlos@nutriu.com',
    password: 'nutri123',
    nombre: 'Carlos',
    apellido: 'Ramírez',
    nombreUsuario: 'carlosr',
    celular: '5551122334',
    rol: 'nutriologo',
    tarifa: 600
  }
];

// --- PROVIDER ---
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // EFECTO DE PERSISTENCIA: Se ejecuta una sola vez al cargar la app
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false); // La app está lista tras verificar localStorage
  }, []);

  // Función de Login con persistencia
  const login = (email: string, password: string): boolean => {
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password: _, ...userData } = foundUser;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  // Función de Logout (limpieza)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Actualización de perfil con persistencia
  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {/* Importante: No renderizamos los hijos hasta que loading sea false.
          Esto evita que el usuario vea el login si ya tiene sesión iniciada.
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// --- HOOK ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}