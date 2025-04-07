import { getQueryTemplate, QueryTemplate, getAvailableTemplates } from './templates';
import { queryBuilder, QueryParams } from './builder';
import { apiClient } from '@/lib/api/client';
import { ODataResponse } from '@/lib/api/types';

/**
 * Result of executing a query
 */
export interface QueryResult<T = unknown> {
  results: T[];
  count?: number;
}

/**
 * Service for executing queries based on templates
 */
export class QueryService {
  /**
   * Execute a query using a template ID and parameters
   */
  async executeQueryById<T = unknown>(
    queryId: string,
    params: QueryParams
  ): Promise<QueryResult<T>> {
    // Get the query template
    const template = getQueryTemplate(queryId);
    if (!template) {
      throw new Error(`Query template '${queryId}' not found`);
    }

    return this.executeQueryWithTemplate<T>(template, params);
  }

  /**
   * Execute a query using a provided template and parameters
   */
  async executeQueryWithTemplate<T = unknown>(
    template: QueryTemplate,
    params: QueryParams
  ): Promise<QueryResult<T>> {
    // Build the query from the template
    // This is currently unused as we're using the existing apiClient,
    // but will be used when we implement the direct database connector
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const builtQuery = queryBuilder.buildQuery(template, params);
    
    // For now, we'll use the existing apiClient to execute the query
    // In a production implementation, this should be replaced with a proper database connection
    try {
      // Execute the query using the appropriate endpoint
      const response = await apiClient.get<ODataResponse<T>>(template.table, {
        // Pass any relevant parameters
        $top: params.limit?.toString() || template.defaultLimit?.toString() || '100',
        $orderby: template.orderBy?.[0]?.field || 'Name'
      });
      
      return {
        results: response.value,
        count: response['@odata.count']
      };
    } catch (error) {
      console.error('Query execution error:', error);
      throw new Error(`Failed to execute query '${template.id}': ${(error as Error).message}`);
    }
  }
  
  /**
   * Get a list of all available query templates
   */
  getAvailableQueries(): Array<{ id: string; description: string }> {
    return getAvailableTemplates();
  }
}

// Export singleton instance
export const queryService = new QueryService(); 