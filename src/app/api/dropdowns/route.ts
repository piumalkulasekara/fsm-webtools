import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { ODataResponse } from '@/lib/api-types';

// Basic type for dropdown items
interface DropdownItem {
  id: string;
  name: string;
  [key: string]: unknown;
}

// Basic OData entity structure (extend as needed)
interface ODataEntity {
  Id?: string;
  Name?: string;
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
    
    let endpoint: string;
    let transformFn: (data: ODataEntity[]) => DropdownItem[];
    
    // Route to the correct endpoint based on dropdown type
    switch (type) {
      case 'customers':
        endpoint = 'Customers';
        transformFn = transformCustomers;
        break;
      case 'products':
        endpoint = 'Products';
        transformFn = transformProducts;
        break;
      case 'locations':
        endpoint = 'Locations';
        transformFn = transformLocations;
        break;
      default:
        return NextResponse.json({ error: 'Invalid dropdown type' }, { status: 400 });
    }
    
    // Fetch data from OData
    const queryParams = { 
      $top: '100', // Limit to 100 items
      $orderby: 'Name'
    };
    
    const response = await apiClient.get<ODataResponse<ODataEntity>>(endpoint, queryParams);
    
    // Transform the data for dropdown consumption
    const items = transformFn(response.value);
    
    return NextResponse.json({
      items
    }, { status: 200 });
  } catch (error) {
    console.error('Dropdown data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dropdown data' },
      { status: 500 }
    );
  }
}

/**
 * Transform customer data for dropdown usage
 */
function transformCustomers(data: ODataEntity[]): DropdownItem[] {
  return data.map(item => ({
    id: item.CustomerId as string || item.Id as string,
    name: item.Name as string,
  }));
}

/**
 * Transform product data for dropdown usage
 */
function transformProducts(data: ODataEntity[]): DropdownItem[] {
  return data.map(item => ({
    id: item.ProductId as string || item.Id as string,
    name: item.Name as string,
  }));
}

/**
 * Transform location data for dropdown usage
 */
function transformLocations(data: ODataEntity[]): DropdownItem[] {
  return data.map(item => ({
    id: item.LocationId as string || item.Id as string,
    name: item.Name as string,
  }));
} 