'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: number;
  username: string;
  email?: string;
  role: 'user' | 'admin';
  email_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (token: string, password: string) => Promise<{ message: string }>;
  verifyEmail: (token: string) => Promise<{ message: string }>;
  resendVerificationEmail: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuration API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://abc123go.ranki5.com/auth-api.php';
const API_AUTH = btoa('admin:ranki5-2025'); // Pour le .htpasswd

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await fetch(`${API_URL}?action=verify-token`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Authorization-Basic': `Basic ${API_AUTH}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // Token invalide
          Cookies.remove('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    }
    setIsLoading(false);
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${API_AUTH}`
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      // Sauvegarder le token et l'utilisateur
      Cookies.set('token', data.token, { expires: 7 });
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      // Redirection selon le rôle
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}?action=register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${API_AUTH}`
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      // Sauvegarder le token et l'utilisateur
      Cookies.set('token', data.token, { expires: 7 });
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      // Rediriger vers la page de vérification d'email
      router.push('/verify-email-notice');
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

  const forgotPassword = async (email: string) => {
    const response = await fetch(`${API_URL}?action=forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${API_AUTH}`
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de l\'envoi');
    }

    return data;
  };

  const resetPassword = async (token: string, password: string) => {
    const response = await fetch(`${API_URL}?action=reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${API_AUTH}`
      },
      body: JSON.stringify({ token, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la réinitialisation');
    }

    return data;
  };

  const verifyEmail = async (token: string) => {
    const response = await fetch(`${API_URL}?action=verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${API_AUTH}`
      },
      body: JSON.stringify({ token })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la vérification');
    }

    // Mettre à jour l'utilisateur si connecté
    if (user) {
      const updatedUser = { ...user, email_verified: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return data;
  };

  const resendVerificationEmail = async () => {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Non connecté');
    }

    const response = await fetch(`${API_URL}?action=resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Authorization-Basic': `Basic ${API_AUTH}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de l\'envoi');
    }

    return data;
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
      resendVerificationEmail,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};