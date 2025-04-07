import { NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/client';
import type { PlaceAddressResponse } from '@/lib/metadata/types';

/**
 * GET handler for places and addresses data
 * Fetches from C_LELY_PLACE_ADDRESS_VIEW with proper authentication
 */
export async function GET() {
  try {
    const response = await apiClient.get<PlaceAddressResponse>(
      'C_LELY_PLACE_ADDRESS_VIEW',
      {
        $select: 'place_id,whos_place,name,address_id,address_type,address_name,address,second_address,third_address,fourth_address,city,state_prov,zippost,country'
      }
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching places and addresses data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places and addresses data' },
      { status: 500 }
    );
  }
} 