import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/client';
import type { LocationResponse } from '@/lib/metadata/types';

/**
 * GET handler for location data
 * Fetches from LOCATION with proper authentication
 */
export async function GET() {
  try {
    const response = await apiClient.get<LocationResponse>(
      'LOCATION',
      {
        $select: 'place_id,location,description,usable',
        $filter: "usable ne 'U'"
      }
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching location data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location data' },
      { status: 500 }
    );
  }
} 