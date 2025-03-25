import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/client';
import type { UserRoleResponse } from '@/lib/metadata/types';

/**
 * GET handler for user roles metadata
 * Fetches from USER_ROLE with proper authentication
 */
export async function GET() {
  try {
    const response = await apiClient.get<UserRoleResponse>(
      'USER_ROLE',
      {
        $select: 'user_role,description'
      }
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching user roles data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user roles data' },
      { status: 500 }
    );
  }
} 