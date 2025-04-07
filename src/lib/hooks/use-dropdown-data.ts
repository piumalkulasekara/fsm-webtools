'use client';

import { useApiQuery } from '@/lib/api/hooks';

export interface DropdownOption {
  id: string;
  name: string;
  [key: string]: unknown;
}

type DropdownType = 'customers' | 'products' | 'locations';

interface DropdownResponse {
  items: DropdownOption[];
}

/**
 * Hook to fetch dropdown data with caching
 * @param type The type of dropdown data to fetch
 * @param enabled Whether to enable the query
 */
export function useDropdownData(type: DropdownType, enabled = true) {
  return useApiQuery<DropdownResponse, DropdownOption[]>(
    ['dropdowns', type],
    `/api/dropdowns?type=${type}`,
    undefined,
    {
      enabled,
      // Keep cached for 10 minutes
      staleTime: 10 * 60 * 1000,
      // Define select function to extract the items array directly
      select: (data) => data.items,
      // Fallback to empty array if error occurs
      placeholderData: { items: [] },
    }
  );
} 