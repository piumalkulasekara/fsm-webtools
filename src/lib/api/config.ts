/**
 * API configuration for OData services
 */

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_ODATA_API_URL || '',
  username: process.env.ODATA_API_USERNAME || '',
  password: process.env.ODATA_API_PASSWORD || '',
};

/**
 * Generate Base64 Authentication header from username and password
 */
export const getAuthHeader = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: we don't expose credentials to the client
    return '';
  }

  // Server-side: create Base64 auth header
  const credentials = `${API_CONFIG.username}:${API_CONFIG.password}`;
  const encoded = Buffer.from(credentials).toString('base64');
  return `Basic ${encoded}`;
};

/**
 * Get the API base URL
 */
export const getApiBaseUrl = (): string => {
  return API_CONFIG.baseUrl;
}; 