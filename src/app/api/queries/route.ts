import { NextResponse } from 'next/server';
import { queryService, errorHandler } from '@/lib/api';

/**
 * GET handler to list all available queries
 */
export async function GET() {
  try {
    // Get all available query templates
    const queries = queryService.getAvailableQueries();
    
    // Return the list
    return NextResponse.json({ queries }, { status: 200 });
  } catch (error) {
    // Use centralized error handler
    return errorHandler.handleError(error);
  }
} 