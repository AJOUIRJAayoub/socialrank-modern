'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<any>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://abc123go.ranki5.com/auth-api.php';

// Configuration authentification pour l'API protégée
const API_AUTH = btoa('admin:ranki5-2025');

async function apiCall(action: string, data?: any, method: string = 'POST') {
  const url = `${API_URL}?action=${action}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${API_AUTH}` // Pour passer la protection htaccess
    }
  };
  
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Erreur réseau');
  }
  
  return result;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Erreur parsing user data:', error);
          Cookies.remove('token');
          localStorage.removeItem('user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await apiCall('login', { username, password });
      
      if (data.success && data.user) {
        const userData: User = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role || 'user'
        };

        if (data.token) {
          Cookies.set('token', data.token, { expires: 7 });
        }

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        router.push('/');
      } else {
        throw new Error(data.error || 'Erreur de connexion');
      }
    } catch (error: any) {
      if (error.message.includes('email')) {
        throw new Error('Veuillez vérifier votre email avant de vous connecter');
      }
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const data = await apiCall('register', { username, email, password });
      
      if (data.success) {
        // Rediriger vers la page de notice de vérification
        router.push('/verify-email-notice?email=' + encodeURIComponent(email));
      } else {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const data = await apiCall('forgot_password', { email });
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la demande');
      }
      
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const data = await apiCall('reset_password', { token, password });
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la réinitialisation');
      }
      
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const data = await apiCall('verify_email', { token });
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la vérification');
      }
      
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const data = await apiCall('resend_verification', { email });
      
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }
      
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      forgotPassword,
      resetPassword,
      verifyEmail,
      resendVerification,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider ');
  }
  return context;
};