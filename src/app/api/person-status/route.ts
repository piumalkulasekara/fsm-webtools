import { NextResponse } from 'next/server';
import { apiClient, errorHandler } from '@/lib/api';

interface ODataResponse<T> {
  '@odata.context'?: string;
  value: T[];
}

interface MetrixCodeTableItem {
  code_name: string;
  code_value: string;
  message_id: string;
}

/**
 * GET handler for person status options
 * Fetches from METRIX_CODE_TABLE with proper authentication
 */
export async function GET() {
  try {
    // Fetch person status from the OData endpoint
    const response = await apiClient.get<ODataResponse<MetrixCodeTableItem>>(
      'METRIX_CODE_TABLE', 
      {
        $select: 'code_value,message_id',
        $filter: "code_name eq 'PERSON_STATUS' and active eq 'Y'"
      }
    );
    
    // Transform the data for the dropdown
    const options = response.value.map(item => ({
      id: item.code_value,
      name: item.message_id
    }));
    
    // Return the options
    return NextResponse.json(options, { status: 200 });
  } catch (error) {
    console.error('Error fetching person status:', error);
    return errorHandler.handleError(error);
  }
} 