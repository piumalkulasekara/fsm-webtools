import { QueryTemplate } from './templates';

/**
 * Parameters for building a query
 */
export interface QueryParams {
  [key: string]: string | number | boolean | string[] | null | undefined;
}

/**
 * Result of building a SQL query
 */
export interface BuiltQuery {
  sql: string;
  params: Array<string | number | boolean | Array<string | number>>;
}

/**
 * Builds SQL queries from templates
 */
export class QueryBuilder {
  /**
   * Build a SQL query from a template and parameters
   */
  buildQuery(template: QueryTemplate, params: QueryParams): BuiltQuery {
    const sqlParams: Array<string | number | boolean | Array<string | number>> = [];
    
    // Build SELECT clause
    let sql = `SELECT ${template.columns.join(', ')} FROM ${template.table}`;
    
    // Add JOINs if any
    if (template.joins && template.joins.length > 0) {
      template.joins.forEach(join => {
        sql += ` ${join.type.toUpperCase()} JOIN ${join.table} ON ${join.on}`;
      });
    }
    
    // Build WHERE clause from conditions
    const whereConditions: string[] = [];
    
    if (template.conditions && template.conditions.length > 0) {
      template.conditions.forEach(condition => {
        const value = params[condition.paramName];
        
        // Skip if parameter is not provided and not required
        if (value === undefined || value === null) {
          if (condition.required) {
            throw new Error(`Required parameter '${condition.paramName}' is missing`);
          }
          return;
        }
        
        let whereClause: string;
        const operator = condition.operator || 'eq';
        
        switch (operator) {
          case 'eq':
            whereClause = `${condition.field} = ?`;
            sqlParams.push(value);
            break;
          case 'gt':
            whereClause = `${condition.field} > ?`;
            sqlParams.push(value);
            break;
          case 'lt':
            whereClause = `${condition.field} < ?`;
            sqlParams.push(value);
            break;
          case 'like':
            whereClause = `${condition.field} LIKE ?`;
            sqlParams.push(`%${value}%`);
            break;
          case 'in':
            if (Array.isArray(value) && value.length > 0) {
              const placeholders = value.map(() => '?').join(', ');
              whereClause = `${condition.field} IN (${placeholders})`;
              sqlParams.push(...value);
            } else {
              // Skip this condition if array is empty
              return;
            }
            break;
          case 'between':
            if (Array.isArray(value) && value.length === 2) {
              whereClause = `${condition.field} BETWEEN ? AND ?`;
              sqlParams.push(value[0], value[1]);
            } else {
              throw new Error(`'between' operator requires an array with exactly 2 values`);
            }
            break;
          default:
            throw new Error(`Unknown operator: ${operator}`);
        }
        
        whereConditions.push(whereClause);
      });
    }
    
    // Add WHERE clause if there are conditions
    if (whereConditions.length > 0) {
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    // Add GROUP BY if specified
    if (template.groupBy && template.groupBy.length > 0) {
      sql += ` GROUP BY ${template.groupBy.join(', ')}`;
    }
    
    // Add ORDER BY if specified
    if (template.orderBy && template.orderBy.length > 0) {
      const orderClauses = template.orderBy.map(order => {
        const direction = order.direction || 'asc';
        return `${order.field} ${direction.toUpperCase()}`;
      });
      
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }
    
    // Add LIMIT
    const limit = params.limit ? Number(params.limit) : template.defaultLimit;
    if (limit) {
      sql += ` LIMIT ?`;
      sqlParams.push(limit);
    }
    
    // Add OFFSET for pagination
    if (params.offset !== undefined) {
      sql += ` OFFSET ?`;
      sqlParams.push(Number(params.offset));
    }
    
    return { sql, params: sqlParams };
  }
}

// Export singleton instance
export const queryBuilder = new QueryBuilder(); 