import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/client';
import type { GlobalCodeTableResponse } from '@/lib/metadata/types';

/**
 * GET handler for global code table metadata
 * Fetches from GLOBAL_CODE_TABLE with proper authentication
 */
export async function GET() {
  try {
    const response = await apiClient.get<GlobalCodeTableResponse>(
      'GLOBAL_CODE_TABLE',
      {
        $select: 'code_name,code_value,description',
        $filter: "(code_name eq 'PLACE_RELATIONSHIP' or code_name eq 'LOCALE_CODE' or code_name eq 'POSTING_GROUP' or code_name eq 'ACCESS_GROUP' or code_name eq 'PERSON_GROUP' or code_name eq 'ADDRESS_TYPE') and active eq 'Y'"
      }
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching global code table metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
} 