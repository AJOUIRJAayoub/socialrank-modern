import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';

export function useChannels(search?: string) {
  return useQuery({
    queryKey: ['channels', search],
    queryFn: async () => {
      try {
        // Utiliser apiClient.getChannels si elle existe
        if (apiClient.getChannels) {
          return await apiClient.getChannels(search);
        }
        
        // Sinon, appel direct
        const url = `${process.env.NEXT_PUBLIC_API_URL}?action=channels${search ? `&search=${encodeURIComponent(search)}` : ''}`;
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