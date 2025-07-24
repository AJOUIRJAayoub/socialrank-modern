'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { apiClient } from '@/services/api-client';

interface User {
  id: number;
  username: string;
  email?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Utiliser apiClient au lieu de fetch direct
      const data = await apiClient.login(username, password);
      
      // L'API retourne directement les données, pas dans data.user
      const userData = {
        id: data.id || 1,
        username: data.username || username,
        email: data.email || '',
        role: data.role || 'user'
      };
      
      if (data.token) {
        Cookies.set('token', data.token, { expires: 7 });
      }
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.push('/');
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Utiliser apiClient
      const data = await apiClient.register(username, email, password);
      
      // L'API retourne directement les données
      const userData = {
        id: data.id || Math.floor(Math.random() * 1000),
        username: data.username || username,
        email: data.email || email,
        role: data.role || 'user'
      };
      
      if (data.token) {
        Cookies.set('token', data.token, { expires: 7 });
      }
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.push('/');
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }
  };

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};