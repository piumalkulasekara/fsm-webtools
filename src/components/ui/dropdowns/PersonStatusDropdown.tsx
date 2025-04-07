'use client';

import React, { useEffect } from 'react';
import { Combobox } from '@/components/ui/combobox';
import { usePersonStatusOptions } from '@/lib/metadata/hooks';

interface PersonStatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
}

/**
 * Dropdown component for selecting a person status, using metadata service for data
 */
export function PersonStatusDropdown({
  value,
  onChange,
  className = '',
  placeholder,
  searchPlaceholder = 'Search status...',
}: PersonStatusDropdownProps) {
  const { options, isLoading, error } = usePersonStatusOptions();
  
  // Set default value when options load and no value is selected
  useEffect(() => {
    if (options.length > 0 && !value && onChange) {
      onChange(options[0].value);
    }
  }, [options, onChange, value]);

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