'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Token de vérification manquant');
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyEmail(token);
        setStatus('success');
        setMessage(result.message || 'Email vérifié avec succès !');
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 3000);
        
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Erreur lors de la vérification');
      }
    };

    verify();
  }, [searchParams, verifyEmail, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center">
        
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-6">
              <Loader className="w-16 h-16 text-white animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Vérification en cours...
            </h1>
            <p className="text-white/80">
              Veuillez patienter pendant que nous vérifions votre email.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Email vérifié !
            </h1>
            <p className="text-white/80 mb-6">
              {message}
            </p>
            <p className="text-sm text-white/60 mb-4">
              Redirection automatique vers la page de connexion...
            </p>
            <Link 
              href="/login"
              className="inline-block bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Me connecter maintenant
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-6">
              <XCircle className="w-16 h-16 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Erreur de vérification
            </h1>
            <p className="text-white/80 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Link 
                href="/login"
                className="block bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Aller à la connexion
              </Link>
              <Link 
                href="/register"
                className="block border border-white text-white px-6 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                Créer un nouveau compte
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <Loader className="w-16 h-16 text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Chargement...
          </h1>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}