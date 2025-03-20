/**
 * Templates for SQL queries that can be dynamically generated
 */

/**
 * Structure for a dynamic query template
 */
export interface QueryTemplate {
  id: string;
  description: string;
  table: string;
  columns: string[];
  conditions?: Array<{
    field: string;
    paramName: string;
    operator?: 'eq' | 'gt' | 'lt' | 'like' | 'in' | 'between'; // default: 'eq'
    required?: boolean;
  }>;
  joins?: Array<{
    type: 'inner' | 'left' | 'right';
    table: string;
    on: string;
  }>;
  groupBy?: string[];
  orderBy?: Array<{
    field: string;
    direction?: 'asc' | 'desc'; // default: 'asc'
  }>;
  defaultLimit?: number; // default: 100
}

/**
 * Collection of all query templates, indexed by ID
 */
export const queryTemplates: Record<string, QueryTemplate> = {
  // Dropdown queries - moving from the existing dropdowns API
  'dropdowns-customers': {
    id: 'dropdowns-customers',
    description: 'List of customers for dropdown selection',
    table: 'Customers',
    columns: ['CustomerId as id', 'Name as name'],
    orderBy: [{ field: 'Name' }],
    defaultLimit: 100
  },
  'dropdowns-products': {
    id: 'dropdowns-products',
    description: 'List of products for dropdown selection',
    table: 'Products', 
    columns: ['ProductId as id', 'Name as name'],
    orderBy: [{ field: 'Name' }],
    defaultLimit: 100
  },
  'dropdowns-locations': {
    id: 'dropdowns-locations',
    description: 'List of locations for dropdown selection',
    table: 'Locations',
    columns: ['LocationId as id', 'Name as name'],
    orderBy: [{ field: 'Name' }],
    defaultLimit: 100
  },
};

/**
 * Get a query template by ID
 */
export function getQueryTemplate(id: string): QueryTemplate | null {
  return queryTemplates[id] || null;
}

/**
 * Get list of available query templates
 */
export function getAvailableTemplates(): Array<{ id: string; description: string }> {
  return Object.values(queryTemplates).map(template => ({
    id: template.id,
    description: template.description
  }));
} 