import { 
  UseQueryOptions, 
  UseQueryResult, 
  useQuery
} from '@tanstack/react-query';
import { apiClient, ApiError } from './client';

/**
 * Default stale time for queries (5 minutes)
 */
const DEFAULT_STALE_TIME = 5 * 60 * 1000;

/**
 * Default cache time for queries (10 minutes)
 */
const DEFAULT_CACHE_TIME = 10 * 60 * 1000;

/**
 * Hook to fetch data from the API with caching
 */
export function useApiQuery<TData, TResult = TData>(
  queryKey: string[], 
  path: string, 
  params?: Record<string, string>,
  options?: Omit<UseQueryOptions<TData, ApiError, TResult, string[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<TResult, ApiError> {
  return useQuery<TData, ApiError, TResult, string[]>({
    queryKey,
    queryFn: async () => {
      return apiClient.get<TData>(path, params);
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
    ...options,
  });
} 