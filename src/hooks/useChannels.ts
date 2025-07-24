import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';

export function useChannels(search?: string, filter: 'all' | 'top100' | 'community' = 'all') {
  return useQuery({
    queryKey: ['channels', search, filter],
    queryFn: async () => {
      try {
        // Construire l'URL avec les paramètres
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('filter', filter);
        
        const url = `${process.env.NEXT_PUBLIC_API_URL}?action=channels&${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Erreur serveur');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Erreur:', error);
        // Retourner un tableau vide en cas d'erreur
        return [];
      }
    },
    staleTime: 60 * 1000,
    retry: 1
  });
}