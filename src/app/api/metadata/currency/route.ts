import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/client';
import type { CurrencyResponse } from '@/lib/metadata/types';

/**
 * GET handler for currency metadata
 * Fetches from currency with proper authentication
 */
export async function GET() {
  try {
    const response = await apiClient.get<CurrencyResponse>(
      'currency',
      {
        $select: 'currency,description',
        $filter: "active eq 'Y'"
      }
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching currency data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch currency data' },
      { status: 500 }
    );
  }
} 