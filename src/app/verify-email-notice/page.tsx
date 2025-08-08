'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailNoticePage() {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');
  
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { resendVerification } = useAuth();

  const handleResend = async () => {
    if (!email) {
      setResendError('Email manquant');
      return;
    }

    setIsResending(true);
    setResendError('');

    try {
      await resendVerification(email);
      setResendSuccess(true);
      
      // Réinitialiser le succès après 5 secondes
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
      
    } catch (error: any) {
      setResendError(error.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center">
        
        <div className="flex justify-center mb-6">
          <Mail className="w-16 h-16 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          Vérifiez votre email
        </h1>

        <p className="text-white/80 mb-6">
          Nous avons envoyé un lien de vérification à :
        </p>

        <div className="bg-white/20 rounded-lg p-3 mb-6">
          <p className="text-white font-semibold">{email}</p>
        </div>

        <p className="text-white/70 text-sm mb-8">
          Cliquez sur le lien dans l'email pour activer votre compte. 
          N'oubliez pas de vérifier vos spams !
        </p>

        {resendSuccess && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <p className="text-green-200 text-sm">Email renvoyé avec succès !</p>
          </div>
        )}

        {resendError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-200 text-sm">{resendError}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleResend}
            disabled={isResending || resendSuccess}
            className="w-full bg-white/20 border border-white/30 text-white py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isResending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Envoi en cours...
              </div>
            ) : resendSuccess ? (
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Email envoyé
              </div>
            ) : (
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                Renvoyer l'email
              </div>
            )}
          </button>

          <Link 
            href="/login"
            className="block border border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            Retour à la connexion
          </Link>
        </div>

        <div className="mt-6">
          <p className="text-white/60 text-xs">
            Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou 
            cliquez sur "Renvoyer l'email" ci-dessus.
          </p>
        </div>

      </div>
    </div>
  );
}