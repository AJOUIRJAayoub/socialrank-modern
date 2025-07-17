'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ThumbsUp } from 'lucide-react';

const THEMES = [
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'musique', label: 'Musique', icon: '🎵' },
  { id: 'education', label: 'Éducation', icon: '📚' },
  { id: 'divertissement', label: 'Divertissement', icon: '😄' },
  { id: 'tech', label: 'Tech', icon: '💻' },
  { id: 'cuisine', label: 'Cuisine', icon: '🍳' },
  { id: 'sport', label: 'Sport', icon: '⚽' },
  { id: 'beaute', label: 'Beauté', icon: '💄' },
  { id: 'voyage', label: 'Voyage', icon: '✈️' },
];

interface ThemeVotingProps {
  channelId: number;
  currentTheme?: string;
}

export function ThemeVoting({ channelId, currentTheme }: ThemeVotingProps) {
  const { user } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState(false);
  
  useEffect(() => {
    // Charger les votes existants
    fetchVotes();
  }, [channelId]);
  
  const fetchVotes = async () => {
    try {
      const response = await fetch(`/api/channels/${channelId}/votes`);
      const data = await response.json();
      setVotes(data.votes || {});
      setHasVoted(data.userVote !== null);
      setSelectedTheme(data.userVote);
    } catch (error) {
      console.error('Erreur lors du chargement des votes:', error);
    }
  };
  
  const handleVote = async (theme: string) => {
    if (!user) {
      alert('Connectez-vous pour voter');
      return;
    }
    
    if (hasVoted && selectedTheme !== theme) {
      if (!confirm('Voulez-vous changer votre vote ?')) {
        return;
      }
    }
    
    try {
      const response = await fetch('/api/channels/vote-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, theme })
      });
      
      if (response.ok) {
        setSelectedTheme(theme);
        setHasVoted(true);
        // Recharger les votes
        fetchVotes();
      }
    } catch (error) {
      console.error('Erreur lors du vote:', error);
    }
  };
  
  const getTotalVotes = () => Object.values(votes).reduce((sum, count) => sum + count, 0);
  const getPercentage = (theme: string) => {
    const total = getTotalVotes();
    return total > 0 ? Math.round((votes[theme] || 0) / total * 100) : 0;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ThumbsUp className="w-5 h-5" />
        Voter pour le thème principal
      </h3>
      
      <div className="grid grid-cols-3 gap-3">
        {THEMES.map(theme => {
          const voteCount = votes[theme.id] || 0;
          const percentage = getPercentage(theme.id);
          const isSelected = selectedTheme === theme.id;
          const isWinning = theme.id === currentTheme;
          
          return (
            <button
              key={theme.id}
              onClick={() => handleVote(theme.id)}
              disabled={!user}
              className={`relative p-4 rounded-lg transition-all ${
                isSelected 
                  ? 'bg-blue-500 text-white' 
                  : isWinning
                  ? 'bg-green-100 text-green-700 border-2 border-green-500'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700'
              } ${!user ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              <div className="text-2xl mb-1">{theme.icon}</div>
              <div className="text-sm font-medium">{theme.label}</div>
              
              {voteCount > 0 && (
                <div className="mt-2">
                  <div className="text-xs">{voteCount} vote{voteCount > 1 ? 's' : ''}</div>
                  <div className="w-full bg-gray-300 rounded-full h-1 mt-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )}
              
              {isWinning && (
                <div className="absolute top-1 right-1 text-xs bg-green-500 text-white px-2 py-1 rounded">
                  Actuel
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {!user && (
        <p className="text-sm text-gray-500 text-center mt-4">
          Connectez-vous pour voter
        </p>
      )}
      
      {getTotalVotes() > 0 && (
        <p className="text-sm text-gray-600 text-center mt-4">
          Total : {getTotalVotes()} vote{getTotalVotes() > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}