import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/client';
import type { MetrixCodeTableResponse } from '@/lib/metadata/types';

/**
 * GET handler for metadata
 * Fetches from METRIX_CODE_TABLE with proper authentication
 */
export async function GET() {
  try {
    const response = await apiClient.get<MetrixCodeTableResponse>(
      'METRIX_CODE_TABLE',
      {
        $select: 'code_name,code_value,message_id',
        $filter: "(code_name eq 'METRIX_USER_TYPE' or code_name eq 'PERSON_STATUS') and active eq 'Y'"
      }
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
} 