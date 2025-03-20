import { 
  QueryClient, 
  UseMutationOptions, 
  UseMutationResult, 
  UseQueryOptions, 
  UseQueryResult, 
  useMutation, 
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

/**
 * Hook to create a mutation (POST, PUT, PATCH, DELETE) to the API
 */
export function useApiMutation<TData, TVariables>(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables, unknown>, 'mutationFn'>
): UseMutationResult<TData, ApiError, TVariables, unknown> {
  return useMutation<TData, ApiError, TVariables, unknown>({
    mutationFn: async (variables: TVariables) => {
      if (method === 'DELETE') {
        return apiClient.delete<TData>(path);
      }
      return apiClient[method.toLowerCase() as 'post' | 'put' | 'patch']<TData>(path, variables);
    },
    ...options,
  });
}

/**
 * Prefetch query data and store in the cache
 */
export async function prefetchQuery<TData>(
  queryClient: QueryClient,
  queryKey: string[],
  path: string,
  params?: Record<string, string>
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return apiClient.get<TData>(path, params);
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_CACHE_TIME,
  });
}

/**
 * Invalidate queries matching the provided key to force a refetch
 */
export function invalidateQueries(
  queryClient: QueryClient, 
  queryKey: string | string[]
): Promise<void> {
  return queryClient.invalidateQueries({ 
    queryKey: typeof queryKey === 'string' ? [queryKey] : queryKey 
  });
} 