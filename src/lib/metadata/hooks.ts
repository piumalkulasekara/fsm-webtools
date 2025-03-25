import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetadataService } from './service';
import type { DropdownOption, MetadataState, Team, Metadata } from './types';

const metadataService = MetadataService.getInstance();
const METADATA_QUERY_KEY = ['metadata'];
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
  const { data, isLoading, error } = useMetadata();
  return {
    options: data?.languages ?? [],
    isLoading,
    error,
  };
}

/**
 * Hook to access currency options
 */
export function useCurrencyOptions(): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useMetadata();
  return {
    options: data?.currencies ?? [],
    isLoading,
    error,
  };
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
 * Hook to access location options with filtering by place_id
 */
export function useLocationOptions(placeForStock?: string): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
  isDisabled: boolean;
} {
  const { data, isLoading, error } = useMetadata();
  
  const options = useMemo(() => {
    if (!data?.locations || !placeForStock) return [];
    
    // Filter locations by the selected place_id
    return data.locations
      .filter(loc => loc.place_id === placeForStock)
      .map(loc => ({
        value: loc.location,
        label: loc.description
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data?.locations, placeForStock]);

  // Disabled if no place for stock is selected
  const isDisabled = !placeForStock;

  return {
    options,
    isLoading,
    error,
    isDisabled
  };
}

export function useRequestPostGroupOptions(): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useMetadata();
  return {
    options: data?.requestPostGroups ?? [],
    isLoading,
    error,
  };
}

export function useContractPostGroupOptions(): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useMetadata();
  return {
    options: data?.contractPostGroups ?? [],
    isLoading,
    error,
  };
}

export function useAccessGroupOptions(): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useMetadata();
  return {
    options: data?.accessGroups ?? [],
    isLoading,
    error,
  };
}

export function usePersonGroupOptions(): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useMetadata();
  return {
    options: data?.personGroups ?? [],
    isLoading,
    error,
  };
}

export function useAddressTypeOptions(): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useMetadata();
  return {
    options: data?.addressTypes ?? [],
    isLoading,
    error,
  };
} 