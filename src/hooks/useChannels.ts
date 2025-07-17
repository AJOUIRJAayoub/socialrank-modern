import { useQuery } from '@tanstack/react-query';
import { Channel } from '@/types';
import { apiClient } from '@/services/api-client';

export function useChannels(search?: string) {
  return useQuery<Channel[]>({
    queryKey: ['channels', search],
    queryFn: () => apiClient.getChannels(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}