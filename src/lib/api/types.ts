/**
 * OData response structure
 */
export interface ODataResponse<T> {
  '@odata.context'?: string;
  '@odata.count'?: number;
  value: T[];
}

/**
 * OData single entity response
 */
export interface ODataEntityResponse<T> {
  '@odata.context'?: string;
  '@odata.etag'?: string;
  value?: T;
}

/**
 * OData error response
 */
export interface ODataErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{
      code: string;
      target?: string;
      message: string;
    }>;
  };
}

/**
 * OData query parameters
 */
export interface ODataQueryParams {
  $select?: string;
  $filter?: string;
  $expand?: string;
  $orderby?: string;
  $top?: number | string;
  $skip?: number | string;
  $count?: boolean | string;
  $search?: string;
  [key: string]: string | number | boolean | undefined;
} 