import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/client';
import type { TeamResponse } from '@/lib/metadata/types';

/**
 * GET handler for teams metadata
 * Fetches from TEAM with proper authentication
 */
export async function GET() {
  try {
    const response = await apiClient.get<TeamResponse>(
      'TEAM',
      {
        $select: 'team_id,description,status,access_group',
        $filter: "status eq 'ACTIVE'"
      }
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching team data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team data' },
      { status: 500 }
    );
  }
} 