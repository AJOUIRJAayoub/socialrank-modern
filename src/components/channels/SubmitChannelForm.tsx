'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';

// Fonction pour extraire l'ID YouTube d'une URL
function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/channel\/([^\/\?]+)/,
    /youtube\.com\/c\/([^\/\?]+)/,
    /youtube\.com\/@([^\/\?]+)/,
    /youtube\.com\/user\/([^\/\?]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
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
      
      if (!youtubeId) {
        setMessage({ type: 'error', text: 'URL YouTube invalide' });
        setIsLoading(false);
        return;
      }
      
      // Extraire le nom de la chaîne
      const nom = extractChannelName(url);
      
      const response = await fetch('/api/channels/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeId, url, nom })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Chaîne proposée avec succès ! Elle sera vérifiée prochainement.' });
        setUrl('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la soumission' });
      }
    } catch (error) {
      console.error('Erreur submit:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la soumission' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Proposer une chaîne
      </h3>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          placeholder="https://youtube.com/@NomDeLaChaine"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          pattern="https?://(www\.)?youtube\.com/(channel/|c/|@|user/).*"
          required
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={isLoading || !user}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Envoi...' : 'Proposer cette chaîne'}
        </button>
        
        {!user && (
          <p className="text-sm text-gray-500 text-center">
            Connectez-vous pour proposer des chaînes
          </p>
        )}
      </form>
    </div>
  );
}