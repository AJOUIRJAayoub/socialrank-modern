'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import { LogIn, Eye, EyeOff, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';

function LoginFormContent() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    // Vérifier si l'utilisateur vient d'être vérifié
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setShowVerifiedMessage(true);
      // Masquer le message après 10 secondes
      setTimeout(() => {
        setShowVerifiedMessage(false);
      }, 10000);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.username, formData.password);
    } catch (err) {
      console.error('Erreur connexion:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full">
        
        {/* Message de succès après vérification */}
        {showVerifiedMessage && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6 flex items-start">
            <CheckCircle className="w-6 h-6 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-200 font-semibold mb-1">
                🎉 Email vérifié avec succès !
              </p>
              <p className="text-green-100 text-sm">
                Votre compte est maintenant activé. Vous pouvez vous connecter ci-dessous.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LogIn className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Connexion
          </h1>
          <p className="text-white/80">
            Connectez-vous à votre compte Ranki5
          </p>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-200 text-sm">{error}</p>
                {error.includes('email') && (
                  <div className="mt-2">
                    <Link 
                      href="/verify-email-notice"
                      className="inline-flex items-center text-red-100 hover:text-white text-sm underline"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Renvoyer l'email de vérification
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
              Email ou nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="votre@email.com"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Votre mot de passe"
                className="w-full px-4 py-3 pr-12 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                Connexion en cours...
              </div>
            ) : (
              <div className="flex items-center">
                <LogIn className="w-4 h-4 mr-2" />
                Se connecter
              </div>
            )}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <Link 
              href="/forgot-password" 
              className="text-white/80 hover:text-white text-sm underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Pas encore de compte ?{' '}
              <Link href="/auth/register" className="text-white hover:underline font-medium">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <LogIn className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Chargement...
          </h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}