import { NextResponse } from 'next/server';

/**
 * Types of API errors
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  DATABASE = 'DATABASE_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  SERVER = 'SERVER_ERROR',
}

/**
 * Structure for API errors
 */
export interface ApiError {
  type: ErrorType;
  message: string;
  details?: unknown;
  status: number;
}

/**
 * Centralized API error handler
 */
export class ErrorHandler {
  /**
   * Handle error and return appropriate NextResponse
   */
  handleError(error: unknown): NextResponse {
    // Default error
    let apiError: ApiError = {
      type: ErrorType.SERVER,
      message: 'An unexpected error occurred',
      status: 500
    };
    
    // Format known errors
    if (error instanceof Error) {
      // Validation errors
      if (error.message.includes('Required parameter') || 
          error.message.includes('requires') ||
          error.message.includes('Invalid')) {
        apiError = {
          type: ErrorType.VALIDATION,
          message: error.message,
          status: 400
        };
      }
      // Not found errors
      else if (error.message.includes('not found')) {
        apiError = {
          type: ErrorType.NOT_FOUND,
          message: error.message,
          status: 404
        };
      }
      // Database errors
      else if (error.message.includes('Database') || 
               error.message.toLowerCase().includes('sql') ||
               error.message.toLowerCase().includes('query')) {
        apiError = {
          type: ErrorType.DATABASE,
          message: 'A database error occurred',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
          status: 500
        };
      }
      // Other known errors
      else {
        apiError = {
          type: ErrorType.SERVER,
          message: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          status: 500
        };
      }
    }
    
    // Log error for server-side debugging
    console.error(`[API Error] ${apiError.type}: ${apiError.message}`, error);
    
    // Return formatted error response
    return NextResponse.json(
      { error: apiError },
      { status: apiError.status }
    );
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler(); 