import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetadataService } from './service';
import type { DropdownOption, MetadataState, Language, Currency, Team, Location, Metadata } from './types';

const metadataService = MetadataService.getInstance();
const METADATA_QUERY_KEY = ['metadata', 'code-table'];
const STALE_TIME = 24 * 60 * 60 * 1000; // 24 hours

interface UseMetadataResult {
  data: MetadataState | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useMetadata(): UseMetadataResult {
  const { data, isLoading, error, refetch } = useQuery<MetadataState, Error>({
    queryKey: METADATA_QUERY_KEY,
    queryFn: () => metadataService.fetchMetadata(),
    staleTime: STALE_TIME,
    gcTime: STALE_TIME,
  });

  return {
    data: data ?? null,
    isLoading,
    error: error ?? null,
    refetch: async () => {
      await refetch();
    },
  };
}

/**
 * Hook to access FSM License options
 */
export function useFsmLicenseOptions(): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useMetadata();
  return {
    options: data?.fsmLicenses ?? [],
    isLoading,
    error,
  };
}

/**
 * Hook to access person status options
 */
export function usePersonStatusOptions(): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useMetadata();
  return {
    options: data?.personStatuses ?? [],
    isLoading,
    error,
  };
}

// Legacy hooks below - these will be updated once we implement their respective metadata endpoints

/**
 * Hook to access language options
 */
export function useLanguageOptions(): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data: metadata, isLoading, error } = useQuery<Metadata, Error>({
    queryKey: ['metadata', 'all'],
    queryFn: () => metadataService.fetchAllMetadata(),
    staleTime: STALE_TIME,
    gcTime: STALE_TIME,
  });
  
  const options = useMemo(() => {
    if (!metadata?.categories.languages) return [];
    return metadata.categories.languages.map((lang: Language) => ({
      value: lang.code,
      label: lang.name
    }));
  }, [metadata]);

  return { options, isLoading, error };
}

/**
 * Hook to access currency options
 */
export function useCurrencyOptions(): {
  options: (DropdownOption & { symbol: string })[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data: metadata, isLoading, error } = useQuery<Metadata, Error>({
    queryKey: ['metadata', 'all'],
    queryFn: () => metadataService.fetchAllMetadata(),
    staleTime: STALE_TIME,
    gcTime: STALE_TIME,
  });
  
  const options = useMemo(() => {
    if (!metadata?.categories.currencies) return [];
    return metadata.categories.currencies.map((currency: Currency) => ({
      value: currency.code,
      label: `${currency.code} - ${currency.name}`,
      symbol: currency.symbol
    }));
  }, [metadata]);

  return { options, isLoading, error };
}

/**
 * Hook to access team options
 */
export function useTeamOptions(): {
  options: (DropdownOption & { type: string })[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data: metadata, isLoading, error } = useQuery<Metadata, Error>({
    queryKey: ['metadata', 'all'],
    queryFn: () => metadataService.fetchAllMetadata(),
    staleTime: STALE_TIME,
    gcTime: STALE_TIME,
  });
  
  const options = useMemo(() => {
    if (!metadata?.categories.teams) return [];
    return metadata.categories.teams.map((team: Team) => ({
      value: team.id,
      label: team.name,
      type: team.type
    }));
  }, [metadata]);

  return { options, isLoading, error };
}

/**
 * Hook to access location options
 */
export function useLocationOptions(): {
  options: (DropdownOption & { type: string })[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data: metadata, isLoading, error } = useQuery<Metadata, Error>({
    queryKey: ['metadata', 'all'],
    queryFn: () => metadataService.fetchAllMetadata(),
    staleTime: STALE_TIME,
    gcTime: STALE_TIME,
  });
  
  const options = useMemo(() => {
    if (!metadata?.categories.locations) return [];
    return metadata.categories.locations.map((location: Location) => ({
      value: location.id,
      label: location.name,
      type: location.type
    }));
  }, [metadata]);

  return { options, isLoading, error };
} 