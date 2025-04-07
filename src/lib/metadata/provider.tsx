'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { metadataService } from './service';
import type { Metadata } from './types';

interface MetadataContextType {
  metadata: Metadata | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const MetadataContext = createContext<MetadataContextType>({
  metadata: null,
  isLoading: true,
  error: null,
  refetch: async () => {},
});

/**
 * Provider component for application metadata
 */
export function MetadataProvider({ children }: { children: React.ReactNode }) {
  const {
    data: metadata,
    isLoading,
    error,
    refetch
  } = useQuery<Metadata | null, Error>({
    queryKey: ['metadata'],
    queryFn: async () => {
      const needsUpdate = await metadataService.checkMetadataVersion();
      if (needsUpdate) {
        const newMetadata = await metadataService.fetchAllMetadata();
        await metadataService.saveMetadata(newMetadata);
        return newMetadata;
      }
      return metadataService.getStoredMetadata();
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: Infinity, // Previously cacheTime in v4
  });

  // Check for metadata updates periodically
  useEffect(() => {
    const checkInterval = setInterval(async () => {
      const needsUpdate = await metadataService.checkMetadataVersion();
      if (needsUpdate) {
        await refetch();
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(checkInterval);
  }, [refetch]);

  const value: MetadataContextType = {
    metadata: metadata || null,
    isLoading,
    error: error as Error | null,
    refetch: async () => { await refetch(); }
  };

  return (
    <MetadataContext.Provider value={value}>
      {children}
    </MetadataContext.Provider>
  );
}

/**
 * Hook to access metadata context
 */
export function useMetadata() {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }
  return context;
} 