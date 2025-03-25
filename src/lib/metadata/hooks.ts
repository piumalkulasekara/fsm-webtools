import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetadataService } from './service';
import type { DropdownOption, MetadataState, Team, Metadata, PlaceAddressRecord, UserRoleRecord, TeamRecord } from './types';
import type { MultiSelectOption } from '@/components/ui/multi-select';

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
 * Hook to access place-address data
 */
export function usePlaceAddressData() {
  const { data, isLoading, error } = useQuery<{ value: PlaceAddressRecord[] }, Error>({
    queryKey: ['placeAddress'],
    queryFn: async () => {
      const response = await fetch('/api/metadata/places');
      if (!response.ok) {
        throw new Error(`Failed to fetch place-address data: ${response.statusText}`);
      }
      return await response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: Infinity,
  });

  return { 
    data: data?.value ?? [], 
    isLoading, 
    error 
  };
}

/**
 * Hook to access place options (for all place-related dropdowns)
 */
export function usePlaceOptions(): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = usePlaceAddressData();
  
  const options = useMemo(() => {
    if (!data) return [];
    
    // Create a Set to track unique place_ids we've already processed
    const processedPlaceIds = new Set<string>();
    const placeOptions: DropdownOption[] = [];
    
    // Process each record
    data.forEach(record => {
      // Only process each place_id once
      if (!processedPlaceIds.has(record.place_id)) {
        processedPlaceIds.add(record.place_id);
        
        placeOptions.push({
          value: record.place_id,
          label: `${record.whos_place} - ${record.name} (${record.place_id})`
        });
      }
    });
    
    // Sort by label
    return placeOptions.sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  return {
    options,
    isLoading,
    error
  };
}

/**
 * Hook to access address options
 */
export function useAddressOptions(): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = usePlaceAddressData();
  
  const options = useMemo(() => {
    if (!data) return [];
    
    return data.map(record => {
      // Combine address parts, filtering out undefined values
      const addressParts = [
        record.address,
        record.second_address,
        record.third_address,
        record.fourth_address,
        record.city,
        record.state_prov,
        record.zippost,
        record.country
      ].filter(part => part);
      
      return {
        value: record.address_id,
        label: addressParts.join(', ')
      };
    }).sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  return {
    options,
    isLoading,
    error
  };
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

/**
 * Enhanced location options hook that works with the new place-address data
 */
export function useLocationOptionsFromPlaces(placeForStock?: string): {
  options: DropdownOption[];
  isLoading: boolean;
  error: Error | null;
  isDisabled: boolean;
} {
  const { data, isLoading, error } = usePlaceAddressData();
  
  const options = useMemo(() => {
    if (!data || !placeForStock) return [];
    
    // Create a Set to track unique locations we've already processed for this place
    const processedLocations = new Set<string>();
    const locationOptions: DropdownOption[] = [];
    
    // Filter for locations that match the place_id
    data.forEach(record => {
      if (record.place_id === placeForStock) {
        // We don't have location data in this view, so we'd need to add
        // logic to extract location information if available
        // For now, just placeholder
        const locationId = `${record.place_id}-loc`;
        
        if (!processedLocations.has(locationId)) {
          processedLocations.add(locationId);
          
          locationOptions.push({
            value: locationId,
            label: `Location for ${record.name}`
          });
        }
      }
    });
    
    return locationOptions.sort((a, b) => a.label.localeCompare(b.label));
  }, [data, placeForStock]);

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

/**
 * Hook to access user roles data
 */
export function useUserRolesData() {
  const { data, isLoading, error } = useQuery<{ value: UserRoleRecord[] }, Error>({
    queryKey: ['userRoles'],
    queryFn: async () => {
      const response = await fetch('/api/metadata/roles');
      if (!response.ok) {
        throw new Error(`Failed to fetch user roles data: ${response.statusText}`);
      }
      return await response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: Infinity,
  });

  return { 
    data: data?.value ?? [], 
    isLoading, 
    error 
  };
}

/**
 * Hook to access user role options for multi-select
 */
export function useUserRoleOptions(): {
  options: MultiSelectOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useUserRolesData();
  
  const options = useMemo(() => {
    if (!data) return [];
    
    return data.map(record => ({
      value: record.user_role,
      label: `${record.description} (${record.user_role})`
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  return {
    options,
    isLoading,
    error
  };
}

/**
 * Hook to access team data
 */
export function useTeamData() {
  const { data, isLoading, error } = useQuery<{ value: TeamRecord[] }, Error>({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await fetch('/api/metadata/teams');
      if (!response.ok) {
        throw new Error(`Failed to fetch team data: ${response.statusText}`);
      }
      return await response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: Infinity,
  });

  return { 
    data: data?.value ?? [], 
    isLoading, 
    error 
  };
}

/**
 * Hook to access allocated team options with filtering by access group (Lely Center)
 */
export function useAllocatedTeamOptions(lelyCenter?: string, viewAllTeams: boolean = false): {
  options: MultiSelectOption[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useTeamData();
  
  const options = useMemo(() => {
    if (!data) return [];
    
    // If viewAllTeams is true, return all teams regardless of lelyCenter
    // Otherwise, if lelyCenter is provided, filter teams by access_group
    const filteredTeams = viewAllTeams 
      ? data 
      : (lelyCenter 
        ? data.filter(team => team.access_group === lelyCenter)
        : data);
    
    return filteredTeams.map(team => ({
      value: team.team_id,
      label: `${team.description} (${team.access_group})`
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [data, lelyCenter, viewAllTeams]);

  return {
    options,
    isLoading,
    error
  };
} 