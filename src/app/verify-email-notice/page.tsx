'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail } = useAuth();
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de vérification manquant');
      return;
    }

    verifyEmailToken();
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      const response = await verifyEmail(token!);
      setStatus('success');
      setMessage('Votre email a été vérifié avec succès !');
      
      // Redirection après 3 secondes
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Erreur lors de la vérification');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader className="mx-auto h-12 w-12 text-yellow-500 animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Vérification en cours...</h2>
              <p className="text-gray-400">Veuillez patienter pendant que nous vérifions votre email.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Email vérifié !</h2>
              <p className="text-gray-400 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirection automatique...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto h-12 w-12 bg-red-500 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Erreur de vérification</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <Link
                href="/verify-email-notice"
                className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Demander un nouveau lien
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}