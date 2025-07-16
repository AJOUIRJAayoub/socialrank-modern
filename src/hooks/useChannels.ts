import { useQuery } from '@tanstack/react-query';
import { Channel } from '@/types';

async function fetchChannels(search?: string): Promise<Channel[]> {
  const url = search 
    ? `/api/channels?search=${encodeURIComponent(search)}`
    : '/api/channels';
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erreur de chargement');
  return response.json();
}

export function useChannels(search?: string) {
  return useQuery({
    queryKey: ['channels', search],
    queryFn: () => fetchChannels(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
