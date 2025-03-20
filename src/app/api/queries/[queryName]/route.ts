import { NextRequest, NextResponse } from 'next/server';
import { queryService, errorHandler } from '@/lib/api';

/**
 * GET handler for dynamic queries
 * Executes a query based on the queryName parameter and search params
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { queryName: string } }
) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const queryName = params.queryName;
    
    // Convert searchParams to a plain object for the query service
    const queryParams: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      if (queryParams[key]) {
        // If the key already exists, convert to array or push to existing array
        if (Array.isArray(queryParams[key])) {
          (queryParams[key] as string[]).push(value);
        } else {
          queryParams[key] = [queryParams[key] as string, value];
        }
      } else {
        queryParams[key] = value;
      }
    });
    
    // Execute the query
    const result = await queryService.executeQueryById(queryName, queryParams);
    
    // Return results
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // Use centralized error handler
    return errorHandler.handleError(error);
  }
} 