/**
 * Get the base URL for server-side API calls
 * Works in both development and production environments
 */
export function getServerUrl() {
  // In production on Webflow, use the public URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // In development, use localhost
  return `http://localhost:${process.env.PORT || 3000}`;
}

/**
 * Build a full URL for server-side API calls
 * @param {string} path - The API path (e.g., '/api/blogs')
 * @returns {string} - The complete API URL
 */
export function buildServerUrl(path) {
  const baseUrl = getServerUrl();
  const basePath = '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${basePath}${normalizedPath}`;
}
