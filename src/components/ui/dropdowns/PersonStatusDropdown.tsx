'use client';

import React, { useEffect } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { useQuery } from '@tanstack/react-query';

interface PersonStatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
}

interface PersonStatusOption {
  id: string;
  name: string;
}

/**
 * Fetch person status from the API
 */
async function fetchPersonStatus(): Promise<PersonStatusOption[]> {
  const response = await fetch('/api/person-status');
  if (!response.ok) {
    throw new Error(`Failed to fetch person status options: ${response.status}`);
  }
  return response.json();
}

/**
 * Dropdown component for selecting a person status, using TanStack Query for caching
 */
export function PersonStatusDropdown({
  value,
  onChange,
  className = '',
  placeholder,
  searchPlaceholder = 'Search status...',
}: PersonStatusDropdownProps) {
  // Use TanStack Query for data fetching with caching
  const { data, isLoading, error } = useQuery({
    queryKey: ['person-status'],
    queryFn: fetchPersonStatus,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
  });
  
  // Convert API response to Combobox options format
  const options = React.useMemo(() => 
    data?.map(item => ({
      value: item.id,
      label: item.name
    })) || [],
  [data]);
  
  // Set default value when options load and no value is selected
  // This effect only runs when the data changes, not when value changes
  useEffect(() => {
    if (options.length > 0 && !value && onChange) {
      onChange(options[0].value);
    }
  }, [options, onChange]);  // Removed 'value' from dependencies

  return (
    <div className="relative">
      <Combobox
        options={options}
        value={value}
        onValueChange={onChange}
        placeholder={placeholder || (isLoading ? "Loading..." : "Select person status")}
        searchPlaceholder={searchPlaceholder}
        className={className}
      />
      {error instanceof Error && (
        <p className="mt-1 text-red-500 text-sm">
          {error.message || 'Failed to load person status options'}
        </p>
      )}
    </div>
  );
} 