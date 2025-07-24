'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Loader2 } from 'lucide-react';

// Fonction pour extraire l'ID YouTube d'une URL
function extractYoutubeId(url: string): string | null {
  // Nettoyer l'URL
  url = url.trim();
  
  // Patterns pour différents formats YouTube
  const patterns = [
    /youtube\.com\/channel\/([^\/\?]+)/,
    /youtube\.com\/c\/([^\/\?]+)/,
    /youtube\.com\/@([^\/\?]+)/,
    /youtube\.com\/user\/([^\/\?]+)/,
    /youtu\.be\/([^\/\?]+)/,
    /youtube\.com\/watch\?v=([^&]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  // Si c'est juste un ID ou @username direct
  if (url.match(/^@?[A-Za-z0-9_-]+$/)) {
    return url.replace('@', '');
  }
  
  return null;
}

// Fonction pour extraire le nom de la chaîne
function extractChannelName(url: string): string {
  // Si c'est un @username
  const atMatch = url.match(/@([^\/\?]+)/);
  if (atMatch) return atMatch[1];
  
  // Si c'est /c/channelname
  const cMatch = url.match(/\/c\/([^\/\?]+)/);
  if (cMatch) return cMatch[1];
  
  // Si c'est /user/username
  const userMatch = url.match(/\/user\/([^\/\?]+)/);
  if (userMatch) return userMatch[1];
  
  // Par défaut, utiliser l'ID
  return extractYoutubeId(url) || 'Chaîne YouTube';
}

export function SubmitChannelForm() {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ type: 'error', text: 'Vous devez être connecté pour proposer une chaîne' });
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Extraire l'ID YouTube de l'URL
      const youtubeId = extractYoutubeId(url);
      console.log('YouTube ID extrait:', youtubeId);
      
      if (!youtubeId) {
        setMessage({ type: 'error', text: 'URL YouTube invalide. Formats acceptés: youtube.com/@channel, youtube.com/channel/ID' });
        setIsLoading(false);
        return;
      }
      
      // Extraire le nom de la chaîne
      const nom = extractChannelName(url);
      console.log('Nom extrait:', nom);
      
      // Récupérer le token depuis les cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      console.log('Token trouvé:', !!token);
      
      const payload = { 
        youtubeId, 
        url, 
        nom,
        token
      };
      console.log('Payload envoyé:', payload);
      
      // Appeler directement l'API PHP (temporaire pour tester)
      const response = await fetch('https://abc123go.ranki5.com/api.php?action=submit_channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Erreur lors de la soumission');
      }
      
      setMessage({ 
        type: 'success', 
        text: data.message || 'Chaîne proposée avec succès ! Elle apparaîtra après vérification.' 
      });
      setUrl('');
      
      // Recharger la page après 2 secondes si on est sur /youtube
      if (window.location.pathname === '/youtube') {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      
    } catch (error: any) {
      console.error('Erreur submit:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Erreur lors de la soumission' 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-500" />
        Proposer une chaîne
      </h3>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' 
            : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="https://youtube.com/@NomDeLaChaine"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Formats acceptés: youtube.com/@channel, youtube.com/channel/ID, youtube.com/c/channel
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !user}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Proposer cette chaîne
            </>
          )}
        </button>
        
        {!user && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Connectez-vous pour proposer des chaînes
          </p>
        )}
      </form>
      
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          💡 Les chaînes proposées apparaissent dans cette page après validation.
          Le Top 100 mondial est réservé aux plus grandes chaînes.
        </p>
      </div>
    </div>
  );
}