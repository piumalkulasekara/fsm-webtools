import { getApiBaseUrl, getAuthHeader } from './config';

/**
 * Error class for API requests
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic API client for making requests to the OData service
 */
export const apiClient = {
  /**
   * Make a GET request to the OData API
   * This method is actively used throughout the application
   */
  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    return this.request('GET', path, undefined, params) as Promise<T>;
  },

  /**
   * Make a POST request to the OData API
   * Used in user creation
   */
  async post<T>(path: string, data?: unknown): Promise<T> {
    return this.request('POST', path, data) as Promise<T>;
  },

  /**
   * Make a PUT request to the OData API
   * Currently not used in the application, but kept for API completeness
   */
  async put<T>(path: string, data: unknown): Promise<T> {
    return this.request('PUT', path, data) as Promise<T>;
  },

  /**
   * Make a PATCH request to the OData API
   * Currently not used in the application, but kept for API completeness
   */
  async patch<T>(path: string, data: unknown): Promise<T> {
    return this.request('PATCH', path, data) as Promise<T>;
  },

  /**
   * Make a DELETE request to the OData API
   * Currently not directly used but referenced in api hooks
   */
  async delete<T>(path: string): Promise<T> {
    return this.request('DELETE', path) as Promise<T>;
  },

  /**
   * Generic request method for all API calls
   */
  async request(
    method: string,
    path: string,
    data?: unknown,
    params?: Record<string, string>
  ): Promise<unknown> {
    const baseUrl = getApiBaseUrl();
    const url = new URL(`${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`);

    // Add query parameters if provided
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }

    // Prepare request options
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 }, // Disable caching at the Next.js level
    };

    // Add auth header for server-side requests
    const authHeader = getAuthHeader();
    if (authHeader) {
      options.headers = {
        ...options.headers,
        'Authorization': authHeader,
      };
    }

    // Add body for non-GET requests
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url.toString(), options);

      // Handle non-2xx responses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        throw new ApiError(
          `API request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {};
      }

      // Parse JSON response
      const result = await response.json();
      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `API request failed: ${(error as Error).message}`,
        500
      );
    }
  },
}; 