import { NextRequest, NextResponse } from 'next/server';
import { queryService } from '@/lib/api';
import { errorHandler } from '@/lib/api';

// Basic type for dropdown items
interface DropdownItem {
  id: string;
  name: string;
  [key: string]: unknown;
}

/**
 * GET handler for dropdown data
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  try {
    // Validate request
    if (!type) {
      return NextResponse.json({ error: 'Missing dropdown type parameter' }, { status: 400 });
    }
    
    let queryId: string;
    
    // Map dropdown type to query ID
    switch (type) {
      case 'customers':
        queryId = 'dropdowns-customers';
        break;
      case 'products':
        queryId = 'dropdowns-products';
        break;
      case 'locations':
        queryId = 'dropdowns-locations';
        break;
      default:
        return NextResponse.json({ error: 'Invalid dropdown type' }, { status: 400 });
    }
    
    // Execute the query using our new query service
    const queryParams = { 
      limit: searchParams.get('limit') || '100',
    };
    
    const result = await queryService.executeQueryById<DropdownItem>(queryId, queryParams);
    
    // Return the items
    return NextResponse.json({
      items: result.results
    }, { status: 200 });
  } catch (error) {
    return errorHandler.handleError(error);
  }
} 